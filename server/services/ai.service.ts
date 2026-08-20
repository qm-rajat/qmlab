import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let geminiClient: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI | null => {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      geminiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return geminiClient;
};

export const isAiConfigured = (): boolean => {
  return !!process.env.GEMINI_API_KEY;
};
