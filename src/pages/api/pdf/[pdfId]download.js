import { requireAuth } from '../../../lib/services/auth';
import { getPDFMetadata } from '../../../lib/services/metadata';
import fs from 'fs-extra';
import path from 'path';

export default async function handler(req, res) {
  const { pdfId } = req.query;
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await requireAuth(req, res, async () => {
      const pdfInfo = getPDFMetadata(pdfId);
      if (!pdfInfo) {
        return res.status(404).json({ error: 'PDF not found' });
      }
      if (pdfInfo.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // For now, return a simple response since we don't store file paths
      // In production, you'd store the file path or use cloud storage
      res.status(404).json({ error: 'PDF file not available for download' });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
