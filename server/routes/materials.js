const express = require('express');
const router = express.Router();
const { CourseMaterial, Batch, Enrollment, Student } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const upload = require('../middleware/upload');

// POST / : (verifyToken, authorize('Professor')) upload material with Multer, save record
router.post('/', verifyToken, authorize('Professor'), upload.single('file'), async (req, res) => {
  try {
    const { batch_id, title, type, description, due_date, total_points, topic } = req.body;

    if (!batch_id || !title || !type) {
      return res.status(400).json({ message: 'batch_id, title, and type are required.' });
    }

    if (!['Note', 'PYQ', 'Assignment'].includes(type)) {
      return res.status(400).json({ message: 'type must be Note, PYQ, or Assignment.' });
    }

    let file_url = req.body.file_url;
    if (req.file) {
      file_url = `/uploads/${req.file.filename}`;
    }

    if (!file_url) {
      return res.status(400).json({ message: 'A file upload or file_url is required.' });
    }

    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    // Parse total_points for assignments
    const pointsValue = type === 'Assignment' && total_points ? parseInt(total_points) : 100;

    const material = await CourseMaterial.create({
      batch_id,
      title,
      type,
      file_url,
      description: description || null,
      due_date: due_date ? new Date(due_date) : null,
      total_points: pointsValue,
      topic: topic || null,
      created_at: new Date()
    });

    return res.status(201).json({ message: 'Course material created successfully', material });
  } catch (error) {
    console.error('Error creating course material:', error);
    return res.status(500).json({ message: 'Failed to upload course material', error: error.message });
  }
});

// GET /batch/:batchId : (verifyToken) list materials for batch with filters and submission counts
router.get('/batch/:batchId', verifyToken, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { type, topic } = req.query;
    const { role, user_id } = req.user;

    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    if (role === 'Student') {
      const student = await Student.findOne({ where: { user_id } });
      if (!student) {
        return res.status(404).json({ message: 'Student profile not found.' });
      }

      const enrollment = await Enrollment.findOne({
        where: {
          batch_id: batchId,
          roll_no: student.roll_no,
          status: 'Approved'
        }
      });

      if (!enrollment) {
        return res.status(403).json({ message: 'Access denied. You do not have approved enrollment in this batch.' });
      }
    }

    // Build where clause with filters
    const whereClause = { batch_id: batchId };
    if (type) {
      whereClause.type = type;
    }
    if (topic) {
      whereClause.topic = topic;
    }

    const materials = await CourseMaterial.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    // For assignments, add submission statistics
    const materialsWithStats = await Promise.all(
      materials.map(async (material) => {
        const materialData = material.toJSON();

        if (material.type === 'Assignment') {
          // Get total submissions
          const { Submission } = require('../models');
          const submissions = await Submission.findAll({
            where: { material_id: material.material_id }
          });

          materialData.submissions_count = submissions.length;
          materialData.graded_count = submissions.filter(s => s.obtained_marks !== null).length;
          materialData.unmarked_count = submissions.filter(s => s.obtained_marks === null).length;

          // Get total enrolled students for completion percentage
          const enrolledCount = await Enrollment.count({
            where: { batch_id: batchId, status: 'Approved' }
          });
          materialData.enrolled_students = enrolledCount;
        }

        return materialData;
      })
    );

    return res.json(materialsWithStats);
  } catch (error) {
    console.error('Error fetching materials:', error);
    return res.status(500).json({ message: 'Failed to fetch course materials', error: error.message });
  }
});

module.exports = router;
