import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { analyzeImage } from "./services/geminiService";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Utilize standard JSON/urlencoded parsers with generous limits to accommodate base64 image data
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Secure API endpoint that proxy calls to Gemini API
  app.post("/api/analyze", async (req, res) => {
    try {
      const { base64Image, references } = req.body;
      if (!base64Image) {
        return res.status(400).json({ error: "No base64 image provided" });
      }

      const result = await analyzeImage(base64Image, references || []);
      return res.json(result);
    } catch (error: any) {
      console.error("Analysis API Error:", error);
      return res.status(500).json({ error: error.message || "Failed to analyze custom design." });
    }
  });

  // Vite development server setup or static production asset pipeline
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
