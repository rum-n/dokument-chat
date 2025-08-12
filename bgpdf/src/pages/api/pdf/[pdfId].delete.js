import { requireAuth } from '../../../lib/services/auth';
import { deletePdfChunks } from '../../../lib/services/database';
import { getPDFMetadata, removePDFMetadata } from '../../../lib/services/metadata';
import fs from 'fs-extra';

export default async function handler(req, res) {
  const { pdfId } = req.query;
  if (req.method !== 'DELETE') {
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
      
      // Delete from vector database
      await deletePdfChunks(pdfId);
      
      // Remove from metadata store
      removePDFMetadata(pdfId);
      
      res.json({ message: 'PDF deleted successfully' });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
