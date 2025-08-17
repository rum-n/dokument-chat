import { v4 as uuidv4 } from "uuid";
import { authenticateRequest } from "../../../lib/services/auth";
import pdfService from "../../../lib/services/pdfService";
import aiService from "../../../lib/services/aiService";
import { storeChunks, initQdrant } from "../../../lib/services/database";
import { PDFDatabaseService } from "../../../lib/services/pdfDatabase";
import appConfig from "../../../lib/config";
import subscriptionService from "../../../lib/services/subscriptionService";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Authenticate user
    const user = await authenticateRequest(req);

    // Initialize database
    await initQdrant();

    const form = formidable({
      maxFileSize: appConfig.upload.maxFileSizeMB * 1024 * 1024,
      keepExtensions: true,
      multiples: false,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      try {
        // Check subscription limits
        const usageStatus = await subscriptionService.getCurrentUsage(user.id);

        if (!usageStatus.canUpload) {
          return res.status(403).json({
            error:
              "Upload limit reached for today. Please upgrade your subscription for more uploads.",
          });
        }

        // Get file size from various possible properties
        const fileSizeBytes = file.size || file.bytes || 0;

        // Debug file size
        console.log("File size in bytes:", fileSizeBytes);
        console.log("File size in MB:", fileSizeBytes / (1024 * 1024));
        console.log("File object keys:", Object.keys(file));
        console.log("File object:", JSON.stringify(file, null, 2));

        // Check file size limit
        if (
          !(await subscriptionService.checkFileSizeLimit(
            user.id,
            fileSizeBytes
          ))
        ) {
          const limits = await subscriptionService.getSubscriptionLimits(
            user.id
          );
          return res.status(413).json({
            error: `File size exceeds your plan limit of ${limits.maxFileSizeMB}MB. Please upgrade your subscription.`,
          });
        }

        const pdfId = uuidv4();

        // Debug file object
        console.log("File object:", JSON.stringify(file, null, 2));
        console.log("File size property:", file.size);
        console.log("File size type:", typeof file.size);

        // Try different possible file path properties
        const filePath =
          file.filepath ||
          file.path ||
          file.tempFilePath ||
          (Array.isArray(file) ? file[0].filepath : null);

        if (!filePath) {
          console.error("Could not find file path in file object:", file);
          return res.status(400).json({ error: "Invalid file upload" });
        }

        console.log("Using file path:", filePath);

        // Process PDF
        const result = await pdfService.processPDF(filePath, pdfId);

        if (!result.chunks || result.chunks.length === 0) {
          throw new Error(
            "No text content could be extracted from the PDF. The document might be scanned or image-based."
          );
        }

        const validChunks = result.chunks.filter(
          (chunk) => chunk.text && chunk.text.trim().length > 0
        );

        if (validChunks.length === 0) {
          throw new Error(
            "No readable text content found in the PDF. The document might be scanned or image-based."
          );
        }

        // Store PDF in database first
        const pdfData = {
          filename: file.originalFilename || "uploaded_document.pdf",
          originalName: file.originalFilename || "uploaded_document.pdf",
          mimeType: file.mimetype || "application/pdf",
          size: fileSizeBytes,
          uploadPath: "processed", // Indicate file was processed, not stored locally
          pageCount: result.total_pages,
          userId: user.id,
        };

        const createdPDF = await PDFDatabaseService.createPDF(pdfData);

        // Generate embeddings for chunks
        const chunkTexts = validChunks.map((chunk) => chunk.text);
        const embeddings = await aiService.generateEmbeddings(chunkTexts);

        // Store embeddings in Qdrant with the database PDF ID
        await storeChunks(createdPDF.id, validChunks, embeddings);

        // Record the upload in subscription usage
        await subscriptionService.recordPdfUpload(user.id);

        // Store PDF chunks in database
        const chunkData = validChunks.map((chunk) => ({
          chunkId: chunk.chunk_id,
          pageNumber: chunk.page_number,
          text: chunk.text,
        }));

        await PDFDatabaseService.createPDFChunks(createdPDF.id, chunkData);

        res.json({
          pdf_id: createdPDF.id,
          filename: file.originalFilename,
          total_pages: result.total_pages,
          total_chunks: validChunks.length,
          status: "processed",
          usage: {
            remainingUploadsToday: usageStatus.remainingUploadsToday - 1,
            remainingUploadsThisMonth:
              usageStatus.remainingUploadsThisMonth - 1,
          },
        });
      } catch (error) {
        console.error("PDF processing error:", error);
        res.status(500).json({ error: error.message });
      }
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Authentication required" });
  }
}
