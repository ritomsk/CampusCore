const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Placement = sequelize.define('Placement', {
  placement_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  batch_year: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  package_lpa: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('On Campus', 'Off Campus'),
    allowNull: false,
    defaultValue: 'On Campus'
  },
  students_placed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'placements',
  timestamps: false
});

module.exports = Placement;
