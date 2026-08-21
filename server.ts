import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import apiRoutes from "./server/routes/index";

// Initialize environment configuration
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing requests
app.use(express.json());
app.use(cookieParser());

// Mount the API router
app.use("/api", apiRoutes);

// --- VITE DEV AND PROD MIDDLEWARE SETUP ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Imported dynamically to avoid pulling Vite into the production serverless bundle
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
