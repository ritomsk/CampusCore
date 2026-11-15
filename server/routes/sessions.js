const express = require('express');
const router = express.Router();
const { ClassSession, Batch, AttendanceLog } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// POST / : (verifyToken, authorize('Professor')) create class session
router.post('/', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    // The database only has: batch_id, session_date, topic_covered
    // Ignore any extra fields like start_time, end_time, session_type
    const { batch_id, session_date, topic, topic_covered } = req.body;

    // Use 'topic' or 'topic_covered' (frontend might send either)
    const finalTopic = topic_covered || topic || 'Class Session';

    if (!batch_id || !session_date) {
      return res.status(400).json({ message: 'batch_id and session_date are required.' });
    }

    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    const session = await ClassSession.create({
      batch_id,
      session_date,
      topic_covered: finalTopic
    });

    return res.status(201).json({ message: 'Class session created successfully', session });
  } catch (error) {
    console.error('Error creating class session:', error);
    return res.status(500).json({ message: 'Failed to create class session', error: error.message });
  }
});

// GET /batch/:batchId : (verifyToken) list sessions for batch
router.get('/batch/:batchId', verifyToken, async (req, res) => {
  try {
    const { batchId } = req.params;

    const sessions = await ClassSession.findAll({
      where: { batch_id: batchId },
      order: [['session_date', 'DESC'], ['session_id', 'DESC']]
    });

    return res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return res.status(500).json({ message: 'Failed to fetch sessions', error: error.message });
  }
});

module.exports = router;
