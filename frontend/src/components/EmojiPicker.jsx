
const emojis = [
  "😀", "😂", "😍", "😎", "🤔", "😢", "😡", "❤️",
  "👍", "👏", "🙏", "🔥", "🎉", "💯", "🥳", "🤯"
];

const EmojiPicker = ({ onSelect }) => {
  return (
    <div className="absolute bottom-full left-0 mb-1 bg-slate-800 border border-slate-700 rounded-lg p-2 
  grid grid-cols-[repeat(auto-fit,minmax(32px,1fr))] gap-1 shadow-lg z-50 min-w-[200px]">
      {emojis.map((emoji, i) => (
        <button
          key={i}
          onClick={() => onSelect(emoji)}
          className="text-lg hover:bg-slate-700/50 rounded p-1"
        >
          {emoji}
        </button>
      ))}
    </div>


  );
};

export default EmojiPicker;
