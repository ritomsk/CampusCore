const express = require('express');
const router = express.Router();
const { Professor, User, Course, Batch, Enrollment, ClassSession, CourseMaterial, Submission, Student } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { Op } = require('sequelize');

// ============ GET ALL PROFESSORS ============
router.get('/', verifyToken, async (req, res) => {
  try {
    const professors = await Professor.findAll({
      include: [
        { model: User, as: 'user', attributes: ['email'] },
      ],
      order: [['name', 'ASC']],
    });

    res.json({ professors });
  } catch (error) {
    console.error('Get professors error:', error);
    res.status(500).json({ error: 'Failed to fetch professors.' });
  }
});

// ============ GET CURRENT PROFESSOR PROFILE ============
router.get('/me', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const professor = await Professor.findOne({
      where: { user_id: req.user.user_id },
      include: [
        { model: User, as: 'user', attributes: ['email'] }
      ]
    });

    if (!professor) {
      return res.status(404).json({ error: 'Professor profile not found.' });
    }

    // Get stats
    const batches = await Batch.findAll({
      where: { prof_id: professor.prof_id },
      attributes: ['batch_id']
    });
    const batchIds = batches.map(b => b.batch_id);
    
    const totalStudents = batchIds.length > 0 ? await Enrollment.count({
      where: {
        batch_id: { [Op.in]: batchIds },
        status: 'Approved'
      }
    }) : 0;

    const assignmentsCreated = batchIds.length > 0 ? await CourseMaterial.count({
      where: {
        batch_id: { [Op.in]: batchIds },
        type: 'Assignment'
      }
    }) : 0;

    res.json({
      ...professor.toJSON(),
      active_batches: batches.length,
      total_students: totalStudents,
      courses_taught: batches.length,
      assignments_created: assignmentsCreated,
      email: professor.user?.email
    });
  } catch (error) {
    console.error('Get professor profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// ============ UPDATE CURRENT PROFESSOR PROFILE ============
router.put('/me', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    // Professors table only has: prof_id, user_id, name, department, office_room
    // No phone, designation, or office_location fields exist in actual DB
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });

    if (!professor) {
      return res.status(404).json({ error: 'Professor profile not found.' });
    }

    // Note: Professors table doesn't have many editable fields
    // This endpoint exists for future extensibility
    res.json({ message: 'Profile viewed successfully', professor });
  } catch (error) {
    console.error('Update professor profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ============ GET CURRENT PROFESSOR STATS ============
router.get('/me/stats', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    
    if (!professor) {
      return res.status(404).json({ error: 'Professor profile not found.' });
    }
    
    const profId = professor.prof_id;

    // Get active batches count
    const activeBatches = await Batch.count({
      where: { prof_id: profId }
    });

    // Get total students across all batches
    const batches = await Batch.findAll({
      where: { prof_id: profId },
      attributes: ['batch_id']
    });
    const batchIds = batches.map(b => b.batch_id);
    
    const totalStudents = await Enrollment.count({
      where: {
        batch_id: { [Op.in]: batchIds },
        status: 'Approved'
      }
    });

    // Get pending enrollments count
    const pendingEnrollments = await Enrollment.count({
      where: {
        batch_id: { [Op.in]: batchIds },
        status: 'Pending'
      }
    });

    // Get assignments to grade (submissions without marks)
    const materials = await CourseMaterial.findAll({
      where: { type: 'Assignment' },
      include: [{
        model: Batch,
        as: 'batch',
        where: { prof_id: profId },
        attributes: []
      }],
      attributes: ['material_id']
    });
    const materialIds = materials.map(m => m.material_id);
    
    const assignmentsToGrade = await Submission.count({
      where: {
        material_id: { [Op.in]: materialIds },
        obtained_marks: null
      }
    });

    // Get batch overview
    const batchOverview = await Batch.findAll({
      where: { prof_id: profId },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['title', 'course_code']
      }],
      attributes: ['batch_id', 'academic_year', 'semester']
    });

    const batchOverviewWithCounts = await Promise.all(
      batchOverview.map(async (batch) => {
        const studentCount = await Enrollment.count({
          where: { batch_id: batch.batch_id, status: 'Approved' }
        });
        return {
          batch_id: batch.batch_id,
          course_name: batch.course?.title || 'Unknown',
          course_code: batch.course?.course_code || 'N/A',
          semester: `Sem ${batch.semester}`,
          student_count: studentCount
        };
      })
    );

    res.json({
      activeBatches,
      totalStudents,
      pendingEnrollments,
      assignmentsToGrade,
      batchOverview: batchOverviewWithCounts
    });
  } catch (error) {
    console.error('Get professor stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// ============ GET RECENT ACTIVITY ============
router.get('/me/activity', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    
    if (!professor) {
      return res.status(404).json({ error: 'Professor profile not found.' });
    }
    
    const profId = professor.prof_id;
    const activities = [];

    // Get recent enrollments
    const recentEnrollments = await Enrollment.findAll({
      include: [{
        model: Batch,
        as: 'batch',
        where: { prof_id: profId },
        include: [{
          model: Course,
          as: 'course',
          attributes: ['title']
        }]
      }, {
        model: Student,
        as: 'student',
        attributes: ['name']
      }],
      order: [['request_date', 'DESC']],
      limit: 5
    });

    recentEnrollments.forEach(e => {
      activities.push({
        type: 'enrollment',
        title: 'New Enrollment Request',
        description: `${e.student?.name || 'Unknown'} requested enrollment in ${e.batch?.course?.title || 'Unknown'}`,
        time_ago: getTimeAgo(e.request_date)
      });
    });

    res.json(activities.slice(0, 10));
  } catch (error) {
    console.error('Get activity error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch activity.', details: error.message });
  }
});

// ============ GET UPCOMING SESSIONS ============
router.get('/me/sessions/upcoming', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    
    if (!professor) {
      return res.status(404).json({ error: 'Professor profile not found.' });
    }
    
    const profId = professor.prof_id;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const sessions = await ClassSession.findAll({
      where: {
        session_date: {
          [Op.between]: [today, nextWeek]
        }
      },
      include: [{
        model: Batch,
        as: 'batch',
        where: { prof_id: profId },
        include: [{
          model: Course,
          as: 'course',
          attributes: ['title', 'course_code']
        }]
      }],
      order: [['session_date', 'ASC']],
      limit: 5
    });

    const formattedSessions = sessions.map(s => ({
      id: s.session_id,
      course_name: s.batch?.course?.title || 'Unknown',
      course_code: s.batch?.course?.course_code || 'N/A',
      topic_covered: s.topic_covered,
      session_date: s.session_date
    }));

    res.json(formattedSessions);
  } catch (error) {
    console.error('Get upcoming sessions error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch sessions.', details: error.message });
  }
});

// ============ GET PROFESSOR BATCHES ============
router.get('/me/batches', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { semester, academic_year } = req.query;
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    
    if (!professor) {
      return res.status(404).json({ error: 'Professor profile not found.' });
    }
    
    const profId = professor.prof_id;

    // Build where clause with optional filters
    const whereClause = { prof_id: profId };
    if (semester) {
      whereClause.semester = semester;
    }
    if (academic_year) {
      whereClause.academic_year = academic_year;
    }

    const batches = await Batch.findAll({
      where: whereClause,
      include: [{
        model: Course,
        as: 'course',
        attributes: ['title', 'course_code']
      }],
      order: [['academic_year', 'DESC'], ['semester', 'DESC']]
    });

    const batchesWithCounts = await Promise.all(
      batches.map(async (batch) => {
        const enrolledCount = await Enrollment.count({
          where: { batch_id: batch.batch_id, status: 'Approved' }
        });
        const pendingCount = await Enrollment.count({
          where: { batch_id: batch.batch_id, status: 'Pending' }
        });
        const materialsCount = await CourseMaterial.count({
          where: { batch_id: batch.batch_id }
        });
        const sessionsCount = await ClassSession.count({
          where: { batch_id: batch.batch_id }
        });

        return {
          batch_id: batch.batch_id,
          batch_name: batch.batch_name,
          section: batch.section,
          class_code: batch.class_code,
          enrollment_mode: batch.enrollment_mode,
          course_id: batch.course_code,
          course_name: batch.course?.title || 'Unknown',
          course_code: batch.course?.course_code || 'N/A',
          academic_year: batch.academic_year,
          semester: batch.semester,
          enrolled_count: enrolledCount,
          pending_count: pendingCount,
          materials_count: materialsCount,
          sessions_count: sessionsCount
        };
      })
    );

    res.json(batchesWithCounts);
  } catch (error) {
    console.error('Get batches error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch batches.', details: error.message });
  }
});

// ============ GET PROFESSOR BY ID ============
router.get('/:profId', verifyToken, async (req, res) => {
  try {
    const professor = await Professor.findByPk(req.params.profId, {
      include: [{ model: User, as: 'user', attributes: ['email'] }],
    });

    if (!professor) {
      return res.status(404).json({ error: 'Professor not found.' });
    }

    res.json({ professor });
  } catch (error) {
    console.error('Get professor error:', error);
    res.status(500).json({ error: 'Failed to fetch professor.' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

module.exports = router;
