import { authenticateRequest } from "../../../lib/services/auth";
import { PDFDatabaseService } from "../../../lib/services/pdfDatabase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await authenticateRequest(req);
    const userPdfs = await PDFDatabaseService.getPDFsByUserId(user.id);

    const pdfList = userPdfs.map((pdf) => ({
      pdf_id: pdf.id,
      filename: pdf.originalName,
      total_pages: pdf.pageCount || 0,
      total_chunks: pdf._count?.chunks || 0,
      status: "processed",
      upload_date: pdf.createdAt.toISOString(),
      file_size: pdf.size,
    }));

    res.json({ pdfs: pdfList });
  } catch (error) {
    console.error("PDF list error:", error);
    res.status(401).json({ error: "Authentication required" });
  }
}
