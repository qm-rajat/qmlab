import express from "express";
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import apiRoutes from "./server/routes/index.js";
import rootRoutes from "./server/routes/root.routes.js";
import { securityHeaders, corsHeaders } from "./server/lib/security.js";

// Initialize environment configuration
dotenv.config();

const app = express();
const PORT = 3000;

// Set payload limit to 25mb to support larger PNG/JPEG image uploads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

// Security middleware: defensive HTTP headers & CORS
app.use(securityHeaders);
app.use(corsHeaders);

// Mount API & Root routers
app.use("/", rootRoutes);
app.use("/api", apiRoutes);

// --- VITE DEV AND PROD MIDDLEWARE SETUP ---

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(process.cwd(), "public", "uploads")));

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Dynamic import to avoid bundling Vite in production serverless builds
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
