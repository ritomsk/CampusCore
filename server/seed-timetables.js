const { Course, TimetableSlot } = require('./models');

async function seedTimetables() {
  try {
    console.log('Starting timetable seeding...');

    // Get all courses
    const courses = await Course.findAll();
    console.log(`Found ${courses.length} courses`);

    // Sample timetable patterns
    const patterns = [
      { days: ['Monday', 'Wednesday', 'Friday'], type: 'Lecture' },
      { days: ['Tuesday', 'Thursday'], type: 'Lecture' },
      { days: ['Monday', 'Thursday'], type: 'Lecture' },
      { days: ['Tuesday', 'Friday'], type: 'Lab' },
      { days: ['Wednesday'], type: 'Tutorial' }
    ];

    // Room numbers
    const rooms = ['R101', 'R102', 'R103', 'R201', 'R202', 'R203', 'Lab-A', 'Lab-B', 'Lab-C'];

    for (const course of courses) {
      // Randomly assign a pattern
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      
      for (const day of pattern.days) {
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        
        try {
          await TimetableSlot.create({
            course_code: course.course_code,
            day_of_week: day,
            room_number: room,
            slot_type: pattern.type,
            is_active: true
          });
          console.log(`✓ Added ${day} ${pattern.type} for ${course.course_code} in ${room}`);
        } catch (error) {
          if (error.name === 'SequelizeUniqueConstraintError') {
            console.log(`  Skipped ${day} for ${course.course_code} (already exists)`);
          } else {
            throw error;
          }
        }
      }
    }

    console.log('\nTimetable seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedTimetables();
