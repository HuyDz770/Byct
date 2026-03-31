import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import generateTokenHandler from "./api/generate-token";
import downloadHandler from "./api/download";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Adapt Vercel handlers for Express
  app.post("/api/generate-token", (req, res) => {
    generateTokenHandler(req as any, res as any);
  });

  app.get("/api/download", (req, res) => {
    downloadHandler(req as any, res as any);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
