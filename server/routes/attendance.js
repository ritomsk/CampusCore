const express = require('express');
const router = express.Router();
const { AttendanceLog, ClassSession, Batch, Course, Student } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// POST /bulk : (verifyToken, authorize('Professor')) accept array of {roll_no, status} + session_id, bulk create attendance logs
router.post('/bulk', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { session_id, records, attendance } = req.body;

    let logsToProcess = [];
    let targetSessionId = session_id;

    // Handle different payload formats from frontend
    if (Array.isArray(records) && targetSessionId) {
      logsToProcess = records.map((r) => ({
        session_id: targetSessionId,
        roll_no: r.roll_no || r.roll_number,
        status: capitalizeFirst(r.status) || 'Present'
      }));
    } else if (Array.isArray(attendance) && targetSessionId) {
      // Alternative format: { session_id, attendance: [{roll_number, status}] }
      logsToProcess = attendance.map((r) => ({
        session_id: targetSessionId,
        roll_no: r.roll_no || r.roll_number,
        status: capitalizeFirst(r.status) || 'Present'
      }));
    } else if (Array.isArray(req.body)) {
      logsToProcess = req.body;
      if (logsToProcess.length > 0) {
        targetSessionId = logsToProcess[0].session_id;
      }
    }

    if (!targetSessionId || logsToProcess.length === 0) {
      return res.status(400).json({
        message: 'Invalid payload. Provide session_id and records array of {roll_no, status}.'
      });
    }

    const session = await ClassSession.findByPk(targetSessionId);
    if (!session) {
      return res.status(404).json({ message: 'Class session not found.' });
    }

    // Replace existing attendance logs for this session to allow re-marking
    await AttendanceLog.destroy({ where: { session_id: targetSessionId } });

    const createdLogs = await AttendanceLog.bulkCreate(logsToProcess);

    return res.status(201).json({
      message: `Successfully recorded attendance for ${createdLogs.length} students.`,
      count: createdLogs.length,
      logs: createdLogs
    });
  } catch (error) {
    console.error('Error saving bulk attendance:', error);
    return res.status(500).json({ message: 'Failed to record attendance', error: error.message });
  }
});

// Helper function to capitalize first letter (Present, Absent)
function capitalizeFirst(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// GET /student/:rollNo : (verifyToken) get attendance summary for student across all batches
router.get('/student/:rollNo', verifyToken, async (req, res) => {
  try {
    const { rollNo } = req.params;

    const student = await Student.findByPk(rollNo);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const logs = await AttendanceLog.findAll({
      where: { roll_no: rollNo },
      include: [
        {
          model: ClassSession,
          as: 'session',
          include: [
            {
              model: Batch,
              as: 'batch',
              include: [{ model: Course, as: 'course' }]
            }
          ]
        }
      ],
      order: [[{ model: ClassSession, as: 'session' }, 'session_date', 'DESC']]
    });

    const totalSessions = logs.length;
    const presentCount = logs.filter((l) => l.status === 'Present').length;
    const absentCount = logs.filter((l) => l.status === 'Absent').length;

    const effectivePresent = presentCount + lateCount;
    const overallPercentage = totalSessions > 0
      ? Number(((effectivePresent / totalSessions) * 100).toFixed(2))
      : 100;

    // Batch-wise breakdown
    const batchMap = {};
    logs.forEach((log) => {
      const batch = log.session?.batch;
      const batchId = batch ? batch.batch_id : 'Unknown';
      const courseTitle = batch?.course?.title || 'Unknown Course';
      const courseCode = batch?.course_code || 'Unknown';

      if (!batchMap[batchId]) {
        batchMap[batchId] = {
          batch_id: batchId,
          course_code: courseCode,
          course_title: courseTitle,
          total: 0,
          present: 0,
          absent: 0
        };
      }

      batchMap[batchId].total += 1;
      if (log.status === 'Present') batchMap[batchId].present += 1;
      else if (log.status === 'Absent') batchMap[batchId].absent += 1;
    });

    const batchBreakdown = Object.values(batchMap).map((b) => ({
      ...b,
      percentage: b.total > 0
        ? Number(((b.present / b.total) * 100).toFixed(2))
        : 100
    }));

    return res.json({
      roll_no: rollNo,
      summary: {
        total_sessions: totalSessions,
        present: presentCount,
        absent: absentCount,
        overall_percentage: overallPercentage
      },
      batches: batchBreakdown,
      logs
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    return res.status(500).json({ message: 'Failed to fetch student attendance', error: error.message });
  }
});

// GET /session/:sessionId : (verifyToken, authorize('Professor')) get attendance for a session
router.get('/session/:sessionId', verifyToken, authorize('Professor', 'Admin'), async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ClassSession.findByPk(sessionId, {
      include: [{ model: Batch, as: 'batch', include: [{ model: Course, as: 'course' }] }]
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const logs = await AttendanceLog.findAll({
      where: { session_id: sessionId },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['roll_no', 'name', 'program', 'department', 'semester']
        }
      ],
      order: [['roll_no', 'ASC']]
    });

    return res.json({
      session,
      logs
    });
  } catch (error) {
    console.error('Error fetching session attendance:', error);
    return res.status(500).json({ message: 'Failed to fetch session attendance', error: error.message });
  }
});

module.exports = router;
