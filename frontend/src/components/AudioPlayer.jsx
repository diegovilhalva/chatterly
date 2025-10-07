import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

const AudioPlayer = ({ src, isOwn }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);

    const setAudioData = () => {
      const d = audio.duration;
      if (!isFinite(d) || isNaN(d) || d === 0) return; 
      setDuration(d);
      setProgress(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(audio.duration || 0);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const fixDuration = () => {
      if (!isFinite(audio.duration) || audio.duration === 0) {
        audio.load();
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioData);
    audio.addEventListener("durationchange", fixDuration);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioData);
      audio.removeEventListener("durationchange", fixDuration);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error("Erro ao reproduzir áudio:", error);
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
    setProgress(newTime);
  };

  const formatTime = (time) => {
    if (!isFinite(time) || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!src) return null;

  return (
    <div
      className={`w-full mt-2 p-3 rounded-xl flex items-center gap-3 ${
        isOwn ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"
      }`}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        onClick={togglePlay}
        className={`flex-shrink-0 ${
          isOwn ? "text-white" : "text-cyan-400"
        } hover:opacity-80 transition-opacity`}
        disabled={!src}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5" />
        )}
      </button>

      <div className="flex-1 flex flex-col min-w-0">
        <div
          className={`h-2 rounded cursor-pointer ${
            isOwn ? "bg-white/30" : "bg-slate-600"
          }`}
          onClick={handleProgressClick}
        >
          <div
            className={`h-2 rounded transition-all duration-150 ${
              isOwn ? "bg-white" : "bg-cyan-400"
            }`}
            style={{
              width: duration ? `${(progress / duration) * 100}%` : "0%",
            }}
          />
        </div>
        <span className="text-xs mt-1">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default AudioPlayer;
