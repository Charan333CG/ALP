import { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import TTSButton from '../components/TTSButton';

const SignLanguage = () => {
  const { getAccessibilityClasses } = useAccessibility();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const signLanguageVideos = [
    {
      id: 1,
      title: "Basic Greetings in Sign Language",
      description: "Learn common greetings and introductions in American Sign Language (ASL)",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "/thumbnails/sign-language-greetings.jpg",
      duration: "5:30",
      difficulty: "Beginner",
      instructor: "Sarah Johnson",
      transcript: "Hello! Welcome to basic greetings in sign language. Today we'll learn: Hello, Goodbye, Thank you, Please, and You're welcome...",
      altText: "Person demonstrating sign language greeting with both hands forming hello gesture"
    },
    {
      id: 2,
      title: "Numbers 1-20 in ASL",
      description: "Master counting from 1 to 20 in American Sign Language",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "/thumbnails/sign-language-numbers.jpg",
      duration: "8:15",
      difficulty: "Beginner",
      instructor: "Mike Chen",
      transcript: "Let's learn numbers in sign language! One, two, three, four, five...",
      altText: "Instructor showing number signs with clear hand movements for counting"
    },
    {
      id: 3,
      title: "Family Members Signs",
      description: "Learn signs for family relationships and members",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail: "/thumbnails/sign-language-family.jpg",
      duration: "6:45",
      difficulty: "Beginner",
      instructor: "Lisa Rodriguez",
      transcript: "Family is important! Learn to sign: Mother, Father, Brother, Sister, Grandmother, Grandfather...",
      altText: "Family sign language demonstration showing various family member signs"
    },
    {
      id: 4,
      title: "Colors in Sign Language",
      description: "Express colors through American Sign Language",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      thumbnail: "/thumbnails/sign-language-colors.jpg",
      duration: "7:20",
      difficulty: "Beginner",
      instructor: "David Kim",
      transcript: "Colors make the world beautiful! Red, blue, green, yellow, orange, purple, black, white...",
      altText: "Color signs demonstration with vibrant color representations"
    },
    {
      id: 5,
      title: "Common Phrases for Daily Life",
      description: "Essential phrases for everyday communication",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail: "/thumbnails/sign-language-phrases.jpg",
      duration: "10:30",
      difficulty: "Intermediate",
      instructor: "Emma Thompson",
      transcript: "Daily communication is key! Learn: How are you? I'm fine, What's your name? My name is...",
      altText: "Daily conversation phrases in sign language with expressive facial gestures"
    },
    {
      id: 6,
      title: "Weather and Seasons Signs",
      description: "Express weather conditions and seasons in ASL",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnail: "/thumbnails/sign-language-weather.jpg",
      duration: "9:10",
      difficulty: "Intermediate",
      instructor: "Carlos Martinez",
      transcript: "Weather affects our daily lives! Sunny, rainy, cloudy, windy, hot, cold, spring, summer, fall, winter...",
      altText: "Weather and seasons signs with corresponding visual weather representations"
    }
  ];

  return (
    <div className={getAccessibilityClasses()}>
      <AccessibilityToolbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            🤟 Sign Language Learning Center
            <TTSButton text="Sign Language Learning Center page" className="ml-4" />
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Master American Sign Language (ASL) with our comprehensive video library.
            Each lesson includes clear demonstrations, practice opportunities, and cultural context.
            <TTSButton text="Master American Sign Language with our comprehensive video library. Each lesson includes clear demonstrations, practice opportunities, and cultural context." className="ml-4" />
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {signLanguageVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedVideo(video)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedVideo(video);
                }
              }}
              aria-label={`Open video: ${video.title}`}
            >
              {/* Thumbnail */}
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.altText || `Sign language video: ${video.title}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-white bg-opacity-90 rounded-full p-4">
                    <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    video.difficulty === 'Beginner'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {video.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {video.title}
                  <TTSButton text={video.title} className="ml-2" />
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {video.description}
                  <TTSButton text={video.description} className="ml-2" />
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>👨‍🏫 {video.instructor}</span>
                  <span>▶️ Watch Now</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Tips */}
        <div className="bg-blue-50 dark:bg-blue-900 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">
            💡 Learning Tips
            <TTSButton text="Learning Tips section" className="ml-4" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold mb-2">Practice Regularly</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Sign language requires muscle memory. Practice daily, even if only for 10-15 minutes.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold mb-2">Watch and Repeat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                First watch the complete sign, then break it down and practice each movement.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded">
              <h3 className="font-semibold mb-2">Use Facial Expressions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Facial expressions are crucial in ASL. They convey grammar, emotion, and emphasis.
              </p>
            </div>
          </div>
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                    aria-label="Close video"
                  >
                    ×
                  </button>
                </div>

                <div className="mb-6">
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    className="w-full rounded-lg"
                    aria-label={`Sign language video: ${selectedVideo.title}`}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Video Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Instructor:</strong> {selectedVideo.instructor}</p>
                      <p><strong>Duration:</strong> {selectedVideo.duration}</p>
                      <p><strong>Difficulty:</strong> {selectedVideo.difficulty}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Transcript</h3>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded max-h-32 overflow-y-auto text-sm">
                      {selectedVideo.transcript}
                    </div>
                    <TTSButton text={selectedVideo.transcript} className="mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignLanguage;