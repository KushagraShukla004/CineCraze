/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Play, Pause, X, Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const YouTubeEmbed = ({ videoId, title, onClose, autoplay = false }) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Extract video ID from YouTube URL if full URL is provided
  const getVideoId = (idOrUrl) => {
    if (!idOrUrl) return null;

    // If it's already just an ID, return it
    if (idOrUrl.length < 15 && !idOrUrl.includes("/")) return idOrUrl;

    // Extract from youtube.com/watch?v=VIDEO_ID
    const watchRegex = /youtube\.com\/watch\?v=([^&]+)/;
    const watchMatch = idOrUrl.match(watchRegex);
    if (watchMatch) return watchMatch[1];

    // Extract from youtu.be/VIDEO_ID
    const shortRegex = /youtu\.be\/([^?]+)/;
    const shortMatch = idOrUrl.match(shortRegex);
    if (shortMatch) return shortMatch[1];

    return null;
  };

  const finalVideoId = getVideoId(videoId);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === containerRef.current ||
          document.webkitFullscreenElement === containerRef.current
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!finalVideoId) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-xl bg-black ${
        isFullscreen ? "fixed inset-0 z-50" : "aspect-video w-full"
      }`}
    >
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )}

      {/* YouTube iframe */}
      <iframe
        ref={playerRef}
        src={`https://www.youtube.com/embed/${finalVideoId}?autoplay=${
          isPlaying ? 1 : 0
        }&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0`}
        title={title || "YouTube video player"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className={`absolute inset-0 h-full w-full ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
      ></iframe>

      {/* Custom controls overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-4 transition-opacity duration-300 hover:opacity-100 bg-gradient-to-t from-black/80 via-transparent to-black/40">
        {/* Top controls */}
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-white drop-shadow-md">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <X size={20} />
          </button>
        </div>

        {/* Center play/pause button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!isPlaying && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={togglePlay}
                className="rounded-full bg-primary/80 p-6 text-white shadow-lg hover:bg-primary"
              >
                <Play size={32} fill="currentColor" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={toggleMute}
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default YouTubeEmbed;
