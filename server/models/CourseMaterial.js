const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CourseMaterial = sequelize.define('CourseMaterial', {
  material_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('Note', 'PYQ', 'Assignment'),
    allowNull: false
  },
  file_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  total_points: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 100,
    comment: 'Total points for assignments (grading rubric)'
  },
  topic: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Topic/category for organization (e.g., "Unit 2: Algorithms")'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'course_materials',
  timestamps: false
});

module.exports = CourseMaterial;
