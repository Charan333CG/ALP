import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibleVideoPlayer = ({
  videoUrl,
  captionUrl,
  signLanguageUrl,
  title,
  onTimeUpdate
}) => {
  const { preferences } = useAccessibility();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showSignLanguage, setShowSignLanguage] = useState(false);

  // Handle video time updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  // Handle video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Seek to time
  const seekTo = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Format time for display
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seekTo(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seekTo(Math.min(duration, currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
        case 'm':
          e.preventDefault();
          setVolume(volume > 0 ? 0 : 1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentTime, duration, volume]);

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      {/* Main Video */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
        aria-label={`Video: ${title}`}
      >
        {preferences.captionsEnabled && captionUrl && (
          <track
            kind="captions"
            src={captionUrl}
            srcLang="en"
            label="English"
            default
          />
        )}
        Your browser does not support the video tag.
      </video>

      {/* Sign Language Overlay */}
      {preferences.signLanguageEnabled && signLanguageUrl && showSignLanguage && (
        <div className="absolute top-4 right-4 w-64 h-48 bg-white rounded shadow-lg overflow-hidden">
          <video
            src={signLanguageUrl}
            className="w-full h-full object-cover"
            muted
            autoPlay
            aria-label="Sign language interpretation"
          />
          <button
            onClick={() => setShowSignLanguage(false)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
            aria-label="Close sign language interpretation"
          >
            ×
          </button>
        </div>
      )}

      {/* Video Controls */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center space-x-4 mb-2">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          {/* Progress Bar */}
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => seekTo(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Video progress"
            />
          </div>

          {/* Time Display */}
          <span className="text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <span className="text-sm">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Volume control"
            />
          </div>

          {/* Sign Language Toggle */}
          {signLanguageUrl && (
            <button
              onClick={() => setShowSignLanguage(!showSignLanguage)}
              className={`px-3 py-1 rounded text-sm ${
                showSignLanguage
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-600 hover:bg-gray-700'
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
              aria-label={showSignLanguage ? 'Hide sign language' : 'Show sign language'}
              aria-pressed={showSignLanguage}
            >
              🤟 ASL
            </button>
          )}

          {/* Keyboard Shortcuts Info */}
          <div className="text-xs text-gray-400 ml-auto">
            Space/K: Play/Pause • ←/→: Seek • ↑/↓: Volume • M: Mute
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibleVideoPlayer;