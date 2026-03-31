import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DOWNLOAD_LINKS, encrypt } from './shared';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;
  if (!id || !DOWNLOAD_LINKS[id]) {
    return res.status(400).json({ error: "Invalid download ID" });
  }
  
  // Token expires in 30 seconds
  const expiresAt = Date.now() + 30000;
  const payload = JSON.stringify({ id, expiresAt });
  const token = encrypt(payload);
  
  return res.status(200).json({ token });
}
