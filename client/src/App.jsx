import { useState } from "react";
import ChatPanel from "./components/ChatPanel.jsx";
import PdfUpload from "./components/PdfUpload.jsx";
import SummaryPanel from "./components/SummaryPanel.jsx";
import { askPdfQuestion, uploadPdf } from "./services/api.js";

const createMessage = (role, content) => ({
  id: crypto.randomUUID(),
  role,
  content
});

const App = () => {
  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [chatError, setChatError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadError("");
    setChatError("");
    setDocument(null);
    setMessages([]);

    try {
      const uploadedDocument = await uploadPdf(file);
      setDocument(uploadedDocument);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async (question) => {
    if (!document?.documentId) {
      return;
    }

    const userMessage = createMessage("user", question);
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setIsSending(true);
    setChatError("");

    try {
      const { answer } = await askPdfQuestion({
        documentId: document.documentId,
        question
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage("assistant", answer)
      ]);
    } catch (error) {
      setChatError(error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-4 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
        <div className="space-y-4">
          <PdfUpload
            error={uploadError}
            isUploading={isUploading}
            onUpload={handleUpload}
          />
          <SummaryPanel document={document} />
        </div>

        <ChatPanel
          documentId={document?.documentId}
          error={chatError}
          isSending={isSending}
          messages={messages}
          onAsk={handleAsk}
        />
      </div>
    </main>
  );
};

export default App;
