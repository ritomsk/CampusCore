const express = require('express');
const router = express.Router();
const { Announcement, Batch, Professor, Enrollment, Student } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');
const upload = require('../middleware/upload');

// ============================================
// POST / : Create announcement (Professor only)
// ============================================
router.post('/', verifyToken, authorize('Professor'), upload.single('attachment'), async (req, res) => {
  try {
    const { batch_id, title, content, priority } = req.body;

    // Validate required fields
    if (!batch_id || !title || !content) {
      return res.status(400).json({ message: 'batch_id, title, and content are required.' });
    }

    // Validate priority if provided
    if (priority && !['normal', 'important', 'urgent'].includes(priority)) {
      return res.status(400).json({ message: 'priority must be normal, important, or urgent.' });
    }

    // Get professor profile
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    if (!professor) {
      return res.status(404).json({ message: 'Professor profile not found.' });
    }

    // Verify batch exists and professor owns it
    const batch = await Batch.findByPk(batch_id);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    if (batch.prof_id !== professor.prof_id) {
      return res.status(403).json({ message: 'You do not have permission to post announcements in this batch.' });
    }

    // Handle file attachment if provided
    let attachment_url = null;
    if (req.file) {
      attachment_url = `/uploads/${req.file.filename}`;
    }

    // Create announcement
    const announcement = await Announcement.create({
      batch_id,
      prof_id: professor.prof_id,
      title,
      content,
      attachment_url,
      priority: priority || 'normal',
      created_at: new Date()
    });

    // Return with professor details
    const fullAnnouncement = await Announcement.findByPk(announcement.announcement_id, {
      include: [{
        model: Professor,
        as: 'professor',
        attributes: ['prof_id', 'name', 'department']
      }]
    });

    return res.status(201).json({
      message: 'Announcement created successfully',
      announcement: fullAnnouncement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return res.status(500).json({ message: 'Failed to create announcement', error: error.message });
  }
});

// ============================================
// GET /batch/:batchId : Get all announcements for a batch
// ============================================
router.get('/batch/:batchId', verifyToken, async (req, res) => {
  try {
    const { batchId } = req.params;
    const { role, user_id } = req.user;

    // Verify batch exists
    const batch = await Batch.findByPk(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Batch not found.' });
    }

    // Verify user has access to this batch
    if (role === 'Student') {
      // Check if student has approved enrollment
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
        return res.status(403).json({ message: 'Access denied. You are not enrolled in this batch.' });
      }
    } else if (role === 'Professor') {
      // Check if professor owns this batch
      const professor = await Professor.findOne({ where: { user_id } });
      if (!professor || batch.prof_id !== professor.prof_id) {
        return res.status(403).json({ message: 'Access denied. You do not teach this batch.' });
      }
    }
    // Admin can access all batches

    // Get announcements sorted by recent first
    const announcements = await Announcement.findAll({
      where: { batch_id: batchId },
      include: [{
        model: Professor,
        as: 'professor',
        attributes: ['prof_id', 'name', 'department']
      }],
      order: [['created_at', 'DESC']]
    });

    return res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return res.status(500).json({ message: 'Failed to fetch announcements', error: error.message });
  }
});

// ============================================
// GET /:id : Get single announcement
// ============================================
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByPk(id, {
      include: [
        {
          model: Professor,
          as: 'professor',
          attributes: ['prof_id', 'name', 'department']
        },
        {
          model: Batch,
          as: 'batch',
          attributes: ['batch_id', 'batch_name', 'course_code']
        }
      ]
    });

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    return res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    return res.status(500).json({ message: 'Failed to fetch announcement', error: error.message });
  }
});

// ============================================
// PUT /:id : Update announcement (Professor only, own announcements)
// ============================================
router.put('/:id', verifyToken, authorize('Professor'), upload.single('attachment'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, priority } = req.body;

    // Get professor profile
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    if (!professor) {
      return res.status(404).json({ message: 'Professor profile not found.' });
    }

    // Find announcement and verify ownership
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    if (announcement.prof_id !== professor.prof_id) {
      return res.status(403).json({ message: 'You can only update your own announcements.' });
    }

    // Update fields
    const updates = {};
    if (title) updates.title = title;
    if (content) updates.content = content;
    if (priority) updates.priority = priority;
    if (req.file) updates.attachment_url = `/uploads/${req.file.filename}`;

    await announcement.update(updates);

    const updatedAnnouncement = await Announcement.findByPk(id, {
      include: [{
        model: Professor,
        as: 'professor',
        attributes: ['prof_id', 'name', 'department']
      }]
    });

    return res.json({
      message: 'Announcement updated successfully',
      announcement: updatedAnnouncement
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return res.status(500).json({ message: 'Failed to update announcement', error: error.message });
  }
});

// ============================================
// DELETE /:id : Delete announcement (Professor only, own announcements)
// ============================================
router.delete('/:id', verifyToken, authorize('Professor'), async (req, res) => {
  try {
    const { id } = req.params;

    // Get professor profile
    const professor = await Professor.findOne({ where: { user_id: req.user.user_id } });
    if (!professor) {
      return res.status(404).json({ message: 'Professor profile not found.' });
    }

    // Find announcement and verify ownership
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found.' });
    }

    if (announcement.prof_id !== professor.prof_id) {
      return res.status(403).json({ message: 'You can only delete your own announcements.' });
    }

    await announcement.destroy();

    return res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return res.status(500).json({ message: 'Failed to delete announcement', error: error.message });
  }
});

module.exports = router;
