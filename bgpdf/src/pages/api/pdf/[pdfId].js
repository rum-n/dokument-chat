import { requireAuth } from '../../../lib/services/auth';
import { getPDFMetadata } from '../../../lib/services/metadata';

export default async function handler(req, res) {
  const { pdfId } = req.query;
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await requireAuth(req, res, () => {
      const pdfInfo = getPDFMetadata(pdfId);
      if (!pdfInfo) {
        return res.status(404).json({ error: 'PDF not found' });
      }
      if (pdfInfo.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      res.json({
        pdf_id: pdfId,
        filename: pdfInfo.filename,
        total_pages: pdfInfo.total_pages,
        total_chunks: pdfInfo.total_chunks,
        status: pdfInfo.status,
        upload_date: pdfInfo.upload_date,
        file_size: pdfInfo.file_size,
      });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
