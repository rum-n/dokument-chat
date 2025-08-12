import { authenticateRequest } from "../../../lib/services/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await authenticateRequest(req);
    res.json({ valid: true, user });
  } catch (error) {
    console.error("Auth verify error:", error);
    res.status(401).json({ error: "Authentication required" });
  }
}
