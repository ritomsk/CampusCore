require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('Testing MySQL connection...');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('Password length:', process.env.DB_PASSWORD?.length || 0);
  console.log('Password (first 3 chars):', process.env.DB_PASSWORD?.substring(0, 3) + '***');
  
  try {
    // Try to connect without database first
    console.log('\n1. Testing connection to MySQL server...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    console.log('✅ Connected to MySQL server!');
    
    // Check if database exists
    console.log('\n2. Checking if database exists...');
    const [databases] = await connection.query('SHOW DATABASES');
    const dbExists = databases.some(db => db.Database === process.env.DB_NAME);
    
    if (dbExists) {
      console.log(`✅ Database '${process.env.DB_NAME}' exists!`);
    } else {
      console.log(`❌ Database '${process.env.DB_NAME}' does NOT exist!`);
      console.log('Creating database...');
      await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Database '${process.env.DB_NAME}' created!`);
    }
    
    await connection.end();
    console.log('\n✅ All tests passed! Your database is ready.');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\n💡 This is a password/authentication error.');
      console.error('Solutions:');
      console.error('1. Check your MySQL password is correct');
      console.error('2. Try resetting MySQL root password');
      console.error('3. Check if root user has proper permissions');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 MySQL server is not running.');
      console.error('Start MySQL service in Windows Services');
    }
    
    process.exit(1);
  }
}

testConnection();
