const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Professor = sequelize.define('Professor', {
  prof_id: {
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
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  office_room: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'professors',
  timestamps: false
});

module.exports = Professor;
