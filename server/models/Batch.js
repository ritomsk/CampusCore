const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Batch = sequelize.define('Batch', {
  batch_id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  course_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prof_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  batch_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'User-friendly batch name (e.g., "Data Structures Fall 2026")'
  },
  section: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: 'A',
    comment: 'Section identifier (A, B, C, etc.)'
  },
  class_code: {
    type: DataTypes.STRING(8),
    allowNull: true, // Will make NOT NULL after migration
    unique: true,
    comment: 'Unique 8-character code for student self-enrollment'
  },
  enrollment_mode: {
    type: DataTypes.ENUM('open', 'request', 'invite_only'),
    allowNull: false,
    defaultValue: 'request',
    comment: 'open: auto-approve, request: needs approval, invite_only: professor adds only'
  },
  academic_year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester: {
    type: DataTypes.ENUM('Autumn', 'Spring'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'Archived'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'batches',
  timestamps: false
});

module.exports = Batch;
