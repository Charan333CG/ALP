import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import AccessibleVideoPlayer from '../components/AccessibleVideoPlayer';
import TranscriptPanel from '../components/TranscriptPanel';
import TTSButton from '../components/TTSButton';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { preferences, getAccessibilityClasses } = useAccessibility();

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/courses/${id}`);
      setCourse(res.data);

      // Fetch transcript if available
      if (res.data.transcript) {
        const transcriptRes = await axios.get(`http://localhost:3001/api/transcripts/${id}`);
        setTranscript(transcriptRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch course:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      await axios.post(`http://localhost:3001/api/courses/${id}/enroll`);
      alert('Enrolled successfully!');
      fetchCourse(); // Refresh course data
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  const seekToTime = (time) => {
    // This will be passed to the video player
    setCurrentTime(time);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Course not found</h2>
      </div>
    );
  }

  const isEnrolled = course.enrolledStudents?.includes(user?.id);

  return (
    <div className={getAccessibilityClasses()}>
      <AccessibilityToolbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {course.title}
            <TTSButton text={course.title} className="ml-4" />
          </h1>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {course.difficulty}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {course.duration ? `${course.duration} min` : 'Duration N/A'}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {course.language}
            </span>

            {/* Accessibility Features */}
            {course.accessibilityFeatures?.hasCaptions && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                📝 Captions
              </span>
            )}
            {course.accessibilityFeatures?.hasTranscript && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                📄 Transcript
              </span>
            )}
            {course.accessibilityFeatures?.hasSignLanguage && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                🤟 Sign Language
              </span>
            )}
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {course.description}
            <TTSButton text={course.description} className="ml-4" />
          </p>

          <div className="flex items-center justify-between">
            <p className="text-gray-500">By {course.teacher.name}</p>

            {user && !isEnrolled && (
              <button
                onClick={handleEnroll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Enroll Now
              </button>
            )}

            {isEnrolled && (
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                ✓ Enrolled
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            {course.videoUrl && (
              <div className="mb-8">
                <AccessibleVideoPlayer
                  videoUrl={course.videoUrl}
                  captionUrl={course.captionUrl}
                  signLanguageUrl={course.signLanguageUrl}
                  title={course.title}
                  onTimeUpdate={handleTimeUpdate}
                />
              </div>
            )}

            {/* Audio Description */}
            {course.audioDescription && preferences.captionsEnabled && (
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2">🔊 Audio Description</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {course.audioDescription}
                  <TTSButton text={course.audioDescription} className="ml-4" />
                </p>
              </div>
            )}

            {/* Course Content */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="prose dark:prose-invert max-w-none">
                {course.transcript ? (
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {course.transcript}
                    </p>
                    <TTSButton text={course.transcript} className="mt-4" />
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No content available yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Transcript Panel */}
            {preferences.transcriptEnabled && transcript && (
              <TranscriptPanel
                transcript={transcript}
                currentTime={currentTime}
                onSeekTo={seekToTime}
              />
            )}

            {/* Course Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Course Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    course.status === 'approved' ? 'bg-green-100 text-green-800' :
                    course.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Enrolled Students:</span>
                  <span className="ml-2">{course.enrolledStudents?.length || 0}</span>
                </div>

                <div>
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">{new Date(course.createdAt).toLocaleDateString()}</span>
                </div>

                {course.tags && course.tags.length > 0 && (
                  <div>
                    <span className="font-medium">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {course.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;