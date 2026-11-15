const express = require('express');
const router = express.Router();
const { Enrollment, Student, Batch, Course, Professor, User } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// POST / : (verifyToken, authorize('Student')) create enrollment request (status=Pending). Check student isn't already enrolled.
router.post('/', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const { batch_id } = req.body;
    if (!batch_id) {
      return res.status(400).json({ message: 'batch_id is required.' });
    }

    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    const existingEnrollment = await Enrollment.findOne({
      where: {
        batch_id,
        roll_no: student.roll_no
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: `Already enrolled or requested with status '${existingEnrollment.status}'.`
      });
    }

    const enrollment = await Enrollment.create({
      batch_id,
      roll_no: student.roll_no,
      status: 'Pending',
      request_date: new Date()
    });

    return res.status(201).json({
      message: 'Enrollment request submitted successfully',
      enrollment
    });
  } catch (error) {
    console.error('Error creating enrollment request:', error);
    return res.status(500).json({ message: 'Failed to submit enrollment request', error: error.message });
  }
});

// POST /join-with-code : (verifyToken, authorize('Student')) join batch using class code
router.post('/join-with-code', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const { class_code } = req.body;

    // Validate input
    if (!class_code) {
      return res.status(400).json({ message: 'class_code is required.' });
    }

    // Find student profile
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    // Find batch by class code
    const batch = await Batch.findOne({ 
      where: { class_code: class_code.toUpperCase() },
      include: [
        { model: Course, as: 'course', attributes: ['title', 'course_code'] },
        { model: Professor, as: 'professor', attributes: ['name'] }
      ]
    });

    if (!batch) {
      return res.status(404).json({ message: 'Invalid class code. No batch found with this code.' });
    }

    // Check if batch is active
    if (batch.status !== 'Active') {
      return res.status(400).json({ message: 'This batch is not currently active.' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        batch_id: batch.batch_id,
        roll_no: student.roll_no
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: `You are already ${existingEnrollment.status.toLowerCase()} in this batch.`,
        enrollment: existingEnrollment
      });
    }

    // Check enrollment mode and create enrollment accordingly
    let enrollmentStatus = 'Pending';
    let message = 'Enrollment request submitted. Waiting for professor approval.';

    if (batch.enrollment_mode === 'open') {
      // Auto-approve for open batches
      enrollmentStatus = 'Approved';
      message = 'Successfully enrolled in the batch!';
    } else if (batch.enrollment_mode === 'invite_only') {
      // Reject direct enrollment for invite-only batches
      return res.status(403).json({
        message: 'This batch is invite-only. You cannot join using a class code. Please contact the professor.',
        batch_info: {
          batch_name: batch.batch_name,
          course: batch.course.title,
          professor: batch.professor.name
        }
      });
    }
    // enrollment_mode === 'request' -> status remains 'Pending'

    // Create enrollment
    const enrollment = await Enrollment.create({
      batch_id: batch.batch_id,
      roll_no: student.roll_no,
      status: enrollmentStatus,
      request_date: new Date()
    });

    return res.status(201).json({
      message,
      enrollment,
      batch_info: {
        batch_id: batch.batch_id,
        batch_name: batch.batch_name,
        course: batch.course.title,
        professor: batch.professor.name,
        enrollment_mode: batch.enrollment_mode
      }
    });
  } catch (error) {
    console.error('Error joining batch with class code:', error);
    return res.status(500).json({ message: 'Failed to join batch', error: error.message });
  }
});

// GET /my : (verifyToken, authorize('Student')) get student's enrollments with batch+course info
router.get('/my', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    const enrollments = await Enrollment.findAll({
      where: { roll_no: student.roll_no },
      include: [
        {
          model: Batch,
          as: 'batch',
          include: [
            { model: Course, as: 'course' },
            {
              model: Professor,
              as: 'professor',
              attributes: ['prof_id', 'name', 'department', 'office_room']
            }
          ]
        }
      ],
      order: [['request_date', 'DESC']]
    });

    return res.json(enrollments);
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    return res.status(500).json({ message: 'Failed to fetch enrollments', error: error.message });
  }
});

// GET /batch/:batchId : (verifyToken, authorize('Professor')) get enrollments for a batch
router.get('/batch/:batchId', verifyToken, authorize('Professor', 'Admin'), async (req, res) => {
  try {
    const { batchId } = req.params;

    const enrollments = await Enrollment.findAll({
      where: { batch_id: batchId },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['roll_no', 'name', 'program', 'department', 'semester', 'cgpa', 'backlogs', 'status']
        }
      ],
      order: [['request_date', 'ASC']]
    });

    return res.json(enrollments);
  } catch (error) {
    console.error('Error fetching batch enrollments:', error);
    return res.status(500).json({ message: 'Failed to fetch batch enrollments', error: error.message });
  }
});

// POST /add-student : (verifyToken, authorize('Professor')) directly add student to batch
router.post('/add-student', verifyToken, authorize('Professor', 'Admin'), async (req, res) => {
  try {
    const { batch_id, identifier } = req.body;

    // Validate input
    if (!batch_id || !identifier) {
      return res.status(400).json({ message: 'batch_id and identifier (roll_no or email) are required.' });
    }

    // Find the batch
    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    // Find student by roll_no or email
    let student;
    
    // Try finding by roll_no first
    student = await Student.findByPk(identifier);
    
    // If not found, try finding by email
    if (!student) {
      const user = await User.findOne({ 
        where: { email: identifier, role: 'Student' }
      });
      
      if (user) {
        student = await Student.findOne({ where: { user_id: user.user_id } });
      }
    }

    if (!student) {
      return res.status(404).json({ 
        message: 'Student not found. Please verify the roll number or email address.' 
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: {
        batch_id,
        roll_no: student.roll_no
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        message: `Student ${student.name} is already enrolled with status: ${existingEnrollment.status}`,
        enrollment: existingEnrollment
      });
    }

    // Create approved enrollment
    const enrollment = await Enrollment.create({
      batch_id,
      roll_no: student.roll_no,
      status: 'Approved',
      request_date: new Date(),
      approved_date: new Date()
    });

    // Fetch complete enrollment data with student info
    const completeEnrollment = await Enrollment.findByPk(enrollment.enrollment_id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['roll_no', 'name', 'program', 'department', 'semester', 'cgpa']
        }
      ]
    });

    return res.status(201).json({
      message: `Student ${student.name} added successfully to the batch`,
      enrollment: completeEnrollment
    });
  } catch (error) {
    console.error('Error adding student to batch:', error);
    return res.status(500).json({ message: 'Failed to add student to batch', error: error.message });
  }
});

// PATCH /:id/approve : (verifyToken, authorize('Professor')) set status='Approved'
router.patch('/:id/approve', verifyToken, authorize('Professor', 'Admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found.' });
    }

    enrollment.status = 'Approved';
    await enrollment.save();

    return res.json({ message: 'Enrollment approved successfully', enrollment });
  } catch (error) {
    console.error('Error approving enrollment:', error);
    return res.status(500).json({ message: 'Failed to approve enrollment', error: error.message });
  }
});

// PATCH /:id/reject : (verifyToken, authorize('Professor')) set status='Rejected'
router.patch('/:id/reject', verifyToken, authorize('Professor', 'Admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment record not found.' });
    }

    enrollment.status = 'Rejected';
    await enrollment.save();

    return res.json({ message: 'Enrollment rejected successfully', enrollment });
  } catch (error) {
    console.error('Error rejecting enrollment:', error);
    return res.status(500).json({ message: 'Failed to reject enrollment', error: error.message });
  }
});

module.exports = router;
