import { useState, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const TranscriptPanel = ({ transcript, currentTime = 0, onSeekTo }) => {
  const { preferences } = useAccessibility();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSegments, setFilteredSegments] = useState([]);
  const [activeSegment, setActiveSegment] = useState(null);

  // Update active segment based on current time
  useEffect(() => {
    if (transcript?.segments) {
      const currentSegment = transcript.segments.find(
        segment => currentTime >= segment.startTime && currentTime <= segment.endTime
      );
      setActiveSegment(currentSegment);
    }
  }, [currentTime, transcript]);

  // Filter segments based on search term
  useEffect(() => {
    if (!transcript?.segments) {
      setFilteredSegments([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredSegments(transcript.segments);
    } else {
      const filtered = transcript.segments.filter(segment =>
        segment.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSegments(filtered);
    }
  }, [transcript, searchTerm]);

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle segment click to seek
  const handleSegmentClick = (segment) => {
    onSeekTo?.(segment.startTime);
  };

  // Download transcript
  const downloadTranscript = () => {
    if (!transcript) return;

    const content = transcript.segments
      .map(segment => `[${formatTime(segment.startTime)}] ${segment.text}`)
      .join('\n\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!preferences.transcriptEnabled || !transcript) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-h-96 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          📄 Transcript
        </h3>
        <button
          onClick={downloadTranscript}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Download transcript"
        >
          ⬇️ Download
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search transcript..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          aria-label="Search transcript"
        />
      </div>

      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredSegments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            {searchTerm ? 'No matching segments found.' : 'No transcript available.'}
          </p>
        ) : (
          filteredSegments.map((segment, index) => (
            <div
              key={index}
              className={`p-3 rounded cursor-pointer transition-colors ${
                activeSegment === segment
                  ? 'bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleSegmentClick(segment)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSegmentClick(segment);
                }
              }}
              aria-label={`Transcript segment: ${segment.text}. Click to jump to ${formatTime(segment.startTime)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-mono flex-shrink-0">
                  {formatTime(segment.startTime)}
                </span>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                  {segment.text}
                </p>
              </div>
              {segment.speaker && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-12">
                  — {segment.speaker}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer with navigation hint */}
      <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Click any segment to jump to that time in the video
        </p>
      </div>
    </div>
  );
};

export default TranscriptPanel;