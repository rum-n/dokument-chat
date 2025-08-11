const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs-extra");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const pdfRoutes = require("./routes/pdf");
const chatRoutes = require("./routes/chat");
const { initQdrant } = require("./services/database");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || [
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Create uploads directory
const uploadsDir = process.env.UPLOAD_DIR || "./uploads";
fs.ensureDirSync(uploadsDir);

// Serve static files
app.use("/uploads", express.static(uploadsDir));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/auth", authRoutes);
app.use("/pdf", pdfRoutes);
app.use("/chat", chatRoutes);

// Health check endpoints
app.get("/", (req, res) => {
  res.json({
    message: "Dokument Chat API",
    version: "1.0.0",
    status: "running",
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Initialize Qdrant and start server
async function startServer() {
  try {
    await initQdrant();
    console.log("✅ Qdrant initialized successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📁 Upload directory: ${uploadsDir}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
