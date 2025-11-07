const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  accessibilityPreferences: {
    highContrast: { type: Boolean, default: false },
    largeText: { type: Boolean, default: false },
    ttsEnabled: { type: Boolean, default: true },
    captionsEnabled: { type: Boolean, default: true },
    transcriptEnabled: { type: Boolean, default: true },
    signLanguageEnabled: { type: Boolean, default: false },
    ttsVoice: { type: String, default: 'default' },
    ttsRate: { type: Number, default: 1.0 },
    ttsPitch: { type: Number, default: 1.0 }
  },
  createdAt: { type: Date, default: Date.now },
});

// Password hashing is done in the route

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);