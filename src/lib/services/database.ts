import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from "uuid";
import config from "../config";

interface PDFChunk {
  chunk_id: string;
  page_number: number;
  text: string;
}

interface SearchResult {
  score: number;
  pdf_id: string;
  page_number: number;
  text: string;
  chunk_id: string;
}

interface ChunkData {
  page_number: number;
  text: string;
  chunk_id: string;
}

let qdrantClient: QdrantClient | null = null;

export async function initQdrant(): Promise<void> {
  try {
    const clientConfig: any = { url: config.qdrant.url };
    
    // Add API key if provided (for Qdrant Cloud)
    if (config.qdrant.apiKey) {
      clientConfig.apiKey = config.qdrant.apiKey;
    }
    
    qdrantClient = new QdrantClient(clientConfig);

    // Check if collection exists
    const collections = await qdrantClient.getCollections();
    const collectionNames = collections.collections.map((col) => col.name);

    if (!collectionNames.includes(config.qdrant.collectionName)) {
      // Create collection with Mistral embed dimensions (1024)
      await qdrantClient.createCollection(config.qdrant.collectionName, {
        vectors: {
          size: 1024,
          distance: "Cosine",
        },
      });
      console.log(`Created Qdrant collection: ${config.qdrant.collectionName}`);
    } else {
      console.log(
        `Using existing Qdrant collection: ${config.qdrant.collectionName}`
      );
    }
  } catch (error) {
    console.error("Error initializing Qdrant:", error);
    throw error;
  }
}

export function getQdrantClient(): QdrantClient {
  if (!qdrantClient) {
    throw new Error("Qdrant client not initialized");
  }
  return qdrantClient;
}

export async function storeChunks(
  pdfId: string,
  chunks: PDFChunk[],
  embeddings: number[][]
): Promise<void> {
  const client = getQdrantClient();

  const points = chunks.map((chunk, index) => ({
    id: uuidv4(),
    vector: embeddings[index],
    payload: {
      pdf_id: pdfId,
      chunk_id: chunk.chunk_id,
      page_number: chunk.page_number,
      text: chunk.text,
      chunk_index: index,
    },
  }));

  // Insert points in batches
  const batchSize = 100;
  for (let i = 0; i < points.length; i += batchSize) {
    const batch = points.slice(i, i + batchSize);
    await client.upsert(config.qdrant.collectionName, {
      points: batch,
    });
  }
}

export async function searchChunks(
  queryEmbedding: number[],
  limit: number = 5
): Promise<SearchResult[]> {
  const client = getQdrantClient();

  const searchResult = await client.search(config.qdrant.collectionName, {
    vector: queryEmbedding,
    limit: limit,
    with_payload: true,
  });

  return searchResult.map((result) => ({
    score: result.score,
    pdf_id: result.payload?.pdf_id as string,
    page_number: result.payload?.page_number as number,
    text: result.payload?.text as string,
    chunk_id: result.payload?.chunk_id as string,
  }));
}

export async function deletePdfChunks(pdfId: string): Promise<void> {
  const client = getQdrantClient();

  await client.delete(config.qdrant.collectionName, {
    filter: {
      must: [
        {
          key: "pdf_id",
          match: { value: pdfId },
        },
      ],
    },
  });
}

export async function getPdfChunks(pdfId: string): Promise<ChunkData[]> {
  const client = getQdrantClient();

  const scrollResult = await client.scroll(config.qdrant.collectionName, {
    filter: {
      must: [
        {
          key: "pdf_id",
          match: { value: pdfId },
        },
      ],
    },
    with_payload: true,
    limit: 1000,
  });

  return scrollResult.points.map((point) => ({
    page_number: point.payload?.page_number as number,
    text: point.payload?.text as string,
    chunk_id: point.payload?.chunk_id as string,
  }));
}
