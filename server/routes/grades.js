const express = require('express');
const router = express.Router();
const { Grade, Enrollment, Student, Batch, Course } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// POST / : (verifyToken, authorize('Professor')) add grade record
router.post('/', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { enrollment_id, assessment_name, score, max_score, co_mapping } = req.body;

    if (!enrollment_id || !assessment_name || score === undefined) {
      return res.status(400).json({ message: 'enrollment_id, assessment_name, and score are required.' });
    }

    const enrollment = await Enrollment.findByPk(enrollment_id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found.' });
    }

    const grade = await Grade.create({
      enrollment_id,
      assessment_name,
      score: parseFloat(score),
      max_score: max_score !== undefined ? parseFloat(max_score) : 100.0,
      co_mapping: co_mapping || null
    });

    return res.status(201).json({ message: 'Grade recorded successfully', grade });
  } catch (error) {
    console.error('Error recording grade:', error);
    return res.status(500).json({ message: 'Failed to record grade', error: error.message });
  }
});

// POST /bulk : (verifyToken, authorize('Professor')) bulk save grades [{enrollment_id, assessment_name, score, max_score, co_mapping}]
router.post('/bulk', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const gradeList = Array.isArray(req.body) ? req.body : req.body.grades;

    if (!Array.isArray(gradeList) || gradeList.length === 0) {
      return res.status(400).json({ message: 'An array of grade records is required.' });
    }

    const records = gradeList.map((g) => ({
      enrollment_id: g.enrollment_id,
      assessment_name: g.assessment_name,
      score: parseFloat(g.score),
      max_score: g.max_score !== undefined ? parseFloat(g.max_score) : 100.0,
      co_mapping: g.co_mapping || null
    }));

    const savedGrades = await Grade.bulkCreate(records);

    return res.status(201).json({
      message: `Successfully saved ${savedGrades.length} grade entries.`,
      count: savedGrades.length,
      grades: savedGrades
    });
  } catch (error) {
    console.error('Error saving bulk grades:', error);
    return res.status(500).json({ message: 'Failed to bulk save grades', error: error.message });
  }
});

// GET /enrollment/:enrollmentId : (verifyToken) get grades for an enrollment
router.get('/enrollment/:enrollmentId', verifyToken, async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findByPk(enrollmentId, {
      include: [
        { model: Student, as: 'student' },
        { model: Batch, as: 'batch', include: [{ model: Course, as: 'course' }] }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found.' });
    }

    const grades = await Grade.findAll({
      where: { enrollment_id: enrollmentId },
      order: [['grade_id', 'ASC']]
    });

    return res.json({
      enrollment,
      grades
    });
  } catch (error) {
    console.error('Error fetching grades for enrollment:', error);
    return res.status(500).json({ message: 'Failed to fetch grades', error: error.message });
  }
});

// GET /batch/:batchId : (verifyToken, authorize('Professor')) get all grades for all enrollments in batch
router.get('/batch/:batchId', verifyToken, authorize('Professor', 'Admin'), async (req, res) => {
  try {
    const { batchId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { batch_id: batchId },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['roll_no', 'name', 'program', 'department', 'semester', 'cgpa']
        },
        {
          model: Grade,
          as: 'grades'
        }
      ],
      order: [['roll_no', 'ASC']]
    });

    return res.json(enrollments);
  } catch (error) {
    console.error('Error fetching batch grades:', error);
    return res.status(500).json({ message: 'Failed to fetch batch grades', error: error.message });
  }
});

module.exports = router;
