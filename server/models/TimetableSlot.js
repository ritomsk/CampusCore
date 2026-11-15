const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TimetableSlot = sequelize.define('TimetableSlot', {
  slot_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  course_code: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'course_code'
    }
  },
  day_of_week: {
    type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
    allowNull: false
  },
  room_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  slot_type: {
    type: DataTypes.ENUM('Lecture', 'Lab', 'Tutorial'),
    defaultValue: 'Lecture'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'timetable_slots',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['course_code', 'day_of_week'],
      name: 'unique_course_day'
    }
  ]
});

module.exports = TimetableSlot;
