import { Check, CheckCheck } from "lucide-react";

const MessageItem = ({ msg, isOwn }) => {
  const getStatusIcon = () => {
    switch (msg.status) {
      case "sent":
        return <Check className="w-4 h-4 text-slate-400" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-slate-400" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-cyan-400" />;
      default:
        return null;
    }
  };

  return (
    <div className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
      <div
        className={`chat-bubble relative ${
          isOwn ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"
        }`}
      >
        {msg.image && (
          <img
            src={msg.image}
            alt="Shared"
            className="rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md object-cover mb-2"
          />
        )}
        {msg.text && <p className="mt-2">{msg.text}</p>}
        <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
          {new Date(msg.createdAt).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
          { getStatusIcon()}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
