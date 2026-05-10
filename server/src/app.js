import cors from "cors";
import express from "express";
import pdfRoutes from "./routes/pdfRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { env } from "./config/env.js";

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "ai-pdf-summarizer-api" });
});

app.use("/api/pdf", pdfRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
