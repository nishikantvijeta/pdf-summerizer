import crypto from "crypto";
import { env } from "../config/env.js";

const documents = new Map();
const ttlMs = env.documentTtlMinutes * 60 * 1000;

const cleanupExpiredDocuments = () => {
  const now = Date.now();

  for (const [id, document] of documents.entries()) {
    if (document.expiresAt <= now) {
      documents.delete(id);
    }
  }
};

export const saveDocument = ({ filename, text, pageCount, summary }) => {
  cleanupExpiredDocuments();

  const id = crypto.randomUUID();
  const now = Date.now();

  const document = {
    id,
    filename,
    text,
    pageCount,
    summary,
    createdAt: new Date(now).toISOString(),
    expiresAt: now + ttlMs
  };

  documents.set(id, document);
  return document;
};

export const getDocument = (id) => {
  cleanupExpiredDocuments();
  return documents.get(id);
};

export const deleteDocument = (id) => documents.delete(id);
