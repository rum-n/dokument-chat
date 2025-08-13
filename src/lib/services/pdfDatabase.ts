import { prisma } from "../prisma";

export interface CreatePDFData {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadPath: string;
  language?: string;
  pageCount?: number;
  userId: string;
}

export interface PDFChunkData {
  chunkId: string;
  pageNumber: number;
  text: string;
}

export class PDFDatabaseService {
  static async createPDF(data: CreatePDFData) {
    return await prisma.pDF.create({
      data: {
        filename: data.filename,
        originalName: data.originalName,
        mimeType: data.mimeType,
        size: data.size,
        uploadPath: data.uploadPath,
        language: data.language,
        pageCount: data.pageCount,
        userId: data.userId,
      },
      include: {
        user: true,
      }
    });
  }

  static async getPDFById(id: string) {
    return await prisma.pDF.findUnique({
      where: { id },
      include: {
        user: true,
        chunks: true,
      }
    });
  }

  static async getPDFsByUserId(userId: string) {
    return await prisma.pDF.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { chunks: true }
        }
      }
    });
  }

  static async deletePDF(id: string) {
    return await prisma.pDF.delete({
      where: { id }
    });
  }

  static async createPDFChunks(pdfId: string, chunks: PDFChunkData[]) {
    const chunkData = chunks.map(chunk => ({
      pdfId,
      chunkId: chunk.chunkId,
      pageNumber: chunk.pageNumber,
      text: chunk.text,
    }));

    return await prisma.pDFChunk.createMany({
      data: chunkData
    });
  }

  static async getPDFChunks(pdfId: string) {
    return await prisma.pDFChunk.findMany({
      where: { pdfId },
      orderBy: { pageNumber: 'asc' }
    });
  }

  static async deletePDFChunks(pdfId: string) {
    return await prisma.pDFChunk.deleteMany({
      where: { pdfId }
    });
  }

  static async searchPDFChunks(userId: string, searchText: string) {
    return await prisma.pDFChunk.findMany({
      where: {
        pdf: {
          userId: userId
        },
        text: {
          contains: searchText,
          mode: 'insensitive'
        }
      },
      include: {
        pdf: true
      },
      orderBy: {
        pageNumber: 'asc'
      }
    });
  }
}
