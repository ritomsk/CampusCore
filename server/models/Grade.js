const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Grade = sequelize.define('Grade', {
  grade_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  enrollment_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assessment_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  max_score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 100.00
  },
  co_mapping: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'grades',
  timestamps: false
});

module.exports = Grade;
