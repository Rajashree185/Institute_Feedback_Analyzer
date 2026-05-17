const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleMiddleware');
const { getProfile, getFeedback, getReport } = require('../controllers/teacherController');

// All teacher routes require JWT + teacher role
router.use(authMiddleware);
router.use(requireRole('teacher'));

// GET /api/teacher/profile — Retrieve own teacher profile and subject details
router.get('/profile', getProfile);

// GET /api/teacher/feedback — Get all feedback submitted for this specific teacher
router.get('/feedback', getFeedback);

// GET /api/teacher/report — Generate NLP sentiment analysis report on all remarks
router.get('/report', getReport);

module.exports = router;
