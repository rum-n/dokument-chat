import { createAccessToken, authenticateUser } from '../../../lib/services/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = authenticateUser(username, password);
    if (!user) {
      return res.status(401).json({ error: 'Incorrect username or password' });
    }
    const accessToken = createAccessToken({ sub: user.username });
    res.json({ access_token: accessToken, token_type: 'bearer', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
