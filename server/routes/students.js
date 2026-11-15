const express = require('express');
const router = express.Router();
const { Student, User, Enrollment, Course, Professor, CourseMaterial, Submission, AttendanceLog, ClassSession, Grade, Batch } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { Op } = require('sequelize');

// ============ GET ALL STUDENTS (Admin only) ============
router.get('/', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: User, attributes: ['email'] },
      ],
      order: [['name', 'ASC']],
    });

    res.json({ students });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

// ============ GET CURRENT STUDENT PROFILE ============
router.get('/me', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { user_id: req.user.user_id },
      include: [
        { 
          model: User,
          as: 'user',
          attributes: ['email'] 
        }
      ]
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    // Get enrolled batches through enrollments
    const enrollments = await Enrollment.findAll({
      where: { 
        roll_no: student.roll_no,
        status: 'Approved'
      },
      include: [{
        model: Batch,
        as: 'batch',
        attributes: ['batch_name', 'academic_year', 'semester']
      }],
      limit: 1
    });

    const responseData = {
      roll_no: student.roll_no,
      name: student.name,
      email: student.user?.email,
      program: student.program,
      department: student.department,
      semester: student.semester,
      cgpa: student.cgpa,
      backlogs: student.backlogs,
      status: student.status,
      batch_name: enrollments[0]?.batch?.batch_name || null,
      academic_year: enrollments[0]?.batch?.academic_year || null
    };

    res.json(responseData);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// ============ UPDATE CURRENT STUDENT PROFILE ============
router.put('/me', verifyToken, authorize('Student'), async (req, res) => {
  try {
    // Students table only has these fields, no phone/address in actual DB
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    // Note: Students table doesn't have editable fields like phone/address
    // This endpoint exists for future extensibility
    res.json({ message: 'Profile viewed successfully', student });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// ============ GET STUDENT DASHBOARD STATS ============
router.get('/me/stats', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    
    const rollNumber = student.roll_no;

    // Get enrolled courses count
    const enrolledCourses = await Enrollment.count({
      where: { roll_no: rollNumber, status: 'Approved' }
    });

    // Calculate overall attendance percentage
    const attendanceRecords = await AttendanceLog.findAll({
      where: { roll_no: rollNumber }
    });
    
    const totalClasses = attendanceRecords.length;
    const presentClasses = attendanceRecords.filter(a => a.status === 'Present').length;
    const attendancePercentage = totalClasses > 0 
      ? Math.round((presentClasses / totalClasses) * 100) 
      : 0;

    // Get assignments due count
    const today = new Date();
    const assignmentsDue = await CourseMaterial.count({
      where: {
        type: 'Assignment',
        due_date: { [Op.gte]: today }
      },
      include: [{
        model: Batch,
        as: 'batch',
        required: true,
        include: [{
          model: Enrollment,
          as: 'enrollments',
          where: { roll_no: rollNumber, status: 'Approved' },
          required: true
        }]
      }]
    });

    const response = {
      cgpa: student?.cgpa || 0,
      enrolledCourses,
      attendancePercentage,
      assignmentsDue
    };

    res.json(response);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
});

// ============ GET UPCOMING DEADLINES ============
router.get('/me/deadlines', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    
    const rollNumber = student.roll_no;
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const materials = await CourseMaterial.findAll({
      where: {
        type: 'Assignment',
        due_date: {
          [Op.between]: [today, nextWeek]
        }
      },
      include: [{
        model: Batch,
        required: true,
        include: [{
          model: Course,
          attributes: ['title', 'course_code']
        }, {
          model: Enrollment,
          where: { roll_no: rollNumber, status: 'Approved' },
          required: true,
          attributes: []
        }]
      }],
      order: [['due_date', 'ASC']],
      limit: 5
    });

    const deadlines = materials.map(m => {
      const daysLeft = Math.ceil((new Date(m.due_date) - today) / (1000 * 60 * 60 * 24));
      return {
        id: m.material_id,
        title: m.title,
        course_name: m.Batch?.Course?.title || 'Unknown',
        due_date: m.due_date,
        days_left: daysLeft
      };
    });

    res.json(deadlines);
  } catch (error) {
    console.error('Get deadlines error:', error);
    res.status(500).json({ error: 'Failed to fetch deadlines.' });
  }
});

// ============ GET RECENT ATTENDANCE ============
router.get('/me/attendance/recent', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    
    const rollNumber = student.roll_no;

    const records = await AttendanceLog.findAll({
      where: { roll_no: rollNumber },
      include: [{
        model: ClassSession,
        as: 'session',
        required: true,
        include: [{
          model: Batch,
          as: 'batch',
          required: true,
          include: [{
            model: Course,
            as: 'course',
            attributes: ['title', 'course_code']
          }]
        }]
      }],
      order: [['log_id', 'DESC']],
      limit: 50
    });

    const recentAttendance = records.map(r => ({
      id: r.log_id,
      course_name: r.session?.batch?.course?.title || 'Unknown',
      course_code: r.session?.batch?.course?.course_code || 'N/A',
      session_date: r.session?.session_date || new Date(),
      topic_covered: r.session?.topic_covered || 'N/A',
      status: r.status.toLowerCase(),
      remarks: null
    }));

    res.json(recentAttendance);
  } catch (error) {
    console.error('Get recent attendance error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch attendance.', details: error.message });
  }
});

// ============ GET ENROLLED COURSES ============
router.get('/me/courses', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    
    const rollNumber = student.roll_no;

    // Get query parameters for filtering
    let { semester, academic_year, status } = req.query;
    
    // If no semester/year provided, get current semester from system settings
    if (!semester || !academic_year) {
      const { SystemSettings } = require('../models');
      const currentSemester = await SystemSettings.findByPk('current_semester');
      const currentYear = await SystemSettings.findByPk('current_academic_year');
      
      if (!semester && currentSemester) {
        semester = currentSemester.setting_value;
      }
      if (!academic_year && currentYear) {
        academic_year = currentYear.setting_value;
      }
    }
    
    // Build batch filter - default to Active batches only
    const batchWhere = {
      status: status || 'Active'
    };
    
    // Apply semester and year filters
    if (semester) {
      batchWhere.semester = semester;
    }
    if (academic_year) {
      batchWhere.academic_year = academic_year;
    }

    const enrollments = await Enrollment.findAll({
      where: { 
        roll_no: rollNumber,
        status: 'Approved' // Only show approved enrollments
      },
      include: [{
        model: Batch,
        as: 'batch',
        where: batchWhere,
        required: true,
        include: [{
          model: Course,
          as: 'course',
          attributes: ['course_code', 'title', 'credits', 'department']
        }, {
          model: Professor,
          as: 'professor',
          attributes: ['name', 'department']
        }]
      }]
    });

    const courses = await Promise.all(enrollments.map(async (e) => {
      // Calculate attendance percentage for this batch
      const attendanceRecords = await AttendanceLog.findAll({
        where: { roll_no: rollNumber },
        include: [{
          model: ClassSession,
          as: 'session',
          where: { batch_id: e.batch_id },
          required: true
        }]
      });

      const total = attendanceRecords.length;
      const present = attendanceRecords.filter(a => a.status === 'Present').length;
      const attendancePercentage = total > 0 ? Math.round((present / total) * 100) : 0;

      return {
        id: e.enrollment_id,
        batch_id: e.batch_id,
        course_name: e.batch?.course?.title || 'Unknown',
        course_code: e.batch?.course?.course_code || 'N/A',
        credits: e.batch?.course?.credits || 0,
        department: e.batch?.course?.department || 'N/A',
        course_name: e.batch?.course?.title || 'Unknown',
        course_code: e.batch?.course?.course_code || 'N/A',
        credits: e.batch?.course?.credits || 0,
        department: e.batch?.course?.department || 'N/A',
        professor_name: e.batch?.professor?.name || 'Unknown',
        attendance_percentage: attendancePercentage,
        status: e.status,
        semester: e.batch?.semester || 'N/A',
        academic_year: e.batch?.academic_year || 'N/A',
        batch_status: e.batch?.status || 'Active'
      };
    }));

    res.json(courses);
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses.' });
  }
});

// ============ GET COURSE DETAILS ============
router.get('/me/courses/:courseId', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    
    const rollNumber = student.roll_no;
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, {
      include: [{
        model: Professor,
        attributes: ['name', 'department', 'email']
      }]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    // Get course materials
    const materials = await CourseMaterial.findAll({
      where: { course_id: courseId },
      order: [['uploaded_at', 'DESC']]
    });

    // Get class sessions
    const sessions = await ClassSession.findAll({
      where: { course_id: courseId },
      order: [['session_date', 'DESC'], ['start_time', 'DESC']]
    });

    // Get attendance records
    const attendanceRecords = await AttendanceLog.findAll({
      where: { roll_number: rollNumber },
      include: [{
        model: ClassSession,
        where: { course_id: courseId },
        required: true
      }]
    });

    const total = attendanceRecords.length;
    const present = attendanceRecords.filter(a => a.status === 'present').length;
    const absent = attendanceRecords.filter(a => a.status === 'absent').length;

    // Get grade
    const gradeRecord = await Grade.findOne({
      where: { roll_number: rollNumber, course_id: courseId }
    });

    res.json({
      course_name: course.course_name,
      course_code: course.course_code,
      credits: course.credits,
      semester: course.semester,
      description: course.description,
      professor_name: course.Professor.name,
      grade: gradeRecord?.grade || null,
      attendance_percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      attendance_stats: { present, absent },
      materials: materials.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type,
        file_url: m.file_url,
        uploaded_at: m.uploaded_at
      })),
      sessions: sessions.map(s => ({
        id: s.id,
        type: s.session_type,
        topic: s.topic,
        session_date: s.session_date,
        start_time: s.start_time,
        end_time: s.end_time,
        status: s.status
      })),
      attendance_records: attendanceRecords.map(r => ({
        id: r.id,
        session_type: r.ClassSession.session_type,
        session_date: r.ClassSession.session_date,
        status: r.status
      }))
    });
  } catch (error) {
    console.error('Get course details error:', error);
    res.status(500).json({ error: 'Failed to fetch course details.' });
  }
});

// ============ GET ASSIGNMENTS ============
router.get('/me/assignments', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    
    const rollNumber = student.roll_no;

    const materials = await CourseMaterial.findAll({
      where: { type: 'Assignment' },
      include: [{
        model: Batch,
        as: 'batch',
        required: true,
        include: [{
          model: Course,
          as: 'course',
          attributes: ['title', 'course_code']
        }, {
          model: Enrollment,
          as: 'enrollments',
          where: { roll_no: rollNumber, status: 'Approved' },
          required: true,
          attributes: []
        }]
      }],
      order: [['due_date', 'DESC']]
    });

    const assignments = await Promise.all(materials.map(async (m) => {
      // Find enrollment to get submission
      const enrollment = await Enrollment.findOne({
        where: {
          batch_id: m.batch_id,
          roll_no: rollNumber
        }
      });

      const submission = enrollment ? await Submission.findOne({
        where: {
          material_id: m.material_id,
          enrollment_id: enrollment.enrollment_id
        }
      }) : null;

      return {
        id: m.material_id,
        material_id: m.material_id,
        title: m.title,
        description: m.description,
        course_name: m.batch?.course?.title || 'Unknown',
        course_code: m.batch?.course?.course_code || 'N/A',
        due_date: m.due_date,
        file_url: m.file_url,
        total_points: m.total_points || 100,
        topic: m.topic,
        submission_status: submission 
          ? (submission.grade_status === 'Graded' ? 'graded' : 'submitted')
          : 'pending',
        submission_date: submission?.submitted_at || null,
        submission_file_url: submission?.file_url || null,
        obtained_marks: submission?.obtained_marks || null,
        graded_at: submission?.graded_at || null,
        feedback: submission?.feedback || null
      };
    }));

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

// ============ GET GRADES ============
router.get('/me/grades', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.user.user_id } });
    
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }
    
    const rollNumber = student.roll_no;

    // Get all enrollments for this student with grades
    const enrollments = await Enrollment.findAll({
      where: { 
        roll_no: rollNumber,
        status: 'Approved'
      },
      include: [
        {
          model: Batch,
          as: 'batch',
          include: [
            {
              model: Course,
              as: 'course',
              attributes: ['course_code', 'title', 'credits']
            },
            {
              model: Professor,
              as: 'professor',
              attributes: ['name', 'prof_id']
            }
          ]
        },
        {
          model: Grade,
          as: 'grades',
          required: false
        }
      ]
    });

    // Flatten grades from enrollments
    const gradeRecords = [];
    enrollments.forEach(enrollment => {
      if (enrollment.grades && enrollment.grades.length > 0) {
        enrollment.grades.forEach(grade => {
          gradeRecords.push({
            id: grade.grade_id,
            enrollment_id: grade.enrollment_id,
            assessment_name: grade.assessment_name,
            score: parseFloat(grade.score),
            max_score: parseFloat(grade.max_score),
            percentage: ((parseFloat(grade.score) / parseFloat(grade.max_score)) * 100).toFixed(2),
            co_mapping: grade.co_mapping,
            course_code: enrollment.batch?.course?.course_code || 'N/A',
            course_name: enrollment.batch?.course?.title || 'Unknown Course',
            professor_name: enrollment.batch?.professor?.name || 'Unknown',
            credits: enrollment.batch?.course?.credits || 0,
            semester: enrollment.batch?.semester || 'N/A'
          });
        });
      }
    });

    const summary = {
      cgpa: parseFloat(student?.cgpa || 0),
      total_credits: enrollments.reduce((sum, e) => sum + (e.batch?.course?.credits || 0), 0),
      courses_completed: enrollments.length,
      total_assessments: gradeRecords.length,
      average_score: gradeRecords.length > 0 
        ? (gradeRecords.reduce((sum, g) => sum + parseFloat(g.percentage), 0) / gradeRecords.length).toFixed(2)
        : 0
    };

    res.json({ grades: gradeRecords, summary });
  } catch (error) {
    console.error('Get grades error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch grades.', details: error.message });
  }
});

// ============ GET STUDENT BY ROLL NO ============
router.get('/:rollNo', verifyToken, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.rollNo, {
      include: [{ model: User, as: 'user', attributes: ['email'] }],
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Failed to fetch student.' });
  }
});

module.exports = router;
