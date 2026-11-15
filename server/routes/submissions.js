const express = require('express');
const router = express.Router();
const { Submission, CourseMaterial, Enrollment, Student, Batch, Course } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const upload = require('../middleware/upload');

// POST / : (verifyToken, authorize('Student')) upload submission with Multer, verify enrollment is approved, check material exists
router.post('/', verifyToken, authorize('Student'), upload.single('file'), async (req, res) => {
  try {
    const { material_id } = req.body;

    if (!material_id) {
      return res.status(400).json({ message: 'material_id is required.' });
    }

    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const material = await CourseMaterial.findByPk(material_id);
    if (!material) {
      return res.status(404).json({ message: 'Course material not found.' });
    }

    const enrollment = await Enrollment.findOne({
      where: {
        batch_id: material.batch_id,
        roll_no: student.roll_no,
        status: 'Approved'
      }
    });

    if (!enrollment) {
      return res.status(403).json({
        message: 'Access denied. You do not have approved enrollment in the batch for this material.'
      });
    }

    let file_url = req.body.file_url;
    if (req.file) {
      file_url = `/uploads/${req.file.filename}`;
    }

    if (!file_url) {
      return res.status(400).json({ message: 'A file upload or file_url is required.' });
    }

    const submission = await Submission.create({
      material_id: material.material_id,
      enrollment_id: enrollment.enrollment_id,
      file_url,
      submitted_at: new Date(),
      grade_status: 'Pending'
    });

    return res.status(201).json({ message: 'Assignment submitted successfully', submission });
  } catch (error) {
    console.error('Error uploading submission:', error);
    return res.status(500).json({ message: 'Failed to upload submission', error: error.message });
  }
});

// GET /material/:materialId : (verifyToken, authorize('Professor')) list submissions for a material with student info
router.get('/material/:materialId', verifyToken, authorize('Professor', 'Admin'), async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await CourseMaterial.findByPk(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Course material not found.' });
    }

    const submissions = await Submission.findAll({
      where: { material_id: materialId },
      include: [
        {
          model: Enrollment,
          as: 'enrollment',
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['roll_no', 'name', 'program', 'department', 'semester', 'cgpa']
            }
          ]
        }
      ],
      order: [['submitted_at', 'DESC']]
    });

    return res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions for material:', error);
    return res.status(500).json({ message: 'Failed to fetch submissions', error: error.message });
  }
});

// GET /my : (verifyToken, authorize('Student')) get student's submissions
router.get('/my', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const enrollments = await Enrollment.findAll({
      where: { roll_no: student.roll_no },
      attributes: ['enrollment_id']
    });

    const enrollmentIds = enrollments.map((e) => e.enrollment_id);

    const submissions = await Submission.findAll({
      where: {
        enrollment_id: enrollmentIds
      },
      include: [
        {
          model: CourseMaterial,
          as: 'material',
          include: [
            {
              model: Batch,
              as: 'batch',
              include: [{ model: Course, as: 'course' }]
            }
          ]
        }
      ],
      order: [['submitted_at', 'DESC']]
    });

    return res.json(submissions);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    return res.status(500).json({ message: 'Failed to fetch your submissions', error: error.message });
  }
});

// GET /assignment/:materialId : (verifyToken, authorize('Professor')) get all submissions for an assignment with details
router.get('/assignment/:materialId', verifyToken, authorize('Professor', 'Admin'), async (req, res) => {
  try {
    const { materialId } = req.params;
    const { Professor } = require('../models');

    const material = await CourseMaterial.findByPk(materialId, {
      include: [{
        model: Batch,
        as: 'batch',
        include: [{ model: Course, as: 'course' }]
      }]
    });

    if (!material) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    // Verify professor owns the batch (unless admin)
    if (req.user.role === 'Professor') {
      const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
      if (!professor || material.batch.prof_id !== professor.prof_id) {
        return res.status(403).json({ message: 'You do not have permission to access this assignment.' });
      }
    }

    // Get all submissions for this assignment
    const submissions = await Submission.findAll({
      where: { material_id: materialId },
      include: [{
        model: Enrollment,
        as: 'enrollment',
        include: [{
          model: Student,
          as: 'student',
          attributes: ['roll_no', 'name', 'program', 'semester']
        }]
      }],
      order: [['submitted_at', 'ASC']]
    });

    // Format response with grading status
    const formattedSubmissions = submissions.map(sub => ({
      submission_id: sub.submission_id,
      roll_no: sub.enrollment.student.roll_no,
      student_name: sub.enrollment.student.name,
      program: sub.enrollment.student.program,
      file_url: sub.file_url,
      submitted_at: sub.submitted_at,
      obtained_marks: sub.obtained_marks,
      total_points: material.total_points,
      graded_at: sub.graded_at,
      graded_by: sub.graded_by,
      feedback: sub.feedback,
      status: sub.obtained_marks !== null ? 'marked' : 'unmarked'
    }));

    return res.json({
      assignment: {
        material_id: material.material_id,
        title: material.title,
        total_points: material.total_points,
        due_date: material.due_date,
        batch_name: material.batch.batch_name,
        course_title: material.batch.course.title
      },
      submissions: formattedSubmissions,
      stats: {
        total_submissions: formattedSubmissions.length,
        marked: formattedSubmissions.filter(s => s.status === 'marked').length,
        unmarked: formattedSubmissions.filter(s => s.status === 'unmarked').length
      }
    });
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    return res.status(500).json({ message: 'Failed to fetch assignment submissions', error: error.message });
  }
});

// PATCH /:id/grade : (verifyToken, authorize('Professor')) grade a submission
router.patch('/:id/grade', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { id } = req.params;
    const { obtained_marks, feedback } = req.body;
    const { Professor } = require('../models');

    // Validate obtained_marks
    if (obtained_marks === undefined || obtained_marks === null) {
      return res.status(400).json({ message: 'obtained_marks is required.' });
    }

    const marksValue = parseFloat(obtained_marks);
    if (isNaN(marksValue) || marksValue < 0) {
      return res.status(400).json({ message: 'obtained_marks must be a non-negative number.' });
    }

    // Get professor profile
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    if (!professor) {
      return res.status(404).json({ message: 'Professor profile not found.' });
    }

    // Find submission
    const submission = await Submission.findByPk(id, {
      include: [{
        model: CourseMaterial,
        as: 'material',
        include: [{
          model: Batch,
          as: 'batch'
        }]
      }]
    });

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found.' });
    }

    // Verify professor owns the batch
    if (submission.material.batch.prof_id !== professor.prof_id) {
      return res.status(403).json({ message: 'You can only grade submissions for your own batches.' });
    }

    // Validate marks don't exceed total_points
    if (marksValue > submission.material.total_points) {
      return res.status(400).json({
        message: `Obtained marks (${marksValue}) cannot exceed total points (${submission.material.total_points}).`
      });
    }

    // Update submission with grading info
    await submission.update({
      obtained_marks: marksValue,
      graded_at: new Date(),
      graded_by: professor.prof_id,
      feedback: feedback || null,
      grade_status: 'Graded'
    });

    const updatedSubmission = await Submission.findByPk(id, {
      include: [{
        model: Enrollment,
        as: 'enrollment',
        include: [{
          model: Student,
          as: 'student',
          attributes: ['roll_no', 'name']
        }]
      }]
    });

    return res.json({
      message: 'Submission graded successfully',
      submission: updatedSubmission
    });
  } catch (error) {
    console.error('Error grading submission:', error);
    return res.status(500).json({ message: 'Failed to grade submission', error: error.message });
  }
});

module.exports = router;
