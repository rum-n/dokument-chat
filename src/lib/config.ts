import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

interface MistralConfig {
  apiKey: string | undefined;
  embeddingModel: string;
  chatModel: string;
}

interface QdrantConfig {
  url: string;
  collectionName: string;
}

interface JWTConfig {
  secret: string | undefined;
  algorithm: string;
  expirationHours: number;
}

interface UploadConfig {
  maxFileSizeMB: number;
  uploadDir: string;
  chunkSize: number;
  chunkOverlap: number;
}

interface ServerConfig {
  host: string;
  port: number;
  debug: boolean;
}

interface CorsConfig {
  allowedOrigins: string[];
}

interface OCRConfig {
  language: string;
}

export interface Config {
  mistral: MistralConfig;
  qdrant: QdrantConfig;
  jwt: JWTConfig;
  upload: UploadConfig;
  server: ServerConfig;
  cors: CorsConfig;
  ocr: OCRConfig;
}

const config: Config = {
  // Mistral AI Configuration
  mistral: {
    apiKey: process.env.MISTRAL_API_KEY,
    embeddingModel: "mistral-embed",
    chatModel: "mistral-large-latest",
  },

  // Qdrant Vector Database
  qdrant: {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    collectionName: process.env.QDRANT_COLLECTION_NAME || "pdf_chunks_mistral",
  },

  // JWT Authentication
  jwt: {
    secret: process.env.JWT_SECRET,
    algorithm: process.env.JWT_ALGORITHM || "HS256",
    expirationHours: parseInt(process.env.JWT_EXPIRATION_HOURS || "24"),
  },

  // File Upload Settings
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || "20"),
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
    chunkSize: parseInt(process.env.CHUNK_SIZE || "500"),
    chunkOverlap: parseInt(process.env.CHUNK_OVERLAP || "50"),
  },

  // Server Configuration
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT || "8000"),
    debug: process.env.DEBUG === "true",
  },

  // CORS Settings
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
  },

  // OCR Configuration
  ocr: {
    language: process.env.TESSERACT_LANG || "bul+eng",
  },
};

// Validate required configuration
const requiredEnvVars = ["MISTRAL_API_KEY", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

export default config;
