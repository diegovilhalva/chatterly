import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

const AudioPlayer = ({ src, isOwn }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className={`w-full mt-2 p-3 rounded-xl flex items-center gap-3 ${
        isOwn ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"
      }`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        className={`flex-shrink-0 ${isOwn ? "text-white" : "text-cyan-400"} hover:opacity-80`}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      <div className="flex-1 flex flex-col">
        <div
          className={`h-2 rounded cursor-pointer ${
            isOwn ? "bg-white/30" : "bg-slate-600"
          }`}
          onClick={handleProgressClick}
        >
          <div
            className={`h-2 rounded ${
              isOwn ? "bg-white" : "bg-cyan-400"
            }`}
            style={{ width: `${(progress / duration) * 100}%` }}
          ></div>
        </div>
        <span className="text-xs mt-1">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
