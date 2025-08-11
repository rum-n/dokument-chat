const pdfParse = require("pdf-parse");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

class PDFService {
  constructor() {
    this.chunkSize = config.upload.chunkSize;
    this.chunkOverlap = config.upload.chunkOverlap;
  }

  async processPDF(filePath, pdfId) {
    try {
      // Validate file
      await this.validatePDFFile(filePath);

      // Extract text from PDF
      const textContent = await this.extractTextFromPDF(filePath);

      // Split text into chunks
      const chunks = await this.createChunks(textContent, pdfId);

      return {
        pdf_id: pdfId,
        filename: path.basename(filePath),
        total_pages: textContent.length,
        total_chunks: chunks.length,
        chunks: chunks,
      };
    } catch (error) {
      throw new Error(`Error processing PDF: ${error.message}`);
    }
  }

  async extractTextFromPDF(filePath) {
    const textContent = [];

    try {
      // Read PDF file
      const dataBuffer = await fs.readFile(filePath);

      // Parse PDF
      const data = await pdfParse(dataBuffer);

      // Split by pages (approximate)
      const pages = this.splitIntoPages(data.text);

      pages.forEach((pageText, index) => {
        if (pageText.trim()) {
          textContent.push({
            page_number: index + 1,
            text: pageText.trim(),
            bbox: null, // pdf-parse doesn't provide bbox info
          });
        }
      });

      // If no text extracted, try OCR
      if (textContent.length === 0) {
        console.log("No text found, attempting OCR...");
        const ocrText = await this.extractTextWithOCR(filePath);
        if (ocrText) {
          textContent.push({
            page_number: 1,
            text: ocrText,
            bbox: null,
          });
        }
      }
    } catch (error) {
      console.error("Error extracting text:", error);
      throw error;
    }

    return textContent;
  }

  splitIntoPages(text) {
    // Simple page splitting based on form feeds or large spacing
    // This is an approximation since pdf-parse doesn't provide page info
    const pageSeparators = /\f|\n\s*\n\s*\n/;
    const pages = text.split(pageSeparators);

    // If no clear page separators, split by large chunks
    if (pages.length <= 1) {
      const words = text.split(/\s+/);
      const wordsPerPage = Math.ceil(words.length / 10); // Assume 10 pages
      const pages = [];

      for (let i = 0; i < words.length; i += wordsPerPage) {
        const pageWords = words.slice(i, i + wordsPerPage);
        pages.push(pageWords.join(" "));
      }

      return pages;
    }

    return pages;
  }

  async extractTextWithOCR(filePath) {
    try {
      console.log(
        "OCR processing not available in this build. Using fallback text extraction..."
      );

      // For now, return empty string since OCR requires additional setup
      // In production, you could use a cloud OCR service or install Tesseract properly
      return "";
    } catch (error) {
      console.error("OCR failed:", error);
      return "";
    }
  }

  async createChunks(textContent, pdfId) {
    const chunks = [];

    for (const pageData of textContent) {
      const pageText = pageData.text;
      const pageNumber = pageData.page_number;

      // Split page text into chunks
      const pageChunks = this.splitTextIntoChunks(pageText);

      pageChunks.forEach((chunkText, chunkIndex) => {
        if (chunkText.trim()) {
          const chunkId = uuidv4();
          chunks.push({
            chunk_id: chunkId,
            pdf_id: pdfId,
            page_number: pageNumber,
            text: chunkText.trim(),
            chunk_index: chunkIndex,
          });
        }
      });
    }

    return chunks;
  }

  splitTextIntoChunks(text) {
    const chunks = [];
    const words = text.split(/\s+/);

    let currentChunk = [];
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length > this.chunkSize) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.join(" "));

          // Add overlap
          const overlapWords = currentChunk.slice(
            -Math.floor(this.chunkOverlap / 10)
          );
          currentChunk = overlapWords;
          currentLength = overlapWords.join(" ").length;
        }
      }

      currentChunk.push(word);
      currentLength += word.length + 1; // +1 for space
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(" "));
    }

    return chunks;
  }

  async validatePDFFile(filePath) {
    try {
      // Check file size
      const stats = await fs.stat(filePath);
      const fileSizeMB = stats.size / (1024 * 1024);

      if (fileSizeMB > config.upload.maxFileSizeMB) {
        throw new Error(
          `File size (${fileSizeMB.toFixed(
            2
          )} MB) exceeds maximum allowed size (${
            config.upload.maxFileSizeMB
          } MB)`
        );
      }

      // Check file extension
      const ext = path.extname(filePath).toLowerCase();
      if (ext !== ".pdf") {
        throw new Error("File is not a valid PDF");
      }

      return true;
    } catch (error) {
      throw new Error(`File validation failed: ${error.message}`);
    }
  }
}

module.exports = new PDFService();
