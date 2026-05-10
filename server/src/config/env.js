import dotenv from "dotenv";

dotenv.config();

const placeholderApiKeys = new Set(["your_google_ai_studio_api_key"]);
const geminiApiKey = process.env.GEMINI_API_KEY?.trim() || "";

export const env = {
  port: Number(process.env.PORT || 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  geminiApiKey,
  hasValidGeminiApiKey:
    geminiApiKey.length > 0 && !placeholderApiKeys.has(geminiApiKey),
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 10),
  documentTtlMinutes: Number(process.env.DOCUMENT_TTL_MINUTES || 60)
};
