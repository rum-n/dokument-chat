// In-memory storage for PDF metadata (should use a proper database in production)
export interface PDFMetadata {
  pdf_id: string;
  filename: string;
  total_pages: number;
  total_chunks: number;
  upload_date: string;
  file_size: number;
  user_id: string;
  status: 'processing' | 'processed' | 'error';
}

// In-memory store
const pdfMetadata: Record<string, PDFMetadata> = {};

export function addPDFMetadata(metadata: PDFMetadata): void {
  pdfMetadata[metadata.pdf_id] = metadata;
}

export function getPDFMetadata(pdfId: string): PDFMetadata | undefined {
  return pdfMetadata[pdfId];
}

export function getUserPDFs(userId: string): PDFMetadata[] {
  return Object.values(pdfMetadata).filter(pdf => pdf.user_id === userId);
}

export function removePDFMetadata(pdfId: string): void {
  delete pdfMetadata[pdfId];
}

export function updatePDFStatus(pdfId: string, status: PDFMetadata['status']): void {
  if (pdfMetadata[pdfId]) {
    pdfMetadata[pdfId].status = status;
  }
}

export { pdfMetadata };
