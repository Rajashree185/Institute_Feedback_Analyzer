const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const {
  getProfile,
  getTeachers,
  submitFeedback,
  getMyFeedback,
  updateAttendance,
  updateSection
} = require('../controllers/studentController');

// All student routes require JWT + student role
router.use(authMiddleware);
router.use(requireRole('student'));

// GET /api/student/profile — Retrieve own profile and attendance percentage
router.get('/profile', getProfile);

// PUT /api/student/attendance — Update attendance percentage dynamically
router.put('/attendance', updateAttendance);

// PUT /api/student/section — Update student section dynamically
router.put('/section', updateSection);

// GET /api/student/teachers — List all teachers for the feedback form dropdown
router.get('/teachers', getTeachers);

// POST /api/student/feedback — Submit feedback (guardrail enforced server-side)
router.post('/feedback', submitFeedback);

// GET /api/student/feedback — View list of all feedback the student has submitted
router.get('/feedback', getMyFeedback);

module.exports = router;
