/**
 * Test script to verify Phase 1 models are correctly defined
 * Run with: node test-models.js
 */

const { sequelize, Batch, Announcement, CourseMaterial, Submission } = require('./models');

async function testModels() {
  try {
    console.log('🔍 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    console.log('\n🔍 Testing Batch model...');
    console.log('Batch fields:', Object.keys(Batch.rawAttributes));
    const requiredBatchFields = ['batch_name', 'section', 'class_code', 'enrollment_mode'];
    requiredBatchFields.forEach(field => {
      if (Batch.rawAttributes[field]) {
        console.log(`✅ ${field} field exists`);
      } else {
        console.log(`❌ ${field} field missing`);
      }
    });

    console.log('\n🔍 Testing Announcement model...');
    console.log('Announcement fields:', Object.keys(Announcement.rawAttributes));
    const requiredAnnouncementFields = ['announcement_id', 'batch_id', 'prof_id', 'title', 'content', 'priority'];
    requiredAnnouncementFields.forEach(field => {
      if (Announcement.rawAttributes[field]) {
        console.log(`✅ ${field} field exists`);
      } else {
        console.log(`❌ ${field} field missing`);
      }
    });

    console.log('\n🔍 Testing CourseMaterial model...');
    console.log('CourseMaterial fields:', Object.keys(CourseMaterial.rawAttributes));
    const newMaterialFields = ['total_points', 'topic'];
    newMaterialFields.forEach(field => {
      if (CourseMaterial.rawAttributes[field]) {
        console.log(`✅ ${field} field exists`);
      } else {
        console.log(`❌ ${field} field missing`);
      }
    });

    console.log('\n🔍 Testing Submission model...');
    console.log('Submission fields:', Object.keys(Submission.rawAttributes));
    const newSubmissionFields = ['obtained_marks', 'graded_at', 'graded_by', 'feedback'];
    newSubmissionFields.forEach(field => {
      if (Submission.rawAttributes[field]) {
        console.log(`✅ ${field} field exists`);
      } else {
        console.log(`❌ ${field} field missing`);
      }
    });

    console.log('\n🔍 Testing associations...');
    const batchAssociations = Object.keys(Batch.associations);
    console.log('Batch associations:', batchAssociations);
    if (batchAssociations.includes('announcements')) {
      console.log('✅ Batch → Announcement association exists');
    } else {
      console.log('❌ Batch → Announcement association missing');
    }

    const professorAssociations = Object.keys(Announcement.associations);
    console.log('Announcement associations:', professorAssociations);
    
    console.log('\n✅ All model tests completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Run the migration script: mysql -u root -p campuscore < server/migrations/add-classroom-features.sql');
    console.log('2. Restart the server: npm start');
    console.log('3. Test API endpoints with Postman');

  } catch (error) {
    console.error('❌ Error testing models:', error.message);
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

testModels();
