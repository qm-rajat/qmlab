import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import apiRoutes from "../server/routes/index.js";
import rootRoutes from "../server/routes/root.routes.js";
import { securityHeaders, corsHeaders } from "../server/lib/security.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.use(cookieParser());

app.use(securityHeaders);
app.use(corsHeaders);
app.use('/uploads', express.static(path.join(process.cwd(), "public", "uploads")));

app.use("/", rootRoutes);
app.use("/api", apiRoutes);

export default app;
