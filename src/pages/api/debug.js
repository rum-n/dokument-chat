export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMistralKey: !!process.env.MISTRAL_API_KEY,
      hasQdrantUrl: !!process.env.QDRANT_URL,
      timestamp: new Date().toISOString(),
      platform: process.platform,
      version: process.version,
    };

    res.json({
      status: "ok",
      debug: debugInfo,
      message: "Debug information retrieved successfully",
    });
  } catch (error) {
    console.error("Debug error:", error);
    res.status(500).json({
      error: "Debug endpoint error",
      message: error.message,
    });
  }
}
