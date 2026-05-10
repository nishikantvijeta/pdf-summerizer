import fs from "fs/promises";
import pdfParse from "pdf-parse";
import { ApiError } from "../middleware/errorHandler.js";

const ignoredPdfWarnings = ["Warning: TT: undefined function"];

const parsePdfQuietly = async (buffer) => {
  const originalWarn = console.warn;

  console.warn = (...args) => {
    const message = args.join(" ");

    if (ignoredPdfWarnings.some((warning) => message.includes(warning))) {
      return;
    }

    originalWarn(...args);
  };

  try {
    return await pdfParse(buffer);
  } finally {
    console.warn = originalWarn;
  }
};

export const extractPdfText = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const data = await parsePdfQuietly(buffer);
  const text = data.text.replace(/\s+/g, " ").trim();

  if (!text) {
    throw new ApiError(
      422,
      "No selectable text was found in this PDF. Scanned PDFs need OCR before summarizing."
    );
  }

  return {
    text,
    pageCount: data.numpages || 0
  };
};

export const removeUploadedFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Could not remove uploaded file: ${filePath}`, error.message);
    }
  }
};
