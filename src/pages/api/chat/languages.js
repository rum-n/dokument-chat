export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  res.json({
    supported_languages: [
      { code: 'bg', name: 'Bulgarian', native_name: 'Български' },
      { code: 'en', name: 'English', native_name: 'English' },
    ],
  });
}
