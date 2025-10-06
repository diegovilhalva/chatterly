import { Check, CheckCheck, Smile, Edit, Trash2, CircleXIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ImageModal from "./ImageModal";
import EmojiPicker from "./EmojiPicker";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import AudioPlayer from "./AudioPlayer";

const MessageItem = ({ msg, isOwn }) => {
  const { addReactionToMessage, editMessage, deleteMessage } = useChatStore();
  const socket = useAuthStore.getState().socket
  const [isModalOpen, setModalOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(msg.text || "");
  const pickerRef = useRef(null);

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

  const handleEditMessage = () => {
    if (editText.trim() === "") return;
    // Atualiza via socket
    socket.emit("editMessage", { messageId: msg._id, text: editText });
    editMessage(msg._id, { text: editText, edited: true });
    setIsEditing(false);
  };

  const handleDeleteMessage = () => {
    socket.emit("deleteMessage", { messageId: msg._id });
    deleteMessage(msg._id);
  };

  return (
    <>
      <div className={`chat ${isOwn ? "chat-end" : "chat-start"}`}>
        <div
          className={`chat-bubble relative ${isOwn ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}
        >
          {msg.image && (
            <img
              src={msg.image}
              alt="Shared"
              className="rounded-lg w-full max-w-xs sm:max-w-sm md:max-w-md object-cover mb-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setModalOpen(true)}
            />
          )}

          {isEditing ? (
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 rounded px-2 py-1 text-black"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button onClick={handleEditMessage}>
                <Check className="w-5 h-5 text-green-500" />
              </button>
              <button onClick={() => setIsEditing(false)} className="text-red-500">
                <CircleXIcon />
              </button>
            </div>
          ) : (
            <p className="mt-2">
              {msg.deleted ? "Mensagem deletada" : msg.text} {msg.edited && <span className="text-xs opacity-50">(editado)</span>}

            </p>
          )}
          {msg.audio && !msg.deleted && (
            <AudioPlayer src={msg.audio} />
          )}




          {/* horário + status + emojis */}
          <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
            {new Date(msg.createdAt).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {isOwn && !msg.deleted && getStatusIcon()}

            {/* emoji picker */}
            {!msg.deleted && (<button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="ml-1 text-slate-400 hover:text-cyan-400"
            >
              <Smile className="w-4 h-4" />
            </button>)}

            {/* editar/deletar */}
            {isOwn && !isEditing && !msg.deleted && (
              <>
                <button onClick={() => setIsEditing(true)} className="ml-1 text-slate-400 hover:text-yellow-400">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={handleDeleteMessage} className="ml-1 text-slate-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </p>

          {/* reações */}
          {msg.reactions?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(
                msg.reactions.reduce((acc, r) => {
                  acc[r.emoji] = (acc[r.emoji] || 0) + 1;
                  return acc;
                }, {})
              ).map(([emoji, count]) => (
                <span key={emoji} className="text-sm px-2 py-1 bg-slate-700/50 rounded-full">
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

      {isModalOpen && <ImageModal src={msg.image} alt="Shared" onClose={() => setModalOpen(false)} />}
    </>
  );
};

export default MessageItem;
