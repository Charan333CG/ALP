const express = require('express');
const Course = require('../models/Course');
const Transcript = require('../models/Transcript');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all courses (only approved ones for students)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' })
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get course by id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create course (teacher only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const {
    title, description, difficulty, duration, language, tags,
    videoUrl, captionUrl, transcript, signLanguageUrl, thumbnail, altText, audioDescription,
    accessibilityFeatures
  } = req.body;

  try {
    const course = new Course({
      title,
      description,
      teacher: req.user.id,
      difficulty,
      duration,
      language,
      tags,
      videoUrl,
      captionUrl,
      transcript,
      signLanguageUrl,
      thumbnail,
      altText,
      audioDescription,
      accessibilityFeatures,
      status: 'pending' // Courses start as pending for admin approval
    });

    await course.save();

    // Create transcript document if transcript is provided
    if (transcript) {
      const transcriptDoc = new Transcript({
        course: course._id,
        fullText: transcript,
        segments: [] // Would be populated by a transcription service
      });
      await transcriptDoc.save();
    }

    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Enroll in course (student)
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled' });
    }
    course.enrolledStudents.push(req.user.id);
    await course.save();
    res.json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get pending courses (admin only)
router.get('/pending', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const courses = await Course.find({ status: 'pending' })
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve course (admin only)
router.put('/:id/approve', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject course (admin only)
router.put('/:id/reject', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { reviewNotes } = req.body;

  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        reviewNotes
      },
      { new: true }
    );
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get transcript for course
router.get('/:id/transcript', async (req, res) => {
  try {
    const transcript = await Transcript.findOne({ course: req.params.id });
    if (!transcript) return res.status(404).json({ message: 'Transcript not found' });
    res.json(transcript);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user accessibility preferences
router.put('/users/:id/accessibility', auth, async (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const user = await require('../models/User').findByIdAndUpdate(
      req.params.id,
      { accessibilityPreferences: req.body },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.accessibilityPreferences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;