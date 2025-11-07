import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilityToolbar = () => {
  const {
    preferences,
    toggleHighContrast,
    toggleLargeText,
    toggleTTS,
    toggleCaptions,
    toggleTranscript,
    toggleSignLanguage
  } = useAccessibility();

  return (
    <div className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 border border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-semibold mb-3 text-gray-800 dark:text-white" id="accessibility-toolbar">
        Accessibility
      </h3>

      <div className="space-y-2" role="toolbar" aria-labelledby="accessibility-toolbar">
        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            preferences.highContrast
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          aria-pressed={preferences.highContrast}
          aria-label="Toggle high contrast mode"
        >
          🔆 High Contrast {preferences.highContrast ? '✓' : ''}
        </button>

        {/* Large Text Toggle */}
        <button
          onClick={toggleLargeText}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            preferences.largeText
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          aria-pressed={preferences.largeText}
          aria-label="Toggle large text mode"
        >
          🔍 Large Text {preferences.largeText ? '✓' : ''}
        </button>

        {/* TTS Toggle */}
        <button
          onClick={toggleTTS}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            preferences.ttsEnabled
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          aria-pressed={preferences.ttsEnabled}
          aria-label="Toggle text-to-speech"
        >
          🔊 Text-to-Speech {preferences.ttsEnabled ? '✓' : ''}
        </button>

        {/* Captions Toggle */}
        <button
          onClick={toggleCaptions}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            preferences.captionsEnabled
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          aria-pressed={preferences.captionsEnabled}
          aria-label="Toggle video captions"
        >
          📝 Captions {preferences.captionsEnabled ? '✓' : ''}
        </button>

        {/* Transcript Toggle */}
        <button
          onClick={toggleTranscript}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            preferences.transcriptEnabled
              ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          aria-pressed={preferences.transcriptEnabled}
          aria-label="Toggle transcript display"
        >
          📄 Transcript {preferences.transcriptEnabled ? '✓' : ''}
        </button>

        {/* Sign Language Toggle */}
        <button
          onClick={toggleSignLanguage}
          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
            preferences.signLanguageEnabled
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          aria-pressed={preferences.signLanguageEnabled}
          aria-label="Toggle sign language interpretation"
        >
          🤟 Sign Language {preferences.signLanguageEnabled ? '✓' : ''}
        </button>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Tab to navigate • Enter to activate
        </p>
      </div>
    </div>
  );
};

export default AccessibilityToolbar;