const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

const { sequelize } = require('./models');

// Route imports
const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const batchesRoutes = require('./routes/batches');
const enrollmentsRoutes = require('./routes/enrollments');
const materialsRoutes = require('./routes/materials');
const submissionsRoutes = require('./routes/submissions');
const sessionsRoutes = require('./routes/sessions');
const attendanceRoutes = require('./routes/attendance');
const gradesRoutes = require('./routes/grades');
const placementsRoutes = require('./routes/placements');
const adminRoutes = require('./routes/admin');
const announcementsRoutes = require('./routes/announcements');
const professorsRoutes = require('./routes/professors');
const studentsRoutes = require('./routes/students');
const settingsRoutes = require('./routes/settings');
const timetableRoutes = require('./routes/timetable');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure upload directory exists
const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(uploadDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CampusCore API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/batches', batchesRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/sessions', sessionsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/placements', placementsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/professors', professorsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/timetable', timetableRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Server Initialization
async function startServer() {
  try {
    // Ensure database exists before syncing
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
    const dbUser = process.env.DB_USER || 'root';
    const dbPassword = process.env.DB_PASSWORD || 'Partha123@';
    const dbName = process.env.DB_NAME || 'campuscore';

    try {
      const connection = await mysql.createConnection({
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
      await connection.end();
      console.log(`Database '${dbName}' verified or created.`);
    } catch (dbInitErr) {
      console.warn('Could not auto-create database with raw connection, proceeding to sequelize:', dbInitErr.message);
    }

    await sequelize.sync({ alter: false });
    console.log('Database synced successfully with Sequelize.');

    app.listen(PORT, () => {
      console.log(`CampusCore backend server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
