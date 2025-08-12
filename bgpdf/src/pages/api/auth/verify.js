import { requireAuth } from '../../../lib/services/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    await requireAuth(req, res, () => {
      res.json({ valid: true, user: req.user });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
