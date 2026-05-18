const db = require('../models/db');
const { generateReport } = require('../utils/sentimentAnalyzer');

/**
 * GET /api/teacher/profile
 * Returns the authenticated teacher's profile (name, subject, department).
 */
const getProfile = (req, res) => {
  try {
    const profile = db.prepare(`
      SELECT u.name, u.email, t.subject, t.department, t.id as teacher_id
      FROM users u
      JOIN teachers t ON t.user_id = u.id
      WHERE u.id = ?
    `).get(req.user.userId);

    if (!profile) {
      return res.status(404).json({ error: 'Teacher profile not found.' });
    }

    res.status(200).json({ profile });
  } catch (err) {
    console.error('Get teacher profile error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * GET /api/teacher/feedback
 * Returns all feedback submitted for this specific teacher.
 * Includes student details: name, roll_no, department, attendance, rating, remarks, sentiment.
 * Data isolation: only feedback addressed to the logged-in teacher is returned.
 */
const getFeedback = (req, res) => {
  try {
    // Get teacher_id from user_id
    const teacher = db.prepare('SELECT id FROM teachers WHERE user_id = ?').get(req.user.userId);

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher record not found.' });
    }

    const feedbackList = db.prepare(`
      SELECT f.id, f.rating, f.remarks, f.sentiment, f.score, f.submitted_at,
             u.name as student_name, s.roll_no, s.department as student_department, s.year as student_year, s.semester as student_semester, s.attendance
      FROM feedback f
      JOIN students s ON s.id = f.student_id
      JOIN users u ON u.id = s.user_id
      WHERE f.teacher_id = ?
      ORDER BY f.submitted_at DESC
    `).all(teacher.id);

    res.status(200).json({ feedback: feedbackList });
  } catch (err) {
    console.error('Get teacher feedback error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * GET /api/teacher/report
 * Generates an NLP sentiment analysis report on all remarks for this teacher.
 * Returns: totalCount, avgRating, sentimentBreakdown, positiveKeywords, negativeKeywords.
 */
const getReport = (req, res) => {
  try {
    // Get teacher_id from user_id
    const teacher = db.prepare('SELECT id FROM teachers WHERE user_id = ?').get(req.user.userId);

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher record not found.' });
    }

    // Fetch all feedback for this teacher
    const feedbackItems = db.prepare(`
      SELECT rating, remarks
      FROM feedback
      WHERE teacher_id = ?
    `).all(teacher.id);

    // Generate aggregate NLP report
    const report = generateReport(feedbackItems);

    res.status(200).json({ report });
  } catch (err) {
    console.error('Generate report error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getProfile, getFeedback, getReport };
