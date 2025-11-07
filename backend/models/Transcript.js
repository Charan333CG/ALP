const mongoose = require('mongoose');

const transcriptSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  segments: [{
    startTime: { type: Number, required: true }, // in seconds
    endTime: { type: Number, required: true },
    text: { type: String, required: true },
    speaker: { type: String }, // optional speaker identification
  }],
  fullText: { type: String, required: true }, // complete transcript text
  language: { type: String, default: 'en' },
  format: { type: String, enum: ['srt', 'vtt', 'json'], default: 'json' },
  downloadable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Index for efficient querying
transcriptSchema.index({ course: 1 });

module.exports = mongoose.model('Transcript', transcriptSchema);