// MessageItem.jsx
import { Check, CheckCheck, Smile } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ImageModal from "./ImageModal";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "../store/useChatStore";

const MessageItem = ({ msg, isOwn }) => {
  const { addReactionToMessage } = useChatStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);

  // Fecha o picker se clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleAddReaction = (emoji) => {
    addReactionToMessage(msg._id, emoji);
    setShowEmojiPicker(false);
  };

  return (
    <>
      <div className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
        <div
          className={`chat-bubble relative ${isOwn ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"
            }`}
        >
          {msg.image && (
            <img
              src={msg.image}
              alt="Shared"
              className="rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md object-cover mb-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setModalOpen(true)}
            />
          )}
          {msg.text && <p className="mt-2">{msg.text}</p>}

          {/* horário + status */}
          <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
            {new Date(msg.createdAt).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isOwn && getStatusIcon()}

            {/* botão sempre disponível */}
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="ml-1 text-slate-400 hover:text-cyan-400"
            >
              <Smile className="w-4 h-4" />
            </button>
          </p>

          {/* reações abaixo da mensagem */}
          {msg.reactions?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(
                msg.reactions.reduce((acc, r) => {
                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                  return acc;
                }, {})
              ).map(([emoji, count]) => (
                <span
                  key={emoji}
                  className="text-sm px-2 py-1 bg-slate-700/50 rounded-full"
                >
                  {emoji} {count > 1 && `x${count}`}
                </span>
              ))}
            </div>
          )}


          {showEmojiPicker && (
            <div ref={pickerRef}>
              <EmojiPicker onSelect={handleAddReaction} />
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ImageModal
          src={msg.image}
          alt="Shared"
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
};

export default MessageItem;
