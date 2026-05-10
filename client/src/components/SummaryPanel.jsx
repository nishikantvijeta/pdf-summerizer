import { FileText } from "lucide-react";

const SummaryPanel = ({ document }) => {
  if (!document) {
    return (
      <section className="panel flex min-h-64 items-center justify-center rounded-xl p-6 text-center">
        <div>
          <FileText className="mx-auto h-9 w-9 text-slate-400" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-slate-950">
            No PDF uploaded
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Upload a text-based PDF to generate a concise summary and open the chat.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel rounded-xl p-4 sm:p-6">
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">Summary</h2>
          <p className="mt-1 text-sm text-slate-500">{document.filename}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            {document.pageCount || 0} pages
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            {document.characterCount.toLocaleString()} chars
          </span>
        </div>
      </div>

      <div className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">
        {document.summary}
      </div>
    </section>
  );
};

export default SummaryPanel;
