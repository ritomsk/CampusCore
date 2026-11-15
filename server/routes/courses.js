const express = require('express');
const router = express.Router();
const { Course, Batch, Professor } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// GET / : list all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Batch,
          as: 'batches',
          attributes: ['batch_id', 'prof_id', 'academic_year', 'semester', 'status']
        }
      ],
      order: [['course_code', 'ASC']]
    });
    return res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
});

// POST / : (verifyToken, authorize('Admin')) create course
router.post('/', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const { course_code, title, department, credits } = req.body;

    if (!course_code || !title || !department || credits === undefined) {
      return res.status(400).json({ message: 'course_code, title, department, and credits are required.' });
    }

    const existingCourse = await Course.findByPk(course_code);
    if (existingCourse) {
      return res.status(400).json({ message: 'Course with this code already exists.' });
    }

    const course = await Course.create({
      course_code,
      title,
      department,
      credits: parseInt(credits, 10)
    });

    return res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ message: 'Failed to create course', error: error.message });
  }
});

// GET /:code : get single course with its batches
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const course = await Course.findByPk(code, {
      include: [
        {
          model: Batch,
          as: 'batches',
          include: [
            {
              model: Professor,
              as: 'professor',
              attributes: ['prof_id', 'name', 'department', 'office_room']
            }
          ]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    return res.json(course);
  } catch (error) {
    console.error('Error fetching course by code:', error);
    return res.status(500).json({ message: 'Failed to fetch course details', error: error.message });
  }
});

module.exports = router;
