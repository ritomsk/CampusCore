const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SystemSettings = sequelize.define('SystemSettings', {
  setting_key: {
    type: DataTypes.STRING(100),
    primaryKey: true,
    allowNull: false
  },
  setting_value: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  updated_by: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'system_settings',
  timestamps: false
});

module.exports = SystemSettings;
