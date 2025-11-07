import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    highContrast: false,
    largeText: false,
    ttsEnabled: true,
    captionsEnabled: true,
    transcriptEnabled: true,
    signLanguageEnabled: false,
    ttsVoice: 'default',
    ttsRate: 1.0,
    ttsPitch: 1.0
  });

  // Load user preferences from backend
  useEffect(() => {
    if (user?.accessibilityPreferences) {
      setPreferences(user.accessibilityPreferences);
    }
  }, [user]);

  // Update preferences and sync with backend
  const updatePreferences = async (newPreferences) => {
    setPreferences(newPreferences);

    if (user) {
      try {
        await axios.put(`http://localhost:3001/api/users/${user.id}/accessibility`, newPreferences);
      } catch (error) {
        console.error('Failed to update accessibility preferences:', error);
      }
    }
  };

  // Toggle specific accessibility features
  const toggleHighContrast = () => {
    updatePreferences({ ...preferences, highContrast: !preferences.highContrast });
  };

  const toggleLargeText = () => {
    updatePreferences({ ...preferences, largeText: !preferences.largeText });
  };

  const toggleTTS = () => {
    updatePreferences({ ...preferences, ttsEnabled: !preferences.ttsEnabled });
  };

  const toggleCaptions = () => {
    updatePreferences({ ...preferences, captionsEnabled: !preferences.captionsEnabled });
  };

  const toggleTranscript = () => {
    updatePreferences({ ...preferences, transcriptEnabled: !preferences.transcriptEnabled });
  };

  const toggleSignLanguage = () => {
    updatePreferences({ ...preferences, signLanguageEnabled: !preferences.signLanguageEnabled });
  };

  // Update TTS settings
  const updateTTSSettings = (voice, rate, pitch) => {
    updatePreferences({
      ...preferences,
      ttsVoice: voice,
      ttsRate: rate,
      ttsPitch: pitch
    });
  };

  // Get CSS classes based on preferences
  const getAccessibilityClasses = () => {
    const classes = [];
    if (preferences.highContrast) classes.push('high-contrast');
    if (preferences.largeText) classes.push('large-text');
    return classes.join(' ');
  };

  return (
    <AccessibilityContext.Provider value={{
      preferences,
      updatePreferences,
      toggleHighContrast,
      toggleLargeText,
      toggleTTS,
      toggleCaptions,
      toggleTranscript,
      toggleSignLanguage,
      updateTTSSettings,
      getAccessibilityClasses
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};