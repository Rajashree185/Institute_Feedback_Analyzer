const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register — Register a new user (student or teacher)
router.post('/register', register);

// POST /api/auth/login — Authenticate user, returns signed JWT
router.post('/login', login);

module.exports = router;
