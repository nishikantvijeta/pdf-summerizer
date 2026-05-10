import { Router } from "express";
import {
  askQuestion,
  removeDocument,
  uploadPdf
} from "../controllers/pdfController.js";
import { uploadPdf as uploadMiddleware } from "../middleware/upload.js";

const router = Router();

router.post("/upload", uploadMiddleware.single("pdf"), uploadPdf);
router.post("/chat", askQuestion);
router.delete("/:documentId", removeDocument);

export default router;
