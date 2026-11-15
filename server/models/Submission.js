const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Submission = sequelize.define('Submission', {
  submission_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  material_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  enrollment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  submitted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  grade_status: {
    type: DataTypes.ENUM('Pending', 'Graded'),
    defaultValue: 'Pending'
  },
  obtained_marks: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Marks awarded by professor (null = unmarked)'
  },
  graded_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  graded_by: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'prof_id who graded this submission'
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Professor feedback on submission'
  }
}, {
  tableName: 'submissions',
  timestamps: false
});

module.exports = Submission;
