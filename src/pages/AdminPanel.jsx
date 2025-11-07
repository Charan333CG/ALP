import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import TTSButton from '../components/TTSButton';

const AdminPanel = () => {
  const { user } = useAuth();
  const { getAccessibilityClasses } = useAccessibility();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPendingCourses();
    }
  }, [user]);

  const fetchPendingCourses = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/courses/pending');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (courseId) => {
    try {
      await axios.put(`http://localhost:3001/api/courses/${courseId}/approve`);
      alert('Course approved and published!');
      fetchPendingCourses();
    } catch (err) {
      alert('Failed to approve course');
    }
  };

  const handleReject = async (courseId) => {
    if (!reviewNotes.trim()) {
      alert('Please provide review notes for rejection');
      return;
    }

    try {
      await axios.put(`http://localhost:3001/api/courses/${courseId}/reject`, {
        reviewNotes
      });
      alert('Course rejected with feedback');
      setSelectedCourse(null);
      setReviewNotes('');
      fetchPendingCourses();
    } catch (err) {
      alert('Failed to reject course');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
        <p className="text-gray-600 mt-2">Only administrators can access this panel.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={getAccessibilityClasses()}>
      <AccessibilityToolbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Admin Panel - Course Reviews
          <TTSButton text="Admin Panel - Course Reviews page" className="ml-4" />
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Courses List */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Pending Courses ({courses.length})</h2>

            {courses.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
                <p className="text-gray-500">No courses pending review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer transition-colors ${
                      selectedCourse?._id === course._id
                        ? 'ring-2 ring-blue-500'
                        : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          By {course.teacher.name}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Submitted {new Date(course.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 ml-4">
                        {course.accessibilityFeatures?.hasCaptions && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">📝</span>
                        )}
                        {course.accessibilityFeatures?.hasTranscript && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">📄</span>
                        )}
                        {course.accessibilityFeatures?.hasSignLanguage && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">🤟</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        course.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.difficulty}
                      </span>
                      {course.duration && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                          {course.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Course Review Panel */}
          <div>
            {selectedCourse ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Review Course</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">{selectedCourse.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p><strong>Teacher:</strong> {selectedCourse.teacher.name}</p>
                    <p><strong>Description:</strong> {selectedCourse.description}</p>
                    <p><strong>Difficulty:</strong> {selectedCourse.difficulty}</p>
                    <p><strong>Duration:</strong> {selectedCourse.duration ? `${selectedCourse.duration} minutes` : 'Not specified'}</p>
                    <p><strong>Language:</strong> {selectedCourse.language}</p>
                  </div>
                </div>

                {/* Accessibility Features */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Accessibility Features:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className={`p-2 rounded ${selectedCourse.accessibilityFeatures?.hasCaptions ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      📝 Captions: {selectedCourse.accessibilityFeatures?.hasCaptions ? 'Yes' : 'No'}
                    </div>
                    <div className={`p-2 rounded ${selectedCourse.accessibilityFeatures?.hasTranscript ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      📄 Transcript: {selectedCourse.accessibilityFeatures?.hasTranscript ? 'Yes' : 'No'}
                    </div>
                    <div className={`p-2 rounded ${selectedCourse.accessibilityFeatures?.hasSignLanguage ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      🤟 Sign Language: {selectedCourse.accessibilityFeatures?.hasSignLanguage ? 'Yes' : 'No'}
                    </div>
                    <div className={`p-2 rounded ${selectedCourse.accessibilityFeatures?.hasAudioDescription ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      🔊 Audio Description: {selectedCourse.accessibilityFeatures?.hasAudioDescription ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>

                {/* Media Preview */}
                {selectedCourse.videoUrl && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Video Preview:</h4>
                    <video
                      src={selectedCourse.videoUrl}
                      controls
                      className="w-full max-h-48 rounded"
                      aria-label={`Preview of ${selectedCourse.title}`}
                    />
                  </div>
                )}

                {/* Transcript Preview */}
                {selectedCourse.transcript && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Transcript Preview:</h4>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded max-h-32 overflow-y-auto text-sm">
                      {selectedCourse.transcript.length > 200
                        ? `${selectedCourse.transcript.substring(0, 200)}...`
                        : selectedCourse.transcript
                      }
                    </div>
                  </div>
                )}

                {/* Review Actions */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Review Notes (required for rejection):
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Provide feedback for the teacher..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(selectedCourse._id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      ✅ Approve & Publish
                    </button>
                    <button
                      onClick={() => handleReject(selectedCourse._id)}
                      disabled={!reviewNotes.trim()}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                      ❌ Reject with Feedback
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg text-center">
                <p className="text-gray-500">Select a course to review</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;