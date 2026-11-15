const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Student = sequelize.define('Student', {
  roll_no: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  program: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  cgpa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: true,
    defaultValue: 0.00
  },
  backlogs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('Active', 'Probation'),
    defaultValue: 'Active'
  }
}, {
  tableName: 'students',
  timestamps: false
});

module.exports = Student;
