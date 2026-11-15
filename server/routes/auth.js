const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Student, Professor } = require('../models');
const { verifyToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'campuscore_jwt_secret_key_2026_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// POST /register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, ...profileData } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    if (!['Student', 'Professor', 'Admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password_hash,
      role
    });

    let profile = null;
    if (role === 'Student') {
      const { roll_no, name, program, department, semester, cgpa, backlogs, status } = profileData;
      if (!roll_no || !name || !program || !department) {
        return res.status(400).json({ message: 'roll_no, name, program, and department are required for students.' });
      }
      profile = await Student.create({
        roll_no,
        user_id: user.user_id,
        name,
        program,
        department,
        semester: semester ? parseInt(semester, 10) : 1,
        cgpa: cgpa ? parseFloat(cgpa) : 0.0,
        backlogs: backlogs ? parseInt(backlogs, 10) : 0,
        status: status || 'Active'
      });
    } else if (role === 'Professor') {
      const { prof_id, name, department, office_room } = profileData;
      if (!prof_id || !name || !department) {
        return res.status(400).json({ message: 'prof_id, name, and department are required for professors.' });
      }
      profile = await Professor.create({
        prof_id,
        user_id: user.user_id,
        name,
        department,
        office_room: office_room || null
      });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Internal server error during registration', error: error.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({
      where: { email },
      include: [
        { model: Student, as: 'student' },
        { model: Professor, as: 'professor' }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: `Access denied. Account is not registered as ${role}.` });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const profile = user.role === 'Student' ? user.student : (user.role === 'Professor' ? user.professor : null);

    return res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        profile
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error during login', error: error.message });
  }
});

// GET /me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Student, as: 'student' },
        { model: Professor, as: 'professor' }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const profile = user.role === 'Student' ? user.student : (user.role === 'Professor' ? user.professor : null);

    return res.json({
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        profile
      }
    });
  } catch (error) {
    console.error('Error in /me:', error);
    return res.status(500).json({ message: 'Failed to fetch current user profile', error: error.message });
  }
});

module.exports = router;
