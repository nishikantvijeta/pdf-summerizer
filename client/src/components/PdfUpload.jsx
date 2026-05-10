import { AlertCircle, FileText, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";

const formatBytes = (bytes) => {
  if (!bytes) return "0 KB";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const PdfUpload = ({ error, isUploading, onUpload }) => {
  const inputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setSelectedFile(file);
    onUpload(file);
  };

  return (
    <section className="panel rounded-xl p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            PDF Assistant
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-950 sm:text-3xl">
            Summarize and chat with your document
          </h1>
        </div>

        <button
          className="primary-button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="h-4 w-4" aria-hidden="true" />
          )}
          {isUploading ? "Reading PDF" : "Upload PDF"}
        </button>
      </div>

      <button
        className="mt-5 flex min-h-40 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-slate-400 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <div className="max-w-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            ) : (
              <FileText className="h-6 w-6" aria-hidden="true" />
            )}
          </div>
          <p className="mt-3 text-base font-medium text-slate-900">
            {selectedFile ? selectedFile.name : "Choose a PDF to begin"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {selectedFile
              ? `${formatBytes(selectedFile.size)} selected`
              : "The summary appears automatically after upload."}
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
        type="file"
      />

      {error ? (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : null}
    </section>
  );
};

export default PdfUpload;
