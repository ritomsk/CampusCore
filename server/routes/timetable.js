const express = require('express');
const router = express.Router();
const { TimetableSlot, Batch, Course, Professor, Enrollment } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const { Op } = require('sequelize');

// ============ CREATE TIMETABLE SLOT ============
// POST /api/timetable/slots
router.post('/slots', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const { course_code, day_of_week, room_number, slot_type } = req.body;

    if (!course_code || !day_of_week) {
      return res.status(400).json({ message: 'course_code and day_of_week are required.' });
    }

    // Check if course exists
    const course = await Course.findByPk(course_code);
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Create slot
    const slot = await TimetableSlot.create({
      course_code,
      day_of_week,
      room_number: room_number || null,
      slot_type: slot_type || 'Lecture',
      is_active: true
    });

    res.status(201).json({
      message: 'Timetable slot created successfully',
      slot
    });
  } catch (error) {
    console.error('Error creating timetable slot:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'This course already has a class scheduled on this day.' 
      });
    }
    res.status(500).json({ 
      message: 'Failed to create timetable slot', 
      error: error.message 
    });
  }
});

// ============ BULK UPDATE TIMETABLE FOR COURSE ============
// POST /api/timetable/course/:courseCode/bulk
router.post('/course/:courseCode/bulk', verifyToken, authorize('Admin'), async (req, res) => {
  const transaction = await TimetableSlot.sequelize.transaction();
  
  try {
    const { courseCode } = req.params;
    const { days } = req.body; // Array of { day_of_week, room_number, slot_type }

    if (!Array.isArray(days)) {
      return res.status(400).json({ message: 'days must be an array.' });
    }

    // Check if course exists
    const course = await Course.findByPk(courseCode);
    if (!course) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Delete existing slots for this course
    await TimetableSlot.destroy({
      where: { course_code: courseCode },
      transaction
    });

    // Insert new slots
    if (days.length > 0) {
      const slotsToCreate = days.map(day => ({
        course_code: courseCode,
        day_of_week: day.day_of_week,
        room_number: day.room_number || null,
        slot_type: day.slot_type || 'Lecture',
        is_active: true
      }));

      await TimetableSlot.bulkCreate(slotsToCreate, { transaction });
    }

    await transaction.commit();

    res.json({
      message: 'Timetable updated successfully',
      count: days.length
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error bulk updating timetable:', error);
    res.status(500).json({ 
      message: 'Failed to update timetable', 
      error: error.message 
    });
  }
});

// ============ GET TIMETABLE SLOTS FOR COURSE ============
// GET /api/timetable/course/:courseCode
router.get('/course/:courseCode', verifyToken, async (req, res) => {
  try {
    const { courseCode } = req.params;

    const slots = await TimetableSlot.findAll({
      where: { 
        course_code: courseCode,
        is_active: true 
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['course_code', 'title', 'department', 'credits']
        }
      ],
      order: [
        [
          TimetableSlot.sequelize.literal(
            `FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')`
          )
        ]
      ]
    });

    // Format response
    const formattedSlots = slots.map(slot => ({
      slot_id: slot.slot_id,
      course_code: slot.course_code,
      day_of_week: slot.day_of_week,
      room_number: slot.room_number,
      slot_type: slot.slot_type,
      course_name: slot.course?.title,
      department: slot.course?.department
    }));

    res.json(formattedSlots);
  } catch (error) {
    console.error('Error fetching timetable slots:', error);
    res.status(500).json({ 
      message: 'Failed to fetch timetable slots', 
      error: error.message 
    });
  }
});

// ============ DELETE TIMETABLE SLOT ============
// DELETE /api/timetable/slots/:slotId
router.delete('/slots/:slotId', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const { slotId } = req.params;

    const slot = await TimetableSlot.findByPk(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Timetable slot not found.' });
    }

    await slot.destroy();

    res.json({ message: 'Timetable slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting timetable slot:', error);
    res.status(500).json({ 
      message: 'Failed to delete timetable slot', 
      error: error.message 
    });
  }
});

// ============ DELETE ALL SLOTS FOR COURSE ============
// DELETE /api/timetable/course/:courseCode
router.delete('/course/:courseCode', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const { courseCode } = req.params;

    const deletedCount = await TimetableSlot.destroy({
      where: { course_code: courseCode }
    });

    res.json({ 
      message: 'Timetable slots deleted successfully',
      count: deletedCount
    });
  } catch (error) {
    console.error('Error deleting timetable slots:', error);
    res.status(500).json({ 
      message: 'Failed to delete timetable slots', 
      error: error.message 
    });
  }
});

// ============ GET UPCOMING SESSIONS FOR PROFESSOR ============
// GET /api/timetable/professor/upcoming
router.get('/professor/upcoming', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { user_id } = req.user;

    // Get professor
    const professor = await Professor.findOne({ where: { user_id } });
    if (!professor) {
      return res.status(404).json({ message: 'Professor profile not found.' });
    }

    // Get professor's batches
    const batches = await Batch.findAll({
      where: { 
        prof_id: professor.prof_id,
        status: 'Active'
      },
      include: [
        { 
          model: Course, 
          as: 'course',
          include: [{
            model: TimetableSlot,
            as: 'timetableSlots',
            where: { is_active: true },
            required: false
          }]
        }
      ]
    });

    const today = new Date();
    const sessionsMap = {};

    // For next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateStr = date.toISOString().split('T')[0];

      sessionsMap[dateStr] = {
        date: dateStr,
        day: dayName,
        sessions: []
      };

      // Find batches whose course meets on this day
      for (const batch of batches) {
        if (!batch.course || !batch.course.timetableSlots) continue;
        
        const daySlot = batch.course.timetableSlots.find(s => s.day_of_week === dayName);

        if (daySlot) {
          // Get enrolled count
          const enrolledCount = await Enrollment.count({
            where: { 
              batch_id: batch.batch_id,
              status: 'Approved'
            }
          });

          sessionsMap[dateStr].sessions.push({
            batch_id: batch.batch_id,
            batch_name: batch.batch_name,
            course_code: batch.course_code,
            course_name: batch.course.title,
            section: batch.section,
            room_number: daySlot.room_number,
            slot_type: daySlot.slot_type,
            enrolled_students: enrolledCount
          });
        }
      }
    }

    // Convert to array and filter out days with no classes
    const sessions = Object.values(sessionsMap).filter(day => day.sessions.length > 0);

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    res.status(500).json({ 
      message: 'Failed to fetch upcoming sessions', 
      error: error.message 
    });
  }
});

// ============ GET PROFESSOR FULL TIMETABLE ============
// GET /api/timetable/professor/full
router.get('/professor/full', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { user_id } = req.user;

    // Get professor
    const professor = await Professor.findOne({ where: { user_id } });
    if (!professor) {
      return res.status(404).json({ message: 'Professor profile not found.' });
    }

    // Get professor's batches with course timetable slots
    const batches = await Batch.findAll({
      where: { 
        prof_id: professor.prof_id,
        status: 'Active'
      },
      include: [
        { 
          model: Course, 
          as: 'course',
          include: [{
            model: TimetableSlot,
            as: 'timetableSlots',
            where: { is_active: true },
            required: false
          }]
        }
      ]
    });

    // Organize by day of week
    const timetable = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    batches.forEach(batch => {
      if (!batch.course || !batch.course.timetableSlots) return;
      
      batch.course.timetableSlots.forEach(slot => {
        timetable[slot.day_of_week].push({
          batch_id: batch.batch_id,
          batch_name: batch.batch_name,
          course_code: batch.course_code,
          course_name: batch.course.title,
          section: batch.section,
          room_number: slot.room_number,
          slot_type: slot.slot_type
        });
      });
    });

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching professor timetable:', error);
    res.status(500).json({ 
      message: 'Failed to fetch professor timetable', 
      error: error.message 
    });
  }
});

// ============ GET STUDENT TIMETABLE ============
// GET /api/timetable/student
router.get('/student', verifyToken, authorize('Student'), async (req, res) => {
  try {
    const { user_id } = req.user;

    // Get student
    const { Student } = require('../models');
    const student = await Student.findOne({ where: { user_id } });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found.' });
    }

    // Get enrolled batches with course timetable slots
    const enrollments = await Enrollment.findAll({
      where: { 
        roll_no: student.roll_no,
        status: 'Approved'
      },
      include: [
        {
          model: Batch,
          as: 'batch',
          where: { status: 'Active' },
          include: [
            { 
              model: Course, 
              as: 'course',
              include: [{
                model: TimetableSlot,
                as: 'timetableSlots',
                where: { is_active: true },
                required: false
              }]
            },
            { model: Professor, as: 'professor' }
          ]
        }
      ]
    });

    // Organize by day of week
    const timetable = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    enrollments.forEach(enrollment => {
      const batch = enrollment.batch;
      if (!batch.course || !batch.course.timetableSlots) return;

      batch.course.timetableSlots.forEach(slot => {
        timetable[slot.day_of_week].push({
          batch_id: batch.batch_id,
          course_code: batch.course_code,
          course_name: batch.course.title,
          professor_name: batch.professor.name,
          room_number: slot.room_number,
          slot_type: slot.slot_type,
          section: batch.section
        });
      });
    });

    res.json(timetable);
  } catch (error) {
    console.error('Error fetching student timetable:', error);
    res.status(500).json({ 
      message: 'Failed to fetch student timetable', 
      error: error.message 
    });
  }
});

module.exports = router;
