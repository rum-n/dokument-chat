import { authenticateRequest } from "../../../lib/services/auth";
import { getUserPDFs } from "../../../lib/services/metadata";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await authenticateRequest(req);
    const userPdfs = getUserPDFs(user.id);

    const pdfList = userPdfs.map((pdf) => ({
      pdf_id: pdf.pdf_id,
      filename: pdf.filename,
      total_pages: pdf.total_pages,
      total_chunks: pdf.total_chunks,
      status: pdf.status,
      upload_date: pdf.upload_date,
      file_size: pdf.file_size,
    }));

    res.json({ pdfs: pdfList });
  } catch (error) {
    console.error("PDF list error:", error);
    res.status(401).json({ error: "Authentication required" });
  }
}
