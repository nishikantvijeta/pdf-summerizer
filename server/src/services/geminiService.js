import { env } from "../config/env.js";
import { ApiError } from "../middleware/errorHandler.js";

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const MAX_CONTEXT_CHARS = 55000;

const truncateText = (text, maxChars = MAX_CONTEXT_CHARS) => {
  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars)}\n\n[Document truncated because it exceeded the context limit.]`;
};

const extractResponseText = (payload) => {
  const parts = payload?.candidates?.[0]?.content?.parts || [];
  return parts
    .map((part) => part.text || "")
    .join("")
    .trim();
};

const callGemini = async (prompt, maxOutputTokens = 1024) => {
  if (!env.hasValidGeminiApiKey) {
    throw new ApiError(
      503,
      "Gemini API key is missing or still set to the placeholder value. Update server/.env and restart the server."
    );
  }

  const response = await fetch(
    `${GEMINI_API_BASE_URL}/models/${env.geminiModel}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": env.geminiApiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          maxOutputTokens
        }
      })
    }
  );

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload?.error?.message || "Gemini API request failed. Please try again.";
    throw new ApiError(response.status, message);
  }

  const text = extractResponseText(payload);

  if (!text) {
    throw new ApiError(502, "Gemini returned an empty response.");
  }

  return text;
};

export const generatePdfSummary = async (documentText) => {
  const context = truncateText(documentText);

  return callGemini(`
You are a detailed PDF summarization assistant.

Create a comprehensive but readable summary of the PDF content below.
Do not write a one-line summary.

Format the answer with these sections:
1. Overview: 2 to 4 sentences explaining what the document is about.
2. Detailed Summary: 4 to 8 short paragraphs covering the main ideas in order.
3. Key Points: 8 to 12 bullet points.
4. Important Details: names, dates, numbers, definitions, findings, or conclusions if present.
5. Final Takeaway: 2 to 3 sentences.

Use only the PDF content. If the PDF is short, still provide a helpful expanded summary without inventing facts.

PDF content:
"""${context}"""
`, 2048);
};

export const answerPdfQuestion = async ({ documentText, question }) => {
  const context = truncateText(documentText);

  return callGemini(`
You are a PDF question-answering assistant.

Answer the user's question using only the PDF content provided below.
If the answer is not present in the PDF, say: "I could not find that information in the uploaded PDF."
Do not use outside knowledge.
Keep the answer clear and concise.

PDF content:
"""${context}"""

Question:
${question}
`);
};
