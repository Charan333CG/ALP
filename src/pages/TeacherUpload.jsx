import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import TTSButton from '../components/TTSButton';

const TeacherUpload = () => {
  const { user } = useAuth();
  const { getAccessibilityClasses } = useAccessibility();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    duration: '',
    language: 'en',
    tags: '',
    videoUrl: '',
    captionUrl: '',
    transcript: '',
    signLanguageUrl: '',
    thumbnail: '',
    altText: '',
    audioDescription: '',
    hasCaptions: false,
    hasTranscript: false,
    hasSignLanguage: false,
    hasAudioDescription: false,
    ttsCompatible: true,
    keyboardAccessible: true,
    screenReaderFriendly: true
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        accessibilityFeatures: {
          hasCaptions: formData.hasCaptions,
          hasTranscript: formData.hasTranscript,
          hasSignLanguage: formData.hasSignLanguage,
          hasAudioDescription: formData.hasAudioDescription,
          ttsCompatible: formData.ttsCompatible,
          keyboardAccessible: formData.keyboardAccessible,
          screenReaderFriendly: formData.screenReaderFriendly
        }
      };

      await axios.post('http://localhost:3001/api/courses', courseData);

      alert('Course submitted for review! It will be published once approved by an admin.');
      setFormData({
        title: '',
        description: '',
        difficulty: 'beginner',
        duration: '',
        language: 'en',
        tags: '',
        videoUrl: '',
        captionUrl: '',
        transcript: '',
        signLanguageUrl: '',
        thumbnail: '',
        altText: '',
        audioDescription: '',
        hasCaptions: false,
        hasTranscript: false,
        hasSignLanguage: false,
        hasAudioDescription: false,
        ttsCompatible: true,
        keyboardAccessible: true,
        screenReaderFriendly: true
      });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Failed to upload course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'teacher') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-600 mt-2">Only teachers can upload courses.</p>
      </div>
    );
  }

  return (
    <div className={getAccessibilityClasses()}>
      <AccessibilityToolbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Upload New Course
          <TTSButton text="Upload New Course page" className="ml-4" />
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty Level</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <input
                  type="text"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., accessibility, learning, tutorial"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Media Content */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Media Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Video URL</label>
                <input
                  type="url"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/video.mp4"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  placeholder="https://example.com/thumbnail.jpg"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail Alt Text</label>
                <input
                  type="text"
                  name="altText"
                  value={formData.altText}
                  onChange={handleChange}
                  placeholder="Describe the thumbnail image"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sign Language Video URL</label>
                <input
                  type="url"
                  name="signLanguageUrl"
                  value={formData.signLanguageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/sign-language.mp4"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Accessibility Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Caption File URL (.vtt)</label>
                <input
                  type="url"
                  name="captionUrl"
                  value={formData.captionUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/captions.vtt"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Audio Description</label>
                <textarea
                  name="audioDescription"
                  value={formData.audioDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe visual elements for screen readers"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Transcript</label>
              <textarea
                name="transcript"
                value={formData.transcript}
                onChange={handleChange}
                rows={6}
                placeholder="Full text transcript of the video content"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Accessibility Checkboxes */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Accessibility Compliance</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasCaptions"
                    checked={formData.hasCaptions}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">📝 Has Captions/Subtitles</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasTranscript"
                    checked={formData.hasTranscript}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">📄 Has Full Transcript</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasSignLanguage"
                    checked={formData.hasSignLanguage}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">🤟 Has Sign Language Interpretation</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasAudioDescription"
                    checked={formData.hasAudioDescription}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">🔊 Has Audio Description</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="ttsCompatible"
                    checked={formData.ttsCompatible}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">🗣️ TTS Compatible</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="keyboardAccessible"
                    checked={formData.keyboardAccessible}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">⌨️ Keyboard Accessible</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="screenReaderFriendly"
                    checked={formData.screenReaderFriendly}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">🎧 Screen Reader Friendly</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Uploading...' : 'Submit for Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherUpload;