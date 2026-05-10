import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 120000
});

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

export const uploadPdf = async (file) => {
  const formData = new FormData();
  formData.append("pdf", file);

  try {
    const response = await api.post("/pdf/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const askPdfQuestion = async ({ documentId, question }) => {
  try {
    const response = await api.post("/pdf/chat", {
      documentId,
      question
    });

    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
