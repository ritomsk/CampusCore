module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the old table and recreate with correct structure
    await queryInterface.dropTable('timetable_slots');
    
    await queryInterface.createTable('timetable_slots', {
      slot_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      course_code: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'course_code'
        },
        onDelete: 'CASCADE'
      },
      day_of_week: {
        type: Sequelize.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
        allowNull: false
      },
      room_number: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      slot_type: {
        type: Sequelize.ENUM('Lecture', 'Lab', 'Tutorial'),
        defaultValue: 'Lecture'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint: one course can only have one entry per day
    await queryInterface.addConstraint('timetable_slots', {
      fields: ['course_code', 'day_of_week'],
      type: 'unique',
      name: 'unique_course_day'
    });
    
    // Add index for faster queries
    await queryInterface.addIndex('timetable_slots', ['course_code', 'day_of_week'], {
      name: 'idx_course_day'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('timetable_slots');
  }
};
