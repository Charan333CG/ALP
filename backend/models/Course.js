const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  videoUrl: { type: String },
  captionUrl: { type: String }, // .vtt file
  transcript: { type: String },
  signLanguageUrl: { type: String }, // optional sign language video
  thumbnail: { type: String },
  altText: { type: String }, // alt text for thumbnail/video
  audioDescription: { type: String }, // audio description for video content
  enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  accessibilityFeatures: {
    hasCaptions: { type: Boolean, default: false },
    hasTranscript: { type: Boolean, default: false },
    hasSignLanguage: { type: Boolean, default: false },
    hasAudioDescription: { type: Boolean, default: false },
    ttsCompatible: { type: Boolean, default: true },
    keyboardAccessible: { type: Boolean, default: true },
    screenReaderFriendly: { type: Boolean, default: true }
  },
  status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' },
  reviewNotes: { type: String },
  tags: [{ type: String }],
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  duration: { type: Number }, // in minutes
  language: { type: String, default: 'en' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);