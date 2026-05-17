const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

/**
 * POST /api/auth/register
 * Registers a new user (student or teacher).
 * Students provide: name, email, password, role, roll_no, department, attendance
 * Teachers provide: name, email, password, role, subject, department
 */
const register = (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ── Validate common required fields ──
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, password, and role are required.'
      });
    }

    // ── Validate role ──
    if (!['student', 'teacher'].includes(role)) {
      return res.status(400).json({
        error: "Role must be either 'student' or 'teacher'."
      });
    }

    // ── Validate password length ──
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters long.'
      });
    }

    // ── Check if email already exists ──
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists.'
      });
    }

    // ── Hash password ──
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // ── Insert into USERS table ──
    const insertUser = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    );
    const result = insertUser.run(name, email, hashedPassword, role);
    const userId = result.lastInsertRowid;

    // ── Insert into role-specific table ──
    if (role === 'student') {
      const { roll_no, department } = req.body;

      if (!roll_no || !department) {
        // Rollback: delete the user we just created
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        return res.status(400).json({
          error: 'Students must provide roll_no and department.'
        });
      }

      // Check duplicate roll_no
      const existingRoll = db.prepare('SELECT id FROM students WHERE roll_no = ?').get(roll_no);
      if (existingRoll) {
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        return res.status(409).json({
          error: 'A student with this roll number already exists.'
        });
      }

      db.prepare(
        'INSERT INTO students (user_id, roll_no, department, attendance) VALUES (?, ?, ?, ?)'
      ).run(userId, roll_no, department, 100.0);

    } else if (role === 'teacher') {
      const { subject, department } = req.body;

      if (!subject || !department) {
        db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        return res.status(400).json({
          error: 'Teachers must provide subject and department.'
        });
      }

      db.prepare(
        'INSERT INTO teachers (user_id, subject, department) VALUES (?, ?, ?)'
      ).run(userId, subject, department);
    }

    // ── Sign JWT ──
    const token = jwt.sign(
      { userId, role, name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: userId, name, email, role }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a signed JWT.
 */
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validate required fields ──
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    // ── Find user by email ──
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // ── Verify password ──
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    // ── Sign JWT ──
    const token = jwt.sign(
      { userId: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
};

module.exports = { register, login };
