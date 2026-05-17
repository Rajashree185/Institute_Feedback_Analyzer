const db = require('../models/db');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

/**
 * GET /api/student/profile
 * Returns the authenticated student's profile (name, roll_no, department, attendance).
 */
const getProfile = (req, res) => {
  try {
    const profile = db.prepare(`
      SELECT u.name, u.email, s.roll_no, s.department, s.attendance, s.id as student_id
      FROM users u
      JOIN students s ON s.user_id = u.id
      WHERE u.id = ?
    `).get(req.user.userId);

    if (!profile) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    res.status(200).json({ profile });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * GET /api/student/teachers
 * Returns a list of all teachers for the feedback form dropdown.
 */
const getTeachers = (req, res) => {
  try {
    const teachers = db.prepare(`
      SELECT t.id as teacher_id, u.name, t.subject, t.department
      FROM users u
      JOIN teachers t ON t.user_id = u.id
      ORDER BY u.name ASC
    `).all();

    res.status(200).json({ teachers });
  } catch (err) {
    console.error('Get teachers error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * POST /api/student/feedback
 * Submit feedback for a teacher.
 * 
 * GUARDRAIL (Backend Layer):
 * If student attendance < 60% AND rating < 3, reject with HTTP 403.
 * This is the security-critical enforcement — cannot be bypassed.
 */
const submitFeedback = (req, res) => {
  try {
    const { teacher_id, rating, remarks } = req.body;

    // ── Validate required fields ──
    if (!teacher_id || !rating || !remarks) {
      return res.status(400).json({
        error: 'teacher_id, rating, and remarks are required.'
      });
    }

    // ── Validate rating range ──
    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        error: 'Rating must be an integer between 1 and 5.'
      });
    }

    // ── Validate remarks is not empty ──
    if (typeof remarks !== 'string' || remarks.trim().length === 0) {
      return res.status(400).json({
        error: 'Remarks cannot be empty.'
      });
    }

    // ── Fetch student record from DB (never trust frontend values) ──
    const student = db.prepare(`
      SELECT s.id as student_id, s.attendance
      FROM students s
      WHERE s.user_id = ?
    `).get(req.user.userId);

    if (!student) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    // ── GUARDRAIL CHECK (Backend Layer) ──
    if (student.attendance < 60 && ratingNum < 3) {
      return res.status(403).json({
        error: 'Rating restricted due to attendance below 60%. Minimum allowed rating is 3.',
        guardrail: true,
        attendance: student.attendance,
        minAllowed: 3
      });
    }

    // ── Verify teacher exists ──
    const teacher = db.prepare('SELECT id FROM teachers WHERE id = ?').get(teacher_id);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    // ── Run NLP sentiment analysis on remarks ──
    const analysis = sentiment.analyze(remarks.trim());
    let classification = 'neutral';
    if (analysis.score > 0) classification = 'positive';
    else if (analysis.score < 0) classification = 'negative';

    // ── Insert feedback (UNIQUE constraint handles duplicates) ──
    try {
      db.prepare(`
        INSERT INTO feedback (student_id, teacher_id, rating, remarks, sentiment, score)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(student.student_id, teacher_id, ratingNum, remarks.trim(), classification, analysis.score);
    } catch (insertErr) {
      // UNIQUE constraint violation = duplicate feedback
      if (insertErr.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({
          error: 'You have already submitted feedback for this teacher.'
        });
      }
      throw insertErr;
    }

    res.status(201).json({
      message: 'Feedback submitted successfully.',
      feedback: {
        teacher_id,
        rating: ratingNum,
        remarks: remarks.trim(),
        sentiment: classification,
        score: analysis.score
      }
    });

  } catch (err) {
    console.error('Submit feedback error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * GET /api/student/feedback
 * Returns all feedback the authenticated student has submitted.
 */
const getMyFeedback = (req, res) => {
  try {
    // Get student_id from user_id
    const student = db.prepare('SELECT id FROM students WHERE user_id = ?').get(req.user.userId);

    if (!student) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    const feedbackList = db.prepare(`
      SELECT f.id, f.rating, f.remarks, f.sentiment, f.score, f.submitted_at,
             u.name as teacher_name, t.subject, t.department
      FROM feedback f
      JOIN teachers t ON t.id = f.teacher_id
      JOIN users u ON u.id = t.user_id
      WHERE f.student_id = ?
      ORDER BY f.submitted_at DESC
    `).all(student.id);

    res.status(200).json({ feedback: feedbackList });
  } catch (err) {
    console.error('Get feedback error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

/**
 * PUT /api/student/attendance
 * Updates the authenticated student's attendance percentage.
 */
const updateAttendance = (req, res) => {
  try {
    const { attendance } = req.body;

    if (attendance === undefined || attendance === null) {
      return res.status(400).json({ error: 'Attendance value is required.' });
    }

    const attendanceNum = parseFloat(attendance);
    if (isNaN(attendanceNum) || attendanceNum < 0.0 || attendanceNum > 100.0) {
      return res.status(400).json({ error: 'Attendance must be a number between 0 and 100.' });
    }

    const result = db.prepare(`
      UPDATE students
      SET attendance = ?
      WHERE user_id = ?
    `).run(attendanceNum, req.user.userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Student record not found.' });
    }

    res.status(200).json({
      message: 'Attendance updated successfully.',
      attendance: attendanceNum
    });
  } catch (err) {
    console.error('Update attendance error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getProfile, getTeachers, submitFeedback, getMyFeedback, updateAttendance };
