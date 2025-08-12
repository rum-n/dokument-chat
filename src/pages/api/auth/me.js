import { requireAuth } from "../../../lib/services/auth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    await requireAuth(req, res, () => {
      res.json({ id: req.user.id, email: req.user.email });
    });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
