import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import TTSButton from '../components/TTSButton';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filters, setFilters] = useState({
    hasCaptions: false,
    hasTranscript: false,
    hasSignLanguage: false,
    difficulty: '',
    search: ''
  });
  const { user } = useAuth();
  const { preferences, getAccessibilityClasses } = useAccessibility();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/courses');
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(`http://localhost:3001/api/courses/${courseId}/enroll`);
      alert('Enrolled successfully!');
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filter courses based on accessibility preferences and filters
  const filteredCourses = courses.filter(course => {
    if (filters.search && !course.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !course.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.hasCaptions && !course.accessibilityFeatures?.hasCaptions) return false;
    if (filters.hasTranscript && !course.accessibilityFeatures?.hasTranscript) return false;
    if (filters.hasSignLanguage && !course.accessibilityFeatures?.hasSignLanguage) return false;
    if (filters.difficulty && course.difficulty !== filters.difficulty) return false;
    return true;
  });

  return (
    <div className={getAccessibilityClasses()}>
      <AccessibilityToolbar />

      {/* Search and Filters */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Find Courses</h2>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            aria-label="Search courses"
          />
        </div>

        {/* Accessibility Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.hasCaptions}
              onChange={(e) => setFilters({...filters, hasCaptions: e.target.checked})}
              className="rounded"
            />
            <span className="text-sm">📝 Has Captions</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.hasTranscript}
              onChange={(e) => setFilters({...filters, hasTranscript: e.target.checked})}
              className="rounded"
            />
            <span className="text-sm">📄 Has Transcript</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={filters.hasSignLanguage}
              onChange={(e) => setFilters({...filters, hasSignLanguage: e.target.checked})}
              className="rounded"
            />
            <span className="text-sm">🤟 Has Sign Language</span>
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8" id="courses-heading">
        Courses
        <TTSButton text={`Courses page. ${filteredCourses.length} courses found.`} className="ml-4" />
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-labelledby="courses-heading">
        {filteredCourses.map((course) => (
          <div key={course._id} className="card p-4">
            {course.thumbnail && (
              <img
                src={course.thumbnail}
                alt={course.altText || course.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}

            {/* Accessibility Features Badges */}
            <div className="flex flex-wrap gap-1 mb-3">
              {course.accessibilityFeatures?.hasCaptions && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">📝 Captions</span>
              )}
              {course.accessibilityFeatures?.hasTranscript && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">📄 Transcript</span>
              )}
              {course.accessibilityFeatures?.hasSignLanguage && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">🤟 ASL</span>
              )}
              {course.accessibilityFeatures?.hasAudioDescription && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">🔊 Audio Desc</span>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">
              {course.title}
              <TTSButton text={course.title} className="ml-2" />
            </h3>
            <p className="text-gray-600 mb-2">
              {course.description}
              <TTSButton text={course.description} className="ml-2" />
            </p>
            <p className="text-sm text-gray-500 mb-2">Teacher: {course.teacher.name}</p>
            <p className="text-sm text-gray-500 mb-4">
              Level: {course.difficulty} • Duration: {course.duration ? `${course.duration} min` : 'N/A'}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedCourse(course)}
                className="btn flex-1"
                aria-label={`View course ${course.title}`}
              >
                View
              </button>
              {user && !course.enrolledStudents.includes(user.id) && (
                <button
                  onClick={() => handleEnroll(course._id)}
                  className="btn flex-1 bg-accent"
                  aria-label={`Enroll in ${course.title}`}
                >
                  Enroll
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="course-modal-title">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full max-h-full overflow-y-auto">
            <h2 id="course-modal-title" className="text-2xl font-bold mb-4">{selectedCourse.title}</h2>
            <div className="mb-4">
              <video controls className="w-full" aria-label={`Video for ${selectedCourse.title}`}>
                <source src={selectedCourse.videoUrl} type="video/mp4" />
                {selectedCourse.captionUrl && <track kind="captions" src={selectedCourse.captionUrl} srclang="en" label="English" />}
                Your browser does not support the video tag.
              </video>
            </div>
            {selectedCourse.signLanguageUrl && (
              <div className="mb-4">
                <button className="btn" aria-label="Toggle sign language overlay">Toggle Sign Language</button>
                {/* Placeholder for overlay logic */}
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Transcript</h3>
              <p className="text-gray-700">{selectedCourse.transcript}</p>
              <button
                onClick={() => speakText(selectedCourse.transcript)}
                className="btn mt-2"
                aria-label="Read aloud transcript"
              >
                Read Aloud
              </button>
            </div>
            <button
              onClick={() => setSelectedCourse(null)}
              className="btn bg-gray-500"
              aria-label="Close course modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;