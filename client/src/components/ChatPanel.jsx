import { AlertCircle, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble.jsx";

const ChatPanel = ({ documentId, error, isSending, messages, onAsk }) => {
  const [question, setQuestion] = useState("");
  const scrollRef = useRef(null);
  const disabled = !documentId || isSending;

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = question.trim();

    if (!trimmed || disabled) {
      return;
    }

    onAsk(trimmed);
    setQuestion("");
  };

  return (
    <section className="panel flex min-h-[520px] flex-col rounded-xl">
      <div className="border-b border-slate-200 px-4 py-4 sm:px-6">
        <h2 className="text-xl font-semibold text-slate-950">Chat</h2>
        <p className="mt-1 text-sm text-slate-500">
          Answers are grounded in the uploaded PDF.
        </p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 px-4 py-5 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full min-h-72 items-center justify-center text-center">
            <p className="max-w-sm text-sm leading-6 text-slate-500">
              {documentId
                ? "Ask a question about the document."
                : "Upload a PDF to start chatting."}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}

        {isSending ? (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Thinking
            </div>
          </div>
        ) : null}
        <div ref={scrollRef} />
      </div>

      {error ? (
        <div className="border-t border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:px-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      <form
        className="flex gap-2 border-t border-slate-200 bg-white p-3 sm:p-4"
        onSubmit={handleSubmit}
      >
        <textarea
          className="max-h-36 min-h-11 flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm leading-5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
          disabled={disabled}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              handleSubmit(event);
            }
          }}
          placeholder={documentId ? "Ask from the PDF..." : "Upload a PDF first"}
          rows={1}
          value={question}
        />
        <button
          aria-label="Send question"
          className="icon-button h-11 w-11 bg-slate-950 text-white hover:bg-slate-800"
          disabled={disabled || !question.trim()}
          title="Send"
          type="submit"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </form>
    </section>
  );
};

export default ChatPanel;
