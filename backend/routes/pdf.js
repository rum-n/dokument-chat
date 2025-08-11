const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");
const { requireAuth } = require("../services/auth");
const pdfService = require("../services/pdfService");
const aiService = require("../services/aiService");
const { storeChunks, deletePdfChunks } = require("../services/database");
const config = require("../config");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.upload.uploadDir);
  },
  filename: (req, file, cb) => {
    const pdfId = uuidv4();
    cb(null, `${pdfId}.pdf`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSizeMB * 1024 * 1024, // Convert MB to bytes
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// In-memory storage for PDF metadata (in production, use a database)
const pdfMetadata = {};

// Upload PDF
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded",
      });
    }

    const pdfId = path.parse(req.file.filename).name;
    const filePath = req.file.path;

    // Process PDF
    const result = await pdfService.processPDF(filePath, pdfId);

    // Check if we have valid text content
    if (!result.chunks || result.chunks.length === 0) {
      throw new Error(
        "No text content could be extracted from the PDF. The document might be scanned or image-based."
      );
    }

    // Filter out chunks with empty text
    const validChunks = result.chunks.filter(
      (chunk) => chunk.text && chunk.text.trim().length > 0
    );

    if (validChunks.length === 0) {
      throw new Error(
        "No readable text content found in the PDF. The document might be scanned or image-based."
      );
    }

    // Generate embeddings for chunks
    const chunkTexts = validChunks.map((chunk) => chunk.text);
    const embeddings = await aiService.generateEmbeddings(chunkTexts);

    // Store chunks and embeddings in Qdrant
    await storeChunks(pdfId, validChunks, embeddings);

    // Store metadata
    pdfMetadata[pdfId] = {
      pdf_id: pdfId,
      filename: req.file.originalname,
      total_pages: result.total_pages,
      total_chunks: validChunks.length,
      file_path: filePath,
      user_id: req.user.id,
    };

    res.json({
      pdf_id: pdfId,
      filename: req.file.originalname,
      total_pages: result.total_pages,
      total_chunks: validChunks.length,
      status: "processed",
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up file if processing failed
    if (req.file && (await fs.pathExists(req.file.path))) {
      await fs.remove(req.file.path);
    }

    res.status(500).json({
      error: error.message,
    });
  }
});

// List PDFs
router.get("/list", requireAuth, (req, res) => {
  try {
    const userPdfs = Object.values(pdfMetadata).filter(
      (pdf) => pdf.user_id === req.user.id
    );

    const pdfList = userPdfs.map((pdf) => ({
      pdf_id: pdf.pdf_id,
      filename: pdf.filename,
      total_pages: pdf.total_pages,
      total_chunks: pdf.total_chunks,
      status: "processed",
    }));

    res.json({ pdfs: pdfList });
  } catch (error) {
    console.error("List PDFs error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Get PDF info
router.get("/:pdfId", requireAuth, (req, res) => {
  try {
    const { pdfId } = req.params;

    if (!pdfMetadata[pdfId]) {
      return res.status(404).json({
        error: "PDF not found",
      });
    }

    const pdfInfo = pdfMetadata[pdfId];

    // Check if user owns this PDF
    if (pdfInfo.user_id !== req.user.id) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    res.json({
      pdf_id: pdfId,
      filename: pdfInfo.filename,
      total_pages: pdfInfo.total_pages,
      total_chunks: pdfInfo.total_chunks,
      status: "processed",
    });
  } catch (error) {
    console.error("Get PDF info error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Download PDF
router.get("/:pdfId/download", requireAuth, async (req, res) => {
  try {
    const { pdfId } = req.params;

    if (!pdfMetadata[pdfId]) {
      return res.status(404).json({
        error: "PDF not found",
      });
    }

    const pdfInfo = pdfMetadata[pdfId];

    // Check if user owns this PDF
    if (pdfInfo.user_id !== req.user.id) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    if (!(await fs.pathExists(pdfInfo.file_path))) {
      return res.status(404).json({
        error: "PDF file not found",
      });
    }

    res.download(pdfInfo.file_path, pdfInfo.filename);
  } catch (error) {
    console.error("Download PDF error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Delete PDF
router.delete("/:pdfId", requireAuth, async (req, res) => {
  try {
    const { pdfId } = req.params;

    if (!pdfMetadata[pdfId]) {
      return res.status(404).json({
        error: "PDF not found",
      });
    }

    const pdfInfo = pdfMetadata[pdfId];

    // Check if user owns this PDF
    if (pdfInfo.user_id !== req.user.id) {
      return res.status(403).json({
        error: "Access denied",
      });
    }

    // Delete chunks from Qdrant
    await deletePdfChunks(pdfId);

    // Delete file
    if (await fs.pathExists(pdfInfo.file_path)) {
      await fs.remove(pdfInfo.file_path);
    }

    // Remove metadata
    delete pdfMetadata[pdfId];

    res.json({
      message: "PDF deleted successfully",
    });
  } catch (error) {
    console.error("Delete PDF error:", error);
    res.status(500).json({
      error: `Error deleting PDF: ${error.message}`,
    });
  }
});

module.exports = router;
