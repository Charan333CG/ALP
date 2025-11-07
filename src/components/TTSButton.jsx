import { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const TTSButton = ({ text, className = '', children }) => {
  const { preferences } = useAccessibility();
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  // Check if speech synthesis is supported
  useEffect(() => {
    setSupported('speechSynthesis' in window);
  }, []);

  const handleSpeak = () => {
    if (!supported) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (!preferences.ttsEnabled) {
      alert('Text-to-speech is disabled in your accessibility settings.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = preferences.ttsRate || 0.9;
      utterance.pitch = preferences.ttsPitch || 1;
      utterance.volume = 1;

      if (preferences.ttsVoice && preferences.ttsVoice !== 'default') {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find(voice => voice.name === preferences.ttsVoice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      }

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Don't render if TTS is not supported or disabled
  if (!supported || !preferences.ttsEnabled) {
    return null;
  }

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isPlaying
          ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200'
      } ${className}`}
      aria-label={isPlaying ? 'Stop text-to-speech' : 'Read aloud with text-to-speech'}
      aria-pressed={isPlaying}
      disabled={!text}
    >
      {children || (
        <>
          {isPlaying ? (
            <>
              <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.816L4.414 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.414l3.969-3.816a1 1 0 011.616.816zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              Listen
            </>
          )}
        </>
      )}
    </button>
  );
};

export default TTSButton;