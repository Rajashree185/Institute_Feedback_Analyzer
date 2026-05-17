const Database = require('better-sqlite3');
const path = require('path');

// Create/open the SQLite database file
const dbPath = path.join(__dirname, '..', 'feedback.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Enable foreign key enforcement (SQLite has it OFF by default)
db.pragma('foreign_keys = ON');

// ============================================================
// Schema Initialization — Creates all tables if they don't exist
// ============================================================

// USERS Table — Authentication Root
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'teacher')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// STUDENTS Table — Student Profile (extends USERS)
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    roll_no TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    attendance REAL NOT NULL CHECK(attendance >= 0.0 AND attendance <= 100.0),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// TEACHERS Table — Teacher Profile (extends USERS)
db.exec(`
  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    subject TEXT NOT NULL,
    department TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`);

// FEEDBACK Table — Core Transaction Record
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    remarks TEXT NOT NULL,
    sentiment TEXT,
    score REAL,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, teacher_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
  )
`);

console.log('✅ Database initialized — all tables ready');

module.exports = db;
