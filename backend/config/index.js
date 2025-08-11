const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const config = {
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
    expirationHours: parseInt(process.env.JWT_EXPIRATION_HOURS) || 24,
  },

  // File Upload Settings
  upload: {
    maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB) || 20,
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
    chunkSize: parseInt(process.env.CHUNK_SIZE) || 500,
    chunkOverlap: parseInt(process.env.CHUNK_OVERLAP) || 50,
  },

  // Server Configuration
  server: {
    host: process.env.HOST || "0.0.0.0",
    port: parseInt(process.env.PORT) || 8000,
    debug: process.env.DEBUG === "true",
  },

  // CORS Settings
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
  },

  // OCR Configuration
  ocr: {
    language: process.env.TESSERACT_LANG || "bul+eng",
  },
};

// Debug: Log environment variables (remove in production)
// console.log("🔍 Environment variables loaded:");
// console.log(
//   "MISTRAL_API_KEY:",
//   process.env.MISTRAL_API_KEY ? "✅ Set" : "❌ Not set"
// );
// console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✅ Set" : "❌ Not set");

// Validate required configuration
const requiredEnvVars = ["MISTRAL_API_KEY", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
}

module.exports = config;
