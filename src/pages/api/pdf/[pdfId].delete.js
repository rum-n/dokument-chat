import { requireAuth } from "../../../lib/services/auth";
import { deletePdfChunks, initQdrant } from "../../../lib/services/database";
import { PDFDatabaseService } from "../../../lib/services/pdfDatabase";

export default async function handler(req, res) {
  const { pdfId } = req.query;
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    await requireAuth(req, res, async () => {
      // Initialize Qdrant client
      await initQdrant();

      // Get PDF from database
      const pdf = await PDFDatabaseService.getPDFById(pdfId);
      if (!pdf) {
        return res.status(404).json({ error: "PDF not found" });
      }
      if (pdf.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      // Delete from vector database
      await deletePdfChunks(pdfId);

      // Delete from database
      await PDFDatabaseService.deletePDF(pdfId);

      res.json({ message: "PDF deleted successfully" });
    });
  } catch (error) {
    console.error("Delete PDF error:", error);
    res.status(500).json({ error: "Failed to delete PDF" });
  }
}
