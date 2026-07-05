import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON request body
  app.use(express.json());

  // API routes go here FIRST
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "Junni" && password === "Applejunni@96") {
      res.json({ success: true, token: "secure-anime-news-token-987654321" });
    } else {
      res.status(401).json({ success: false, error: "Invalid username or password." });
    }
  });

  app.post("/api/admin/verify", (req, res) => {
    const { token } = req.body;
    if (token === "secure-anime-news-token-987654321") {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Invalid token or session expired." });
    }
  });

  // Vite middleware for development or serving built SPA in production
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
