import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Moon, Sun, Type, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const { settings, updateSettings } = useAccessibility();

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const toggleSpeech = () => {
    updateSettings({ speechEnabled: !settings.speechEnabled });
  };

  const increaseFontSize = () => {
    updateSettings({ fontSize: Math.min(settings.fontSize + 1, 5) });
  };

  const decreaseFontSize = () => {
    updateSettings({ fontSize: Math.max(settings.fontSize - 1, 1) });
  };

  const toggleHighContrast = () => {
    updateSettings({ highContrast: !settings.highContrast });
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">Welcome, {user?.name}</h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Font Size Controls */}
        <div className="flex items-center space-x-1">
          <button
            onClick={decreaseFontSize}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Decrease font size"
          >
            <Type size={16} />
            <span className="ml-1 text-xs">-</span>
          </button>
          <span className="text-sm px-2">{settings.fontSize}</span>
          <button
            onClick={increaseFontSize}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Increase font size"
          >
            <Type size={16} />
            <span className="ml-1 text-xs">+</span>
          </button>
        </div>

        {/* Speech Toggle */}
        <button
          onClick={toggleSpeech}
          className={`p-2 rounded hover:bg-gray-100 ${settings.speechEnabled ? 'text-green-600' : 'text-gray-600'}`}
          aria-label={settings.speechEnabled ? 'Disable speech' : 'Enable speech'}
        >
          {settings.speechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* High Contrast Toggle */}
        <button
          onClick={toggleHighContrast}
          className={`p-2 rounded hover:bg-gray-100 ${settings.highContrast ? 'text-blue-600' : 'text-gray-600'}`}
          aria-label={settings.highContrast ? 'Disable high contrast' : 'Enable high contrast'}
        >
          {settings.highContrast ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-gray-100"
          aria-label={settings.theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {settings.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;