const express = require('express');
const router = express.Router();
const { SystemSettings } = require('../models');
const { verifyToken } = require('../middleware/auth');
const authorize = require('../middleware/roleGuard');

// ============ GET CURRENT SEMESTER (Public - no auth required) ============
router.get('/current-semester', async (req, res) => {
  try {
    const semester = await SystemSettings.findByPk('current_semester');
    const year = await SystemSettings.findByPk('current_academic_year');
    
    if (!semester || !year) {
      return res.status(404).json({ error: 'Current semester not configured.' });
    }
    
    res.json({
      semester: semester.setting_value,
      academic_year: year.setting_value,
      display: `${semester.setting_value} ${year.setting_value}`
    });
  } catch (error) {
    console.error('Get current semester error:', error);
    res.status(500).json({ error: 'Failed to fetch current semester.' });
  }
});

// ============ GET ALL SETTINGS (Admin only) ============
router.get('/', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const settings = await SystemSettings.findAll({
      order: [['setting_key', 'ASC']]
    });
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

// ============ UPDATE SETTING (Admin only) ============
router.put('/:setting_key', verifyToken, authorize('Admin'), async (req, res) => {
  try {
    const { setting_key } = req.params;
    const { setting_value } = req.body;
    
    if (!setting_value) {
      return res.status(400).json({ error: 'setting_value is required.' });
    }
    
    // Validate semester value
    if (setting_key === 'current_semester' && !['Autumn', 'Spring'].includes(setting_value)) {
      return res.status(400).json({ error: 'Semester must be either Autumn or Spring.' });
    }
    
    // Validate year value
    if (setting_key === 'current_academic_year') {
      const year = parseInt(setting_value);
      if (isNaN(year) || year < 2020 || year > 2100) {
        return res.status(400).json({ error: 'Invalid academic year.' });
      }
    }
    
    const setting = await SystemSettings.findByPk(setting_key);
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found.' });
    }
    
    await setting.update({
      setting_value,
      updated_by: req.user.email || req.user.user_id,
      updated_at: new Date()
    });
    
    res.json({ 
      message: 'Setting updated successfully.',
      setting
    });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting.' });
  }
});

module.exports = router;
