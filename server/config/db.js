const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Use connection URL if provided, otherwise use individual parameters
const connectionUrl = process.env.DATABASE_URL;

let sequelize;

if (connectionUrl) {
  // Use connection URL (Railway format)
  sequelize = new Sequelize(connectionUrl, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 60000, // Increased timeout to 60 seconds
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000 // 60 seconds connection timeout
    }
  });
} else {
  // Use individual connection parameters
  sequelize = new Sequelize(
    process.env.DB_NAME || 'campuscore',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'password123',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 60000, // Increased timeout to 60 seconds
        idle: 10000
      },
      dialectOptions: {
        connectTimeout: 60000 // 60 seconds connection timeout
      }
    }
  );
}

module.exports = sequelize;
