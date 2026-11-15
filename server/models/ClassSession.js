const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ClassSession = sequelize.define('ClassSession', {
  session_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  session_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  topic_covered: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'class_sessions',
  timestamps: false
});

module.exports = ClassSession;
