const sequelize = require('../config/db');
const User = require('./User');
const Student = require('./Student');
const Professor = require('./Professor');
const Course = require('./Course');
const Batch = require('./Batch');
const Enrollment = require('./Enrollment');
const CourseMaterial = require('./CourseMaterial');
const Submission = require('./Submission');
const ClassSession = require('./ClassSession');
const AttendanceLog = require('./AttendanceLog');
const Grade = require('./Grade');
const Placement = require('./Placement');
const Announcement = require('./Announcement');
const SystemSettings = require('./SystemSettings');
const TimetableSlot = require('./TimetableSlot');

// User <-> Student (1:1)
User.hasOne(Student, { foreignKey: 'user_id', as: 'student', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User <-> Professor (1:1)
User.hasOne(Professor, { foreignKey: 'user_id', as: 'professor', onDelete: 'CASCADE' });
Professor.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Course <-> Batch (1:N)
Course.hasMany(Batch, { foreignKey: 'course_code', sourceKey: 'course_code', as: 'batches', onDelete: 'CASCADE' });
Batch.belongsTo(Course, { foreignKey: 'course_code', targetKey: 'course_code', as: 'course' });

// Professor <-> Batch (1:N)
Professor.hasMany(Batch, { foreignKey: 'prof_id', sourceKey: 'prof_id', as: 'batches', onDelete: 'CASCADE' });
Batch.belongsTo(Professor, { foreignKey: 'prof_id', targetKey: 'prof_id', as: 'professor' });

// Batch <-> Enrollment (1:N)
Batch.hasMany(Enrollment, { foreignKey: 'batch_id', sourceKey: 'batch_id', as: 'enrollments', onDelete: 'CASCADE' });
Enrollment.belongsTo(Batch, { foreignKey: 'batch_id', targetKey: 'batch_id', as: 'batch' });

// Student <-> Enrollment (1:N)
Student.hasMany(Enrollment, { foreignKey: 'roll_no', sourceKey: 'roll_no', as: 'enrollments', onDelete: 'CASCADE' });
Enrollment.belongsTo(Student, { foreignKey: 'roll_no', targetKey: 'roll_no', as: 'student' });

// Batch <-> CourseMaterial (1:N)
Batch.hasMany(CourseMaterial, { foreignKey: 'batch_id', sourceKey: 'batch_id', as: 'materials', onDelete: 'CASCADE' });
CourseMaterial.belongsTo(Batch, { foreignKey: 'batch_id', targetKey: 'batch_id', as: 'batch' });

// CourseMaterial <-> Submission (1:N)
CourseMaterial.hasMany(Submission, { foreignKey: 'material_id', as: 'submissions', onDelete: 'CASCADE' });
Submission.belongsTo(CourseMaterial, { foreignKey: 'material_id', as: 'material' });

// Enrollment <-> Submission (1:N)
Enrollment.hasMany(Submission, { foreignKey: 'enrollment_id', as: 'submissions', onDelete: 'CASCADE' });
Submission.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

// Batch <-> ClassSession (1:N)
Batch.hasMany(ClassSession, { foreignKey: 'batch_id', sourceKey: 'batch_id', as: 'sessions', onDelete: 'CASCADE' });
ClassSession.belongsTo(Batch, { foreignKey: 'batch_id', targetKey: 'batch_id', as: 'batch' });

// ClassSession <-> AttendanceLog (1:N)
ClassSession.hasMany(AttendanceLog, { foreignKey: 'session_id', as: 'attendanceLogs', onDelete: 'CASCADE' });
AttendanceLog.belongsTo(ClassSession, { foreignKey: 'session_id', as: 'session' });

// Student <-> AttendanceLog (1:N)
Student.hasMany(AttendanceLog, { foreignKey: 'roll_no', sourceKey: 'roll_no', as: 'attendanceLogs', onDelete: 'CASCADE' });
AttendanceLog.belongsTo(Student, { foreignKey: 'roll_no', targetKey: 'roll_no', as: 'student' });

// Enrollment <-> Grade (1:N)
Enrollment.hasMany(Grade, { foreignKey: 'enrollment_id', as: 'grades', onDelete: 'CASCADE' });
Grade.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });

// Batch <-> Announcement (1:N)
Batch.hasMany(Announcement, { foreignKey: 'batch_id', sourceKey: 'batch_id', as: 'announcements', onDelete: 'CASCADE' });
Announcement.belongsTo(Batch, { foreignKey: 'batch_id', targetKey: 'batch_id', as: 'batch' });

// Professor <-> Announcement (1:N)
Professor.hasMany(Announcement, { foreignKey: 'prof_id', sourceKey: 'prof_id', as: 'announcements', onDelete: 'CASCADE' });
Announcement.belongsTo(Professor, { foreignKey: 'prof_id', targetKey: 'prof_id', as: 'professor' });

// Course <-> TimetableSlot (1:N)
Course.hasMany(TimetableSlot, { foreignKey: 'course_code', sourceKey: 'course_code', as: 'timetableSlots', onDelete: 'CASCADE' });
TimetableSlot.belongsTo(Course, { foreignKey: 'course_code', targetKey: 'course_code', as: 'course' });

const models = {
  User,
  Student,
  Professor,
  Course,
  Batch,
  Enrollment,
  CourseMaterial,
  Submission,
  ClassSession,
  AttendanceLog,
  Grade,
  Placement,
  Announcement,
  SystemSettings,
  TimetableSlot
};

module.exports = {
  sequelize,
  models,
  User,
  Student,
  Professor,
  Course,
  Batch,
  Enrollment,
  CourseMaterial,
  Submission,
  ClassSession,
  AttendanceLog,
  Grade,
  Placement,
  Announcement,
  SystemSettings,
  TimetableSlot
};
