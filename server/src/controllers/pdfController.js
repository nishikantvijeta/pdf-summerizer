import { deleteDocument, getDocument, saveDocument } from "../services/documentStore.js";
import { answerPdfQuestion, generatePdfSummary } from "../services/geminiService.js";
import { extractPdfText, removeUploadedFile } from "../services/pdfService.js";
import { ApiError } from "../middleware/errorHandler.js";

export const uploadPdf = async (req, res, next) => {
  const file = req.file;

  if (!file) {
    next(new ApiError(400, "Please upload a PDF file."));
    return;
  }

  try {
    const { text, pageCount } = await extractPdfText(file.path);
    const summary = await generatePdfSummary(text);
    const document = saveDocument({
      filename: file.originalname,
      text,
      pageCount,
      summary
    });

    res.status(201).json({
      success: true,
      data: {
        documentId: document.id,
        filename: document.filename,
        pageCount: document.pageCount,
        characterCount: text.length,
        summary: document.summary,
        expiresAt: new Date(document.expiresAt).toISOString()
      }
    });
  } catch (error) {
    next(error);
  } finally {
    await removeUploadedFile(file.path);
  }
};

export const askQuestion = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question?.trim()) {
      throw new ApiError(400, "Document ID and question are required.");
    }

    const document = getDocument(documentId);

    if (!document) {
      throw new ApiError(
        404,
        "Uploaded PDF was not found or has expired. Please upload it again."
      );
    }

    const answer = await answerPdfQuestion({
      documentText: document.text,
      question: question.trim()
    });

    res.json({
      success: true,
      data: {
        answer
      }
    });
  } catch (error) {
    next(error);
  }
};

export const removeDocument = (req, res, next) => {
  try {
    const removed = deleteDocument(req.params.documentId);

    if (!removed) {
      throw new ApiError(404, "Document not found.");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
