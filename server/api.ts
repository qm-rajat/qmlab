import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import apiRoutes from "../server/routes/index.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", apiRoutes);

export default app;
