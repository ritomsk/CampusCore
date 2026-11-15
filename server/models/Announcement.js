const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Announcement = sequelize.define('Announcement', {
  announcement_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  batch_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'batches',
      key: 'batch_id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  prof_id: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Professor who created announcement'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachment_url: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Optional file attachment'
  },
  priority: {
    type: DataTypes.ENUM('normal', 'important', 'urgent'),
    defaultValue: 'normal'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'announcements',
  timestamps: false
});

module.exports = Announcement;
