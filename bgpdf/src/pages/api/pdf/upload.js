import formidable from 'formidable';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '../../../lib/services/auth';
import pdfService from '../../../lib/services/pdfService';
import aiService from '../../../lib/services/aiService';
import { storeChunks, initQdrant } from '../../../lib/services/database';
import { addPDFMetadata } from '../../../lib/services/metadata';
import config from '../../../lib/config';

export const configObj = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Initialize database
    await initQdrant();
    
    await requireAuth(req, res, async () => {
      const form = new formidable.IncomingForm({
        uploadDir: config.upload.uploadDir,
        maxFileSize: config.upload.maxFileSizeMB * 1024 * 1024,
        keepExtensions: true,
        multiples: false,
      });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
        const file = files.file;
        if (!file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
        const pdfId = uuidv4();
        const filePath = file.filepath || file.path;
        // Process PDF
        const result = await pdfService.processPDF(filePath, pdfId);
        if (!result.chunks || result.chunks.length === 0) {
          throw new Error('No text content could be extracted from the PDF. The document might be scanned or image-based.');
        }
        const validChunks = result.chunks.filter(chunk => chunk.text && chunk.text.trim().length > 0);
        if (validChunks.length === 0) {
          throw new Error('No readable text content found in the PDF. The document might be scanned or image-based.');
        }
        
        // Generate embeddings for chunks
        const chunkTexts = validChunks.map(chunk => chunk.text);
        const embeddings = await aiService.generateEmbeddings(chunkTexts);
        
        // Store embeddings in database
        await storeChunks(pdfId, validChunks, embeddings);
        
        // Store PDF metadata
        addPDFMetadata({
          pdf_id: pdfId,
          filename: file.originalFilename,
          total_pages: result.total_pages,
          total_chunks: validChunks.length,
          upload_date: new Date().toISOString(),
          file_size: file.size,
          user_id: req.user.id,
          status: 'processed',
        });
        res.json({
          pdf_id: pdfId,
          filename: file.originalFilename,
          total_pages: result.total_pages,
          total_chunks: validChunks.length,
          status: 'processed',
        });
      });
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

export { configObj as config };
