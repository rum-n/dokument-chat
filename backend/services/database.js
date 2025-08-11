const { QdrantClient } = require("@qdrant/js-client-rest");
const { v4: uuidv4 } = require("uuid");
const config = require("../config");

let qdrantClient = null;

async function initQdrant() {
  try {
    qdrantClient = new QdrantClient({ url: config.qdrant.url });

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

function getQdrantClient() {
  if (!qdrantClient) {
    throw new Error("Qdrant client not initialized");
  }
  return qdrantClient;
}

async function storeChunks(pdfId, chunks, embeddings) {
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

async function searchChunks(queryEmbedding, limit = 5) {
  const client = getQdrantClient();

  const searchResult = await client.search(config.qdrant.collectionName, {
    vector: queryEmbedding,
    limit: limit,
    with_payload: true,
  });

  return searchResult.map((result) => ({
    score: result.score,
    pdf_id: result.payload.pdf_id,
    page_number: result.payload.page_number,
    text: result.payload.text,
    chunk_id: result.payload.chunk_id,
  }));
}

async function deletePdfChunks(pdfId) {
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

async function getPdfChunks(pdfId) {
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
    page_number: point.payload.page_number,
    text: point.payload.text,
    chunk_id: point.payload.chunk_id,
  }));
}

module.exports = {
  initQdrant,
  getQdrantClient,
  storeChunks,
  searchChunks,
  deletePdfChunks,
  getPdfChunks,
};
