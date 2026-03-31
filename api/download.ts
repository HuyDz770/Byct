import type { VercelRequest, VercelResponse } from '@vercel/node';
import { DOWNLOAD_LINKS, decrypt } from './shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  const { token } = req.query;
  if (!token || typeof token !== 'string') {
    return res.status(400).send("Missing token");
  }

  try {
    const decrypted = decrypt(token);
    const payload = JSON.parse(decrypted);
    
    if (Date.now() > payload.expiresAt) {
      return res.status(403).send("Download link expired. Please generate a new one.");
    }

    let url = DOWNLOAD_LINKS[payload.id];
    if (!url) {
      return res.status(404).send("File not found");
    }

    // --- GOOGLE DRIVE VIRUS SCAN WARNING BYPASS ---
    if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) {
      try {
        const idMatch = url.match(/id=([^&]+)/);
        if (idMatch) {
          const fileId = idMatch[1];
          // Fetch the warning page
          const response = await fetch(`https://drive.google.com/uc?export=download&id=${fileId}`);
          const text = await response.text();
          
          // Extract filename and size
          const nameMatch = text.match(/<a[^>]*>([^<]+)<\/a>\s*\(([^)]+)\)/);
          let fileName = "Unknown File";
          let fileSize = "Unknown Size";
          
          if (nameMatch) {
            fileName = nameMatch[1];
            fileSize = nameMatch[2];
          }

          // If we found the warning page with file info, render a beautiful warning page
          if (text.includes('uc-warning-caption') || nameMatch) {
            const downloadConfirmUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
            
            return res.status(200).send(`
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Secure Download - ${fileName}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
                <style>
                  :root {
                    --bg: #030712;
                    --card-bg: #0f172a;
                    --text-main: #f8fafc;
                    --text-muted: #94a3b8;
                    --accent: #06b6d4;
                    --accent-hover: #0891b2;
                    --danger: #ef4444;
                    --danger-bg: rgba(239, 68, 68, 0.1);
                  }
                  body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                    background-color: var(--bg);
                    color: var(--text-main);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-image: 
                      radial-gradient(circle at 15% 50%, rgba(6, 182, 212, 0.08), transparent 25%),
                      radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%);
                  }
                  .container {
                    background: var(--card-bg);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 48px;
                    max-width: 500px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                    overflow: hidden;
                  }
                  .container::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; height: 4px;
                    background: linear-gradient(90deg, #06b6d4, #8b5cf6);
                  }
                  .icon-wrapper {
                    width: 80px;
                    height: 80px;
                    background: var(--danger-bg);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 24px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                  }
                  .icon-wrapper svg {
                    width: 40px;
                    height: 40px;
                    color: var(--danger);
                  }
                  h1 {
                    font-size: 24px;
                    font-weight: 600;
                    margin: 0 0 16px;
                    letter-spacing: -0.02em;
                  }
                  p {
                    color: var(--text-muted);
                    font-size: 15px;
                    line-height: 1.6;
                    margin: 0 0 24px;
                  }
                  .file-info {
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    text-align: left;
                  }
                  .file-details {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                  }
                  .file-name {
                    font-weight: 600;
                    color: var(--text-main);
                    font-size: 16px;
                    word-break: break-all;
                  }
                  .file-size {
                    color: var(--accent);
                    font-size: 14px;
                    font-weight: 500;
                  }
                  .btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
                    color: white;
                    text-decoration: none;
                    padding: 16px 32px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                    box-sizing: border-box;
                    box-shadow: 0 10px 20px -10px rgba(6, 182, 212, 0.5);
                  }
                  .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 25px -10px rgba(6, 182, 212, 0.6);
                  }
                  .btn svg {
                    width: 20px;
                    height: 20px;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h1>Security Warning</h1>
                  <p>This file is too large for Google to scan for viruses. It is an executable file and may harm your computer. Download at your own risk.</p>
                  
                  <div class="file-info">
                    <div class="file-details">
                      <span class="file-name">${fileName}</span>
                      <span class="file-size">${fileSize}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="12" y1="18" x2="12" y2="12"></line>
                      <line x1="9" y1="15" x2="15" y2="15"></line>
                    </svg>
                  </div>

                  <a href="${downloadConfirmUrl}" class="btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Anyway
                  </a>
                </div>
              </body>
              </html>
            `);
          }
        }
      } catch (e) {
        console.error('GDrive bypass failed', e);
      }
    }
    // ----------------------------------------------

    // Redirect to the actual direct link
    return res.redirect(302, url);
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
}
