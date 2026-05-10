const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[86%] rounded-xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[78%] ${
          isUser
            ? "bg-slate-950 text-white"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
