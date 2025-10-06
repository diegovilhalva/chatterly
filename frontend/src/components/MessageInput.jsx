import { useRef, useState, useEffect } from "react";
import useKeyboardSound from "../hooks/useKeyboardSound";
import { useChatStore } from "../store/useChatStore";
import { toast } from "sonner";
import { ImageIcon, SendIcon, XIcon, Smile } from "lucide-react";
import EmojiPicker from "./EmojiPicker";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const { playRandomKeyStrokeSound } = useKeyboardSound();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { selectedUser } = useChatStore()
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const socket = useAuthStore.getState().socket
  let typingTimeout;
  const { sendMessage, isSoundEnabled } = useChatStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    if (isSoundEnabled) playRandomKeyStrokeSound();

    sendMessage({
      text: text.trim(),
      image: imagePreview,
    });
    setText("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecione um formato de imagem válida");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiSelect = (emoji) => {
    if (!inputRef.current) return;
    const cursorPos = inputRef.current.selectionStart;
    const newText =
      text.slice(0, cursorPos) + emoji + text.slice(cursorPos);
    setText(newText);

    // move cursor depois do emoji
    setTimeout(() => {
      inputRef.current.selectionStart = cursorPos + emoji.length;
      inputRef.current.selectionEnd = cursorPos + emoji.length;
      inputRef.current.focus();
    }, 0);
  };

  const handleTyping = () => {
    
     socket.emit("typing", { toUserId: selectedUser._id });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        socket.emit("stopTyping", { toUserId: selectedUser._id });
    }, 2000);
  }

  return (
    <div className="p-4 border-t border-slate-700/50 relative">
      {imagePreview && (
        <div className="max-w-3xl mx-auto mb-3 flex items-center">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
              type="button"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center max-md:space-x-2 space-x-4"
      >
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            isSoundEnabled && playRandomKeyStrokeSound();
            handleTyping()
          }}
          className="flex-1 max-sm:w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Digite sua mensagem"
        />

        {/* Botão Emoji */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-slate-400 hover:text-cyan-400"
        >
          <Smile className="w-5 h-5" />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""
            }`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>

      {/* EmojiPicker flutuante */}
      {showEmojiPicker && (
        <div ref={pickerRef} className="absolute bottom-16 left-4 z-50">
          <EmojiPicker onSelect={handleEmojiSelect} />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
