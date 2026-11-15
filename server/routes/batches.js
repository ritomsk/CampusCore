const express = require('express');
const router = express.Router();
const { Batch, Course, Professor, Enrollment } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// GET / : (verifyToken) if professor, return their batches; if student, return all active batches; if admin, return all
router.get('/', verifyToken, async (req, res) => {
  try {
    const { role, user_id } = req.user;
    let whereCondition = {};

    if (role === 'Professor') {
      const professor = await Professor.findOne({ where: { user_id } });
      if (!professor) {
        return res.status(404).json({ message: 'Professor profile not found for user.' });
      }
      whereCondition.prof_id = professor.prof_id;
    } else if (role === 'Student') {
      whereCondition.status = 'Active';
    }
    // Admin: whereCondition is empty => return all

    const batches = await Batch.findAll({
      where: whereCondition,
      include: [
        {
          model: Course,
          as: 'course'
        },
        {
          model: Professor,
          as: 'professor',
          attributes: ['prof_id', 'name', 'department', 'office_room']
        }
      ],
      order: [['academic_year', 'DESC'], ['batch_id', 'ASC']]
    });

    return res.json(batches);
  } catch (error) {
    console.error('Error fetching batches:', error);
    return res.status(500).json({ message: 'Failed to fetch batches', error: error.message });
  }
});

/**
 * Generate unique 8-character class code
 * Uses characters that avoid confusion (no 0/O, 1/I, etc.)
 */
function generateClassCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST / : (verifyToken, authorize('Professor')) create batch with new fields
router.post('/', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { 
      course_code, 
      batch_name, 
      section, 
      academic_year, 
      semester, 
      enrollment_mode,
      status 
    } = req.body;

    // Validate required fields
    if (!course_code || !academic_year || !semester) {
      return res.status(400).json({ message: 'course_code, academic_year, and semester are required.' });
    }

    // Check current semester setting and enforce restriction
    const { SystemSettings } = require('../models');
    const currentSemester = await SystemSettings.findByPk('current_semester');
    const currentYear = await SystemSettings.findByPk('current_academic_year');
    
    if (currentSemester && currentYear) {
      if (semester !== currentSemester.setting_value || academic_year !== currentYear.setting_value) {
        return res.status(403).json({ 
          message: `Batches can only be created for the current semester (${currentSemester.setting_value} ${currentYear.setting_value}).`,
          current_semester: currentSemester.setting_value,
          current_year: currentYear.setting_value
        });
      }
    }

    // Validate enrollment_mode if provided
    if (enrollment_mode && !['open', 'request', 'invite_only'].includes(enrollment_mode)) {
      return res.status(400).json({ message: 'enrollment_mode must be open, request, or invite_only.' });
    }

    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    if (!professor) {
      return res.status(404).json({ message: 'Professor profile not found.' });
    }

    const course = await Course.findByPk(course_code);
    if (!course) {
      return res.status(404).json({ message: 'Specified course does not exist.' });
    }

    // Auto-generate batch_id: B-{year}-{courseCode}-{section}
    const cleanCourseCode = course_code.replace(/[^a-zA-Z0-9]/g, '');
    const sectionSuffix = section ? `-${section}` : '';
    let batch_id = `B-${academic_year}-${cleanCourseCode}${sectionSuffix}`;

    // Check if batch_id already exists; if so, append timestamp
    const existing = await Batch.findByPk(batch_id);
    if (existing) {
      batch_id = `${batch_id}-${Date.now().toString().slice(-4)}`;
    }

    // Generate unique class code
    let class_code = generateClassCode();
    let codeExists = await Batch.findOne({ where: { class_code } });
    
    // Regenerate if duplicate (very unlikely but safe)
    while (codeExists) {
      class_code = generateClassCode();
      codeExists = await Batch.findOne({ where: { class_code } });
    }

    // Set default batch name if not provided
    const finalBatchName = batch_name || `${course.title} ${semester} ${academic_year}`;

    const batch = await Batch.create({
      batch_id,
      course_code,
      prof_id: professor.prof_id,
      batch_name: finalBatchName,
      section: section || 'A',
      class_code,
      enrollment_mode: enrollment_mode || 'request',
      academic_year,
      semester,
      status: status || 'Active'
    });

    const fullBatch = await Batch.findByPk(batch.batch_id, {
      include: [
        { model: Course, as: 'course' },
        { model: Professor, as: 'professor' }
      ]
    });

    return res.status(201).json({ 
      message: 'Batch created successfully', 
      batch: fullBatch,
      class_code: class_code // Return class code for easy sharing
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    return res.status(500).json({ message: 'Failed to create batch', error: error.message });
  }
});

// GET /:id : get batch with course, professor, enrollment count
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await Batch.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course'
        },
        {
          model: Professor,
          as: 'professor',
          attributes: ['prof_id', 'name', 'department', 'office_room']
        }
      ]
    });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    const totalEnrollments = await Enrollment.count({ where: { batch_id: id } });
    const approvedEnrollments = await Enrollment.count({ where: { batch_id: id, status: 'Approved' } });

    const batchData = batch.toJSON();
    batchData.enrollment_count = totalEnrollments;
    batchData.approved_enrollment_count = approvedEnrollments;

    return res.json(batchData);
  } catch (error) {
    console.error('Error fetching batch by id:', error);
    return res.status(500).json({ message: 'Failed to fetch batch details', error: error.message });
  }
});

// GET /:id/details : comprehensive batch details with stats
router.get('/:id/details', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { Student, CourseMaterial, Announcement, ClassSession, AttendanceLog } = require('../models');

    const batch = await Batch.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['course_code', 'title', 'credits', 'department']
        },
        {
          model: Professor,
          as: 'professor',
          attributes: ['prof_id', 'name', 'department', 'office_room']
        }
      ]
    });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    // Get enrollments with student details
    const enrollments = await Enrollment.findAll({
      where: { batch_id: id },
      include: [{
        model: Student,
        as: 'student',
        attributes: ['roll_no', 'name', 'program', 'semester', 'cgpa']
      }],
      order: [['status', 'ASC'], ['roll_no', 'ASC']]
    });

    // Separate students by enrollment status
    const approvedStudents = enrollments
      .filter(e => e.status === 'Approved')
      .map(e => ({
        roll_number: e.student.roll_no, // Map roll_no to roll_number for frontend
        name: e.student.name,
        program: e.student.program,
        semester: e.student.semester,
        cgpa: e.student.cgpa,
        enrollment_status: e.status,
        enrolled_at: e.createdAt
      }));

    const pendingEnrollments = enrollments.filter(e => e.status === 'Pending').length;

    // Get batch statistics
    const materialsCount = await CourseMaterial.count({ where: { batch_id: id } });
    const assignmentsCount = await CourseMaterial.count({ 
      where: { batch_id: id, type: 'Assignment' } 
    });
    const announcementsCount = await Announcement.count({ where: { batch_id: id } });
    const sessionsCount = await ClassSession.count({ where: { batch_id: id } });

    // Calculate attendance statistics
    const totalSessions = await ClassSession.count({
      where: { batch_id: id }
    });

    let avgAttendancePercentage = 0;
    if (totalSessions > 0 && approvedStudents.length > 0) {
      // Get all attendance logs for this batch
      const sessions = await ClassSession.findAll({
        where: { batch_id: id },
        attributes: ['session_id']
      });
      const sessionIds = sessions.map(s => s.session_id);

      const attendanceLogs = await AttendanceLog.count({
        where: {
          session_id: sessionIds,
          status: 'Present'
        }
      });

      // Calculate average: (total present) / (total students * total sessions) * 100
      const totalPossibleAttendance = approvedStudents.length * totalSessions;
      avgAttendancePercentage = totalPossibleAttendance > 0 
        ? Math.round((attendanceLogs / totalPossibleAttendance) * 100) 
        : 0;
    }

    // Prepare response
    const batchDetails = {
      batch_id: batch.batch_id,
      batch_name: batch.batch_name,
      section: batch.section,
      class_code: batch.class_code,
      enrollment_mode: batch.enrollment_mode,
      academic_year: batch.academic_year,
      semester: batch.semester,
      status: batch.status,
      course: {
        course_code: batch.course.course_code,
        title: batch.course.title,
        credits: batch.course.credits,
        department: batch.course.department
      },
      professor: {
        prof_id: batch.professor.prof_id,
        name: batch.professor.name,
        department: batch.professor.department,
        office_room: batch.professor.office_room
      },
      teachers: [
        {
          prof_id: batch.professor.prof_id,
          name: batch.professor.name,
          role: 'owner'
        }
      ],
      students: approvedStudents,
      stats: {
        total_students: approvedStudents.length,
        pending_enrollments: pendingEnrollments,
        assignments_count: assignmentsCount,
        materials_count: materialsCount,
        announcements_count: announcementsCount,
        sessions_count: sessionsCount,
        avg_attendance_percentage: avgAttendancePercentage
      }
    };

    return res.json(batchDetails);
  } catch (error) {
    console.error('Error fetching batch details:', error);
    return res.status(500).json({ message: 'Failed to fetch batch details', error: error.message });
  }
});

// DELETE /:batchId : Delete a batch (Professor only - must be owner)
router.delete('/:batchId', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { batchId } = req.params;
    const { user_id } = req.user;

    // Find the batch
    const batch = await Batch.findByPk(batchId, {
      include: [
        {
          model: Professor,
          as: 'professor'
        }
      ]
    });

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    // Verify the professor owns this batch
    const professor = await Professor.findOne({ where: { user_id } });
    if (!professor) {
      return res.status(404).json({ message: 'Professor profile not found.' });
    }

    if (batch.prof_id !== professor.prof_id) {
      return res.status(403).json({ message: 'You can only delete your own batches.' });
    }

    // Delete the batch (enrollments will be cascade deleted if FK is set up)
    await batch.destroy();

    return res.json({ message: 'Batch deleted successfully.' });
  } catch (error) {
    console.error('Error deleting batch:', error);
    return res.status(500).json({ message: 'Failed to delete batch', error: error.message });
  }
});

// GET /:batchId/attendance : Get student attendance for a batch
router.get('/:batchId/attendance', verifyToken, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { Student, ClassSession, AttendanceLog } = require('../models');

    // Get all approved enrollments
    const enrollments = await Enrollment.findAll({
      where: { 
        batch_id: batchId,
        status: 'Approved'
      },
      include: [{
        model: Student,
        as: 'student',
        attributes: ['roll_no', 'name']
      }],
      order: [[{ model: Student, as: 'student' }, 'roll_no', 'ASC']]
    });

    // Get total sessions for this batch
    const sessions = await ClassSession.findAll({
      where: { batch_id: batchId },
      attributes: ['session_id']
    });
    const totalSessions = sessions.length;
    const sessionIds = sessions.map(s => s.session_id);

    // Get attendance data for each student
    const studentAttendanceData = await Promise.all(
      enrollments.map(async (enrollment) => {
        const attendedCount = await AttendanceLog.count({
          where: {
            roll_no: enrollment.student.roll_no,
            session_id: sessionIds,
            status: 'Present'
          }
        });

        const attendancePercentage = totalSessions > 0 
          ? Math.round((attendedCount / totalSessions) * 100) 
          : 0;

        return {
          roll_no: enrollment.student.roll_no,
          name: enrollment.student.name,
          attended: attendedCount,
          total: totalSessions,
          percentage: attendancePercentage
        };
      })
    );

    return res.json(studentAttendanceData);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return res.status(500).json({ message: 'Failed to fetch student attendance', error: error.message });
  }
});

module.exports = router;
