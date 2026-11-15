const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const {
  sequelize,
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
} = require('../models');

async function seedDatabase() {
  console.log('--- Starting CampusCore Database Seeding ---');

  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || 'Partha123@';
  const dbName = process.env.DB_NAME || 'campuscore';

  // 1. Ensure the database exists
  try {
    const conn = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword
    });
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await conn.end();
    console.log(`Verified database '${dbName}'.`);
  } catch (err) {
    console.warn(`Direct connection check: ${err.message}`);
  }

  // 2. Sync database with force: true to recreate tables
  await sequelize.sync({ force: true });
  console.log('All database tables synced (force: true).');

  const defaultPasswordHash = await bcrypt.hash('demo123', 10);

  // 3. Create Users & Profiles
  // Primary Student: csb24002@tezu.ac.in
  const userStudent1 = await User.create({
    email: 'csb24002@tezu.ac.in',
    password_hash: defaultPasswordHash,
    role: 'Student'
  });
  const student1 = await Student.create({
    roll_no: 'CSB24002',
    user_id: userStudent1.user_id,
    name: 'Ritom Saikia',
    program: 'B.Tech',
    department: 'CSE',
    semester: 4,
    cgpa: 9.05,
    backlogs: 0,
    status: 'Active'
  });

  // Primary Professor: sroy@tezu.ac.in
  const userProf1 = await User.create({
    email: 'sroy@tezu.ac.in',
    password_hash: defaultPasswordHash,
    role: 'Professor'
  });
  const prof1 = await Professor.create({
    prof_id: 'P-002',
    user_id: userProf1.user_id,
    name: 'Dr. Swarup Roy',
    department: 'CSE',
    office_room: 'CS-204'
  });

  // Primary Admin: admin@tezu.ac.in
  const userAdmin = await User.create({
    email: 'admin@tezu.ac.in',
    password_hash: defaultPasswordHash,
    role: 'Admin'
  });

  // Additional Students
  const additionalStudentsData = [
    { roll_no: 'CSB24007', name: 'Partha Pratim Das', email: 'csb24007@tezu.ac.in', program: 'B.Tech', dept: 'CSE', sem: 4, cgpa: 8.75, backlogs: 0, status: 'Active' },
    { roll_no: 'CSB24008', name: 'Debankur Saikia', email: 'csb24008@tezu.ac.in', program: 'B.Tech', dept: 'CSE', sem: 4, cgpa: 8.90, backlogs: 0, status: 'Active' },
    { roll_no: 'CSB24010', name: 'Rahul Kumar', email: 'csb24010@tezu.ac.in', program: 'B.Tech', dept: 'CSE', sem: 4, cgpa: 7.80, backlogs: 0, status: 'Active' },
    { roll_no: 'CSB24015', name: 'Priya Singh', email: 'csb24015@tezu.ac.in', program: 'B.Tech', dept: 'CSE', sem: 4, cgpa: 9.20, backlogs: 0, status: 'Active' },
    { roll_no: 'CSB24018', name: 'Vikram Singh', email: 'csb24018@tezu.ac.in', program: 'B.Tech', dept: 'CSE', sem: 4, cgpa: 6.10, backlogs: 2, status: 'Probation' },
    { roll_no: 'ECB24001', name: 'Ankit Patel', email: 'ecb24001@tezu.ac.in', program: 'B.Tech', dept: 'ECE', sem: 4, cgpa: 8.40, backlogs: 0, status: 'Active' },
    { roll_no: 'ECB24005', name: 'Sneha Roy', email: 'ecb24005@tezu.ac.in', program: 'B.Tech', dept: 'ECE', sem: 4, cgpa: 8.65, backlogs: 0, status: 'Active' },
    { roll_no: 'MEB24003', name: 'Rohit Verma', email: 'meb24003@tezu.ac.in', program: 'B.Tech', dept: 'ME', sem: 4, cgpa: 7.95, backlogs: 0, status: 'Active' },
    { roll_no: 'CEB24002', name: 'Deepak Nair', email: 'ceb24002@tezu.ac.in', program: 'B.Tech', dept: 'CE', sem: 4, cgpa: 8.15, backlogs: 0, status: 'Active' }
  ];

  for (const s of additionalStudentsData) {
    const u = await User.create({
      email: s.email,
      password_hash: defaultPasswordHash,
      role: 'Student'
    });
    await Student.create({
      roll_no: s.roll_no,
      user_id: u.user_id,
      name: s.name,
      program: s.program,
      department: s.dept,
      semester: s.sem,
      cgpa: s.cgpa,
      backlogs: s.backlogs,
      status: s.status
    });
  }
  console.log(`Created primary users and 10 students, 1 professor, 1 admin.`);

  // 4. Create 9 Courses
  const coursesData = [
    { course_code: 'CSBT302', title: 'Database Systems Lab', department: 'CSE', credits: 4 },
    { course_code: 'CSBT303', title: 'Computer Networks', department: 'CSE', credits: 3 },
    { course_code: 'CSBT304', title: 'Operating Systems Lab', department: 'CSE', credits: 4 },
    { course_code: 'CSBT305', title: 'Software Engineering', department: 'CSE', credits: 3 },
    { course_code: 'CSBT306', title: 'Data Structures', department: 'CSE', credits: 4 },
    { course_code: 'ECBT301', title: 'Digital Signal Processing', department: 'ECE', credits: 4 },
    { course_code: 'ECBT302', title: 'Microprocessors', department: 'ECE', credits: 3 },
    { course_code: 'MEBT301', title: 'Thermodynamics', department: 'ME', credits: 4 },
    { course_code: 'CEBT301', title: 'Structural Analysis', department: 'CE', credits: 3 }
  ];

  for (const c of coursesData) {
    await Course.create(c);
  }
  console.log('Created 9 courses.');

  // 5. Create 3 Batches with enhanced classroom features
  const batchesData = [
    { 
      batch_id: 'B-2026-CS301', 
      course_code: 'CSBT302', 
      prof_id: 'P-002', 
      academic_year: '2026', 
      semester: 'Autumn', 
      status: 'Active',
      batch_name: 'Database Systems Lab - Section A',
      section: 'A',
      class_code: 'XK7P2M9Q',
      enrollment_mode: 'open'
    },
    { 
      batch_id: 'B-2026-CS302', 
      course_code: 'CSBT303', 
      prof_id: 'P-002', 
      academic_year: '2026', 
      semester: 'Autumn', 
      status: 'Active',
      batch_name: 'Computer Networks - Morning Batch',
      section: 'B',
      class_code: 'LM3N8QRT',
      enrollment_mode: 'request'
    },
    { 
      batch_id: 'B-2026-CS303', 
      course_code: 'CSBT306', 
      prof_id: 'P-002', 
      academic_year: '2026', 
      semester: 'Autumn', 
      status: 'Active',
      batch_name: 'Data Structures - Advanced Section',
      section: 'A',
      class_code: 'PQ5R7VWX',
      enrollment_mode: 'invite_only'
    }
  ];

  for (const b of batchesData) {
    await Batch.create(b);
  }
  console.log('Created 3 batches with class codes and enrollment modes.');

  // 6. Create Enrollments
  // CSB24002 in all 3 (Approved)
  const e1 = await Enrollment.create({ batch_id: 'B-2026-CS301', roll_no: 'CSB24002', status: 'Approved', request_date: '2026-08-01' });
  const e2 = await Enrollment.create({ batch_id: 'B-2026-CS302', roll_no: 'CSB24002', status: 'Approved', request_date: '2026-08-01' });
  const e3 = await Enrollment.create({ batch_id: 'B-2026-CS303', roll_no: 'CSB24002', status: 'Approved', request_date: '2026-08-01' });

  // CSB24007 & CSB24008 in first 2 (Approved)
  const e4 = await Enrollment.create({ batch_id: 'B-2026-CS301', roll_no: 'CSB24007', status: 'Approved', request_date: '2026-08-02' });
  const e5 = await Enrollment.create({ batch_id: 'B-2026-CS302', roll_no: 'CSB24007', status: 'Approved', request_date: '2026-08-02' });
  const e6 = await Enrollment.create({ batch_id: 'B-2026-CS301', roll_no: 'CSB24008', status: 'Approved', request_date: '2026-08-02' });
  const e7 = await Enrollment.create({ batch_id: 'B-2026-CS302', roll_no: 'CSB24008', status: 'Approved', request_date: '2026-08-02' });

  // Vikram Singh (CSB24018) Approved in CS301
  const e8 = await Enrollment.create({ batch_id: 'B-2026-CS301', roll_no: 'CSB24018', status: 'Approved', request_date: '2026-08-03' });

  // Pending enrollments
  await Enrollment.create({ batch_id: 'B-2026-CS303', roll_no: 'CSB24007', status: 'Pending', request_date: '2026-08-05' });
  await Enrollment.create({ batch_id: 'B-2026-CS303', roll_no: 'CSB24008', status: 'Pending', request_date: '2026-08-05' });
  await Enrollment.create({ batch_id: 'B-2026-CS301', roll_no: 'CSB24010', status: 'Pending', request_date: '2026-08-06' });
  await Enrollment.create({ batch_id: 'B-2026-CS302', roll_no: 'CSB24015', status: 'Pending', request_date: '2026-08-06' });

  console.log('Created enrollments (Approved & Pending).');

  // 7. Create Course Materials with total_points and topics
  const materialsData = [
    // B-2026-CS301
    {
      batch_id: 'B-2026-CS301',
      title: 'SQL Fundamentals & Relational Algebra',
      type: 'Note',
      file_url: '/uploads/sample_sql_notes.pdf',
      description: 'Comprehensive notes covering DDL, DML and relational queries.',
      due_date: null,
      topic: 'Unit 1: Database Fundamentals'
    },
    {
      batch_id: 'B-2026-CS301',
      title: 'Lab Assignment 1 - Schema Design & Normalization',
      type: 'Assignment',
      file_url: '/uploads/sample_assignment_1.pdf',
      description: 'Design 3NF schema for hospital management with ER diagram.',
      due_date: new Date('2026-11-15T23:59:59Z'),
      total_points: 100,
      topic: 'Unit 2: Database Design'
    },
    {
      batch_id: 'B-2026-CS301',
      title: 'Autumn 2025 DBMS Lab End-Sem Exam',
      type: 'PYQ',
      file_url: '/uploads/sample_pyq_dbms_2025.pdf',
      description: 'Previous year end-sem practical problem sets with solutions.',
      due_date: null,
      topic: 'Exam Preparation'
    },
    {
      batch_id: 'B-2026-CS301',
      title: 'Lab Assignment 2 - Stored Procedures & Triggers',
      type: 'Assignment',
      file_url: '/uploads/sample_assignment_2.pdf',
      description: 'Implement automated auditing triggers for inventory database.',
      due_date: new Date('2026-11-25T23:59:59Z'),
      total_points: 50,
      topic: 'Unit 3: PL/SQL Programming'
    },

    // B-2026-CS302
    {
      batch_id: 'B-2026-CS302',
      title: 'OSI and TCP/IP Reference Architectures',
      type: 'Note',
      file_url: '/uploads/sample_cn_notes.pdf',
      description: 'Layering breakdown, PDU headers, and encapsulation overview.',
      due_date: null,
      topic: 'Unit 1: Network Architecture'
    },
    {
      batch_id: 'B-2026-CS302',
      title: 'Assignment 1 - Socket Programming',
      type: 'Assignment',
      file_url: '/uploads/sample_socket_prog.pdf',
      description: 'Client-server multi-threaded chat application in C/Python.',
      due_date: new Date('2026-11-18T23:59:59Z'),
      total_points: 100,
      topic: 'Unit 2: Application Layer'
    },
    {
      batch_id: 'B-2026-CS302',
      title: 'Mid-Term Question Bank 2024-2025',
      type: 'PYQ',
      file_url: '/uploads/sample_cn_pyq.pdf',
      description: 'Solved mid-term numericals on bandwidth-delay product & sliding window.',
      due_date: null,
      topic: 'Exam Preparation'
    },

    // B-2026-CS303
    {
      batch_id: 'B-2026-CS303',
      title: 'Self-Balancing Trees: AVL and Red-Black Trees',
      type: 'Note',
      file_url: '/uploads/sample_dsa_trees.pdf',
      description: 'Detailed analysis of rotations, tree balance factor, and proofs.',
      due_date: null,
      topic: 'Unit 3: Trees'
    },
    {
      batch_id: 'B-2026-CS303',
      title: 'Assignment 1 - Graph Traversal & Shortest Path',
      type: 'Assignment',
      file_url: '/uploads/sample_dsa_graphs.pdf',
      description: 'Implement Dijkstra and Bellman-Ford algorithms on large sparse graphs.',
      due_date: new Date('2026-11-20T23:59:59Z'),
      total_points: 100,
      topic: 'Unit 4: Graphs'
    },
    {
      batch_id: 'B-2026-CS303',
      title: 'End-Semester 2024 Data Structures Question Paper',
      type: 'PYQ',
      file_url: '/uploads/sample_dsa_pyq.pdf',
      description: 'Complete end-sem exam question paper with grading criteria.',
      due_date: null,
      topic: 'Exam Preparation'
    }
  ];

  const createdMaterials = [];
  for (const m of materialsData) {
    const mat = await CourseMaterial.create(m);
    createdMaterials.push(mat);
  }
  console.log('Created course materials with topics and total_points (Notes, Assignments, PYQs).');

  // Seed sample submissions with grading
  const dbmsAssignment = createdMaterials.find(m => m.title.includes('Lab Assignment 1'));
  const cnAssignment = createdMaterials.find(m => m.title.includes('Socket Programming'));
  const dsaAssignment = createdMaterials.find(m => m.title.includes('Graph Traversal'));
  
  if (dbmsAssignment) {
    // CSB24002 - Graded submission
    await Submission.create({
      material_id: dbmsAssignment.material_id,
      enrollment_id: e1.enrollment_id,
      file_url: '/uploads/submissions/csb24002_dbms_assignment1.pdf',
      submitted_at: new Date('2026-11-10T10:30:00Z'),
      grade_status: 'Graded',
      obtained_marks: 85.5,
      graded_at: new Date('2026-11-12T14:20:00Z'),
      graded_by: 'P-002',
      feedback: 'Excellent work on normalization! ER diagram is well-structured. Minor improvements needed in constraint definitions.'
    });
    
    // CSB24007 - Submitted but not graded
    await Submission.create({
      material_id: dbmsAssignment.material_id,
      enrollment_id: e4.enrollment_id,
      file_url: '/uploads/submissions/csb24007_dbms_assignment1.pdf',
      submitted_at: new Date('2026-11-11T16:45:00Z'),
      grade_status: 'Pending'
    });
    
    // CSB24008 - Graded submission
    await Submission.create({
      material_id: dbmsAssignment.material_id,
      enrollment_id: e6.enrollment_id,
      file_url: '/uploads/submissions/csb24008_dbms_assignment1.pdf',
      submitted_at: new Date('2026-11-09T22:15:00Z'),
      grade_status: 'Graded',
      obtained_marks: 78.0,
      graded_at: new Date('2026-11-12T15:00:00Z'),
      graded_by: 'P-002',
      feedback: 'Good understanding of normalization concepts. Check attribute closure calculations.'
    });
  }
  
  if (cnAssignment) {
    // CSB24002 - Graded submission
    await Submission.create({
      material_id: cnAssignment.material_id,
      enrollment_id: e2.enrollment_id,
      file_url: '/uploads/submissions/csb24002_cn_socket.zip',
      submitted_at: new Date('2026-11-15T18:30:00Z'),
      grade_status: 'Graded',
      obtained_marks: 92.0,
      graded_at: new Date('2026-11-17T10:00:00Z'),
      graded_by: 'P-002',
      feedback: 'Outstanding implementation! Multi-threading handled properly. Code is clean and well-documented.'
    });
    
    // CSB24007 - Submitted but not graded
    await Submission.create({
      material_id: cnAssignment.material_id,
      enrollment_id: e5.enrollment_id,
      file_url: '/uploads/submissions/csb24007_cn_socket.zip',
      submitted_at: new Date('2026-11-17T23:55:00Z'),
      grade_status: 'Pending'
    });
  }
  
  if (dsaAssignment) {
    // CSB24002 - Submitted but not graded yet
    await Submission.create({
      material_id: dsaAssignment.material_id,
      enrollment_id: e3.enrollment_id,
      file_url: '/uploads/submissions/csb24002_dsa_graphs.cpp',
      submitted_at: new Date('2026-11-19T20:00:00Z'),
      grade_status: 'Pending'
    });
  }
  
  console.log('Created sample submissions with grading data.');

  // 7.5 Create Announcements
  const announcementsData = [
    // B-2026-CS301 (DBMS Lab)
    {
      batch_id: 'B-2026-CS301',
      prof_id: 'P-002',
      title: 'Welcome to Database Systems Lab!',
      content: 'Welcome everyone! This batch will cover advanced SQL queries, stored procedures, and database design principles. Please ensure you have MySQL Workbench installed on your systems.',
      priority: 'important',
      created_at: new Date('2026-09-25T09:00:00Z')
    },
    {
      batch_id: 'B-2026-CS301',
      prof_id: 'P-002',
      title: 'Assignment 1 Posted',
      content: 'Lab Assignment 1 on Schema Design & Normalization has been posted. Due date: November 15, 2026. Worth 100 points. Please submit via the assignments section.',
      priority: 'urgent',
      created_at: new Date('2026-11-01T10:30:00Z')
    },
    {
      batch_id: 'B-2026-CS301',
      prof_id: 'P-002',
      title: 'Mid-Semester Exam Schedule',
      content: 'The mid-semester practical exam will be held on November 22, 2026, from 2:00 PM to 4:00 PM in Computer Lab 3. Topics: Units 1-3. Please review all lab sessions and PYQs.',
      priority: 'important',
      created_at: new Date('2026-11-05T14:00:00Z')
    },
    {
      batch_id: 'B-2026-CS301',
      prof_id: 'P-002',
      title: 'Office Hours This Week',
      content: 'I will be available for doubt clearing sessions this Thursday (Nov 7) and Friday (Nov 8) from 4:00 PM to 5:30 PM in CS-204. Feel free to drop by with your queries.',
      priority: 'normal',
      created_at: new Date('2026-11-06T08:00:00Z')
    },
    {
      batch_id: 'B-2026-CS301',
      prof_id: 'P-002',
      title: 'Assignment 2 Released',
      content: 'Lab Assignment 2 on Stored Procedures & Triggers is now available. This is a 50-point assignment due on November 25. Start early as it requires understanding of PL/SQL basics.',
      priority: 'important',
      created_at: new Date('2026-11-08T11:00:00Z')
    },
    {
      batch_id: 'B-2026-CS301',
      prof_id: 'P-002',
      title: 'Reminder: Assignment 1 Due Tomorrow',
      content: 'This is a reminder that Assignment 1 submissions are due tomorrow (Nov 15) by 11:59 PM. Late submissions will incur a 10% penalty per day.',
      priority: 'urgent',
      created_at: new Date('2026-11-14T09:00:00Z')
    },
    
    // B-2026-CS302 (Computer Networks)
    {
      batch_id: 'B-2026-CS302',
      prof_id: 'P-002',
      title: 'Computer Networks - Batch Begins',
      content: 'Welcome to Computer Networks! This course will cover OSI/TCP-IP models, socket programming, routing algorithms, and transport protocols. Lab sessions are mandatory.',
      priority: 'important',
      created_at: new Date('2026-09-28T10:00:00Z')
    },
    {
      batch_id: 'B-2026-CS302',
      prof_id: 'P-002',
      title: 'Socket Programming Assignment Posted',
      content: 'Assignment 1 on Socket Programming is now available. Implement a multi-threaded chat application. Worth 100 points. Due: November 18, 2026.',
      priority: 'important',
      created_at: new Date('2026-11-03T15:00:00Z')
    },
    {
      batch_id: 'B-2026-CS302',
      prof_id: 'P-002',
      title: 'Class Canceled on Nov 12',
      content: 'Due to a faculty meeting, the class scheduled for November 12 is canceled. We will cover the missed topic in the next session. Please review OSI model layers.',
      priority: 'urgent',
      created_at: new Date('2026-11-10T18:00:00Z')
    },
    {
      batch_id: 'B-2026-CS302',
      prof_id: 'P-002',
      title: 'Network Simulator Tool Recommendation',
      content: 'For better understanding of routing algorithms, I recommend installing Cisco Packet Tracer or GNS3. Both are free and useful for network simulation experiments.',
      priority: 'normal',
      created_at: new Date('2026-11-13T12:00:00Z')
    },
    
    // B-2026-CS303 (Data Structures)
    {
      batch_id: 'B-2026-CS303',
      prof_id: 'P-002',
      title: 'Data Structures - Advanced Section Starts',
      content: 'This is an invite-only advanced section focusing on complex data structures and algorithm analysis. We will dive deep into trees, graphs, and dynamic programming.',
      priority: 'important',
      created_at: new Date('2026-09-30T09:30:00Z')
    },
    {
      batch_id: 'B-2026-CS303',
      prof_id: 'P-002',
      title: 'Graph Algorithms Assignment',
      content: 'Assignment 1 on Graph Traversal & Shortest Path algorithms has been posted. Implement Dijkstra and Bellman-Ford. Due: November 20. Worth 100 points.',
      priority: 'important',
      created_at: new Date('2026-11-04T10:00:00Z')
    },
    {
      batch_id: 'B-2026-CS303',
      prof_id: 'P-002',
      title: 'Competitive Programming Session',
      content: 'Optional competitive programming workshop this Saturday (Nov 9) from 2:00 PM to 4:00 PM. We will solve graph problems from Codeforces and LeetCode. All are welcome!',
      priority: 'normal',
      created_at: new Date('2026-11-07T16:00:00Z')
    },
    {
      batch_id: 'B-2026-CS303',
      prof_id: 'P-002',
      title: 'Guest Lecture: Industry Expert on System Design',
      content: 'We have a special guest lecture scheduled for November 21 by Mr. Rajesh Kumar (Senior Engineer, Amazon) on "Scalable System Design using Advanced Data Structures". Attendance is mandatory.',
      priority: 'urgent',
      created_at: new Date('2026-11-15T11:30:00Z')
    }
  ];
  
  await Announcement.bulkCreate(announcementsData);
  console.log('Created 14 announcements across 3 batches.');

  // 8. Create Class Sessions & Attendance Logs
  const batch1Sessions = [
    { date: '2026-10-01', topic: 'Introduction to DBMS & Relational Model' },
    { date: '2026-10-06', topic: 'DDL Commands & Table Constraints' },
    { date: '2026-10-13', topic: 'Complex SELECT Queries & Aggregate Functions' },
    { date: '2026-10-20', topic: 'Joins, Subqueries and Correlated Subqueries' },
    { date: '2026-10-25', topic: 'Normalization: 1NF, 2NF, 3NF and BCNF' },
    { date: '2026-10-28', topic: 'PL/SQL Basics: Stored Procedures & Functions' }
  ];

  const batch1Students = ['CSB24002', 'CSB24007', 'CSB24008', 'CSB24018'];

  for (let i = 0; i < batch1Sessions.length; i++) {
    const sInfo = batch1Sessions[i];
    const session = await ClassSession.create({
      batch_id: 'B-2026-CS301',
      session_date: sInfo.date,
      topic_covered: sInfo.topic
    });

    for (const roll of batch1Students) {
      let status = 'Present';
      if (roll === 'CSB24018' && (i === 1 || i === 4)) {
        status = 'Absent';
      } else if (roll === 'CSB24007' && i === 3) {
        status = 'Late';
      }
      await AttendanceLog.create({
        session_id: session.session_id,
        roll_no: roll,
        status
      });
    }
  }

  const batch2Sessions = [
    { date: '2026-10-03', topic: 'Network Layering & Protocol Stacks' },
    { date: '2026-10-08', topic: 'Physical & Data Link Layers: Framing & Error Detection' },
    { date: '2026-10-15', topic: 'Medium Access Control (MAC) & CSMA/CD' },
    { date: '2026-10-22', topic: 'Network Layer: IPv4 Addressing & CIDR' },
    { date: '2026-10-27', topic: 'Routing Algorithms: Distance Vector & Link State' }
  ];

  const batch2Students = ['CSB24002', 'CSB24007', 'CSB24008'];

  for (let i = 0; i < batch2Sessions.length; i++) {
    const sInfo = batch2Sessions[i];
    const session = await ClassSession.create({
      batch_id: 'B-2026-CS302',
      session_date: sInfo.date,
      topic_covered: sInfo.topic
    });

    for (const roll of batch2Students) {
      let status = 'Present';
      if (roll === 'CSB24008' && i === 2) {
        status = 'Absent';
      }
      await AttendanceLog.create({
        session_id: session.session_id,
        roll_no: roll,
        status
      });
    }
  }

  const batch3Sessions = [
    { date: '2026-10-02', topic: 'Asymptotic Analysis & Algorithm Complexity' },
    { date: '2026-10-07', topic: 'Linear Data Structures: Stacks, Queues, Linked Lists' },
    { date: '2026-10-14', topic: 'Binary Search Trees & Tree Traversals' },
    { date: '2026-10-21', topic: 'Priority Queues & Binary Heaps' },
    { date: '2026-10-26', topic: 'Graph Representation: Adjacency Matrix & Lists' },
    { date: '2026-10-29', topic: 'Graph Traversals: BFS & DFS Applications' }
  ];

  for (let i = 0; i < batch3Sessions.length; i++) {
    const sInfo = batch3Sessions[i];
    const session = await ClassSession.create({
      batch_id: 'B-2026-CS303',
      session_date: sInfo.date,
      topic_covered: sInfo.topic
    });

    await AttendanceLog.create({
      session_id: session.session_id,
      roll_no: 'CSB24002',
      status: i === 4 ? 'Late' : 'Present'
    });
  }

  console.log('Created class sessions and attendance logs.');

  // 9. Create Grades
  const gradesData = [
    // Ritom Saikia (CSB24002) in DBMS Lab (e1)
    { enrollment_id: e1.enrollment_id, assessment_name: 'Class Test 1', score: 28.5, max_score: 30.0, co_mapping: 'CO1' },
    { enrollment_id: e1.enrollment_id, assessment_name: 'Class Test 2', score: 27.0, max_score: 30.0, co_mapping: 'CO2' },
    { enrollment_id: e1.enrollment_id, assessment_name: 'Mid Semester Exam', score: 46.5, max_score: 50.0, co_mapping: 'CO1, CO2, CO3' },

    // Ritom Saikia (CSB24002) in Computer Networks (e2)
    { enrollment_id: e2.enrollment_id, assessment_name: 'Class Test 1', score: 29.0, max_score: 30.0, co_mapping: 'CO1' },
    { enrollment_id: e2.enrollment_id, assessment_name: 'Mid Semester Exam', score: 48.0, max_score: 50.0, co_mapping: 'CO1, CO2' },

    // Ritom Saikia (CSB24002) in Data Structures (e3)
    { enrollment_id: e3.enrollment_id, assessment_name: 'Class Test 1', score: 26.5, max_score: 30.0, co_mapping: 'CO1' },
    { enrollment_id: e3.enrollment_id, assessment_name: 'Mid Semester Exam', score: 45.0, max_score: 50.0, co_mapping: 'CO1, CO2' },

    // Partha Pratim Das (CSB24007) in DBMS Lab (e4)
    { enrollment_id: e4.enrollment_id, assessment_name: 'Class Test 1', score: 26.0, max_score: 30.0, co_mapping: 'CO1' },
    { enrollment_id: e4.enrollment_id, assessment_name: 'Mid Semester Exam', score: 43.5, max_score: 50.0, co_mapping: 'CO1, CO2, CO3' },

    // Debankur Saikia (CSB24008) in DBMS Lab (e6)
    { enrollment_id: e6.enrollment_id, assessment_name: 'Class Test 1', score: 27.5, max_score: 30.0, co_mapping: 'CO1' },
    { enrollment_id: e6.enrollment_id, assessment_name: 'Mid Semester Exam', score: 45.0, max_score: 50.0, co_mapping: 'CO1, CO2, CO3' }
  ];

  await Grade.bulkCreate(gradesData);
  console.log('Created grades records.');

  // 10. Create 10 Placement records
  const placementsData = [
    { department: 'CSE', batch_year: '2026', company: 'Infosys', package_lpa: 44.5, type: 'On Campus', students_placed: 3 },
    { department: 'CSE', batch_year: '2026', company: 'Google', package_lpa: 32.0, type: 'On Campus', students_placed: 2 },
    { department: 'CSE', batch_year: '2026', company: 'Amazon', package_lpa: 28.0, type: 'On Campus', students_placed: 4 },
    { department: 'CSE', batch_year: '2026', company: 'Microsoft', package_lpa: 35.0, type: 'On Campus', students_placed: 2 },
    { department: 'CSE', batch_year: '2026', company: 'Wipro', package_lpa: 6.5, type: 'On Campus', students_placed: 12 },
    { department: 'CSE', batch_year: '2026', company: 'TCS Digital', package_lpa: 7.0, type: 'On Campus', students_placed: 15 },
    { department: 'ECE', batch_year: '2026', company: 'Samsung', package_lpa: 18.0, type: 'On Campus', students_placed: 5 },
    { department: 'ECE', batch_year: '2026', company: 'Qualcomm', package_lpa: 22.0, type: 'On Campus', students_placed: 4 },
    { department: 'ME', batch_year: '2026', company: 'Tata Motors', package_lpa: 8.5, type: 'On Campus', students_placed: 8 },
    { department: 'CE', batch_year: '2026', company: 'L&T', package_lpa: 7.2, type: 'On Campus', students_placed: 7 }
  ];

  await Placement.bulkCreate(placementsData);
  console.log('Created 10 placement records.');

  // 11. Initialize System Settings
  await SystemSettings.bulkCreate([
    {
      setting_key: 'current_semester',
      setting_value: 'Autumn',
      description: 'Current active semester for enrollment and batch creation',
      updated_by: 'system',
      updated_at: new Date()
    },
    {
      setting_key: 'current_academic_year',
      setting_value: '2026',
      description: 'Current academic year',
      updated_by: 'system',
      updated_at: new Date()
    }
  ]);
  console.log('Initialized system settings (current_semester: Autumn, current_academic_year: 2026).');

  // 12. Create Timetable Slots (Weekly schedules for courses)
  const timetableData = [
    // CSBT302 - Database Systems Lab (MW schedule)
    { course_code: 'CSBT302', day_of_week: 'Monday', room_number: 'Lab-A', slot_type: 'Lab', is_active: true },
    { course_code: 'CSBT302', day_of_week: 'Wednesday', room_number: 'Lab-A', slot_type: 'Lab', is_active: true },
    
    // CSBT303 - Computer Networks (TTh schedule)
    { course_code: 'CSBT303', day_of_week: 'Tuesday', room_number: 'R201', slot_type: 'Lecture', is_active: true },
    { course_code: 'CSBT303', day_of_week: 'Thursday', room_number: 'R201', slot_type: 'Lecture', is_active: true },
    
    // CSBT304 - Operating Systems Lab (TF schedule)
    { course_code: 'CSBT304', day_of_week: 'Tuesday', room_number: 'Lab-B', slot_type: 'Lab', is_active: true },
    { course_code: 'CSBT304', day_of_week: 'Friday', room_number: 'Lab-B', slot_type: 'Lab', is_active: true },
    
    // CSBT305 - Software Engineering (MWF schedule)
    { course_code: 'CSBT305', day_of_week: 'Monday', room_number: 'R202', slot_type: 'Lecture', is_active: true },
    { course_code: 'CSBT305', day_of_week: 'Wednesday', room_number: 'R202', slot_type: 'Lecture', is_active: true },
    { course_code: 'CSBT305', day_of_week: 'Friday', room_number: 'R202', slot_type: 'Tutorial', is_active: true },
    
    // CSBT306 - Data Structures (MWF schedule)
    { course_code: 'CSBT306', day_of_week: 'Monday', room_number: 'R101', slot_type: 'Lecture', is_active: true },
    { course_code: 'CSBT306', day_of_week: 'Wednesday', room_number: 'R101', slot_type: 'Lecture', is_active: true },
    { course_code: 'CSBT306', day_of_week: 'Friday', room_number: 'R101', slot_type: 'Tutorial', is_active: true },
    
    // ECBT301 - Digital Signal Processing (TTh schedule)
    { course_code: 'ECBT301', day_of_week: 'Tuesday', room_number: 'R301', slot_type: 'Lecture', is_active: true },
    { course_code: 'ECBT301', day_of_week: 'Thursday', room_number: 'R301', slot_type: 'Lecture', is_active: true },
    
    // ECBT302 - Microprocessors (MWF schedule)
    { course_code: 'ECBT302', day_of_week: 'Monday', room_number: 'R302', slot_type: 'Lecture', is_active: true },
    { course_code: 'ECBT302', day_of_week: 'Wednesday', room_number: 'Lab-C', slot_type: 'Lab', is_active: true },
    { course_code: 'ECBT302', day_of_week: 'Friday', room_number: 'R302', slot_type: 'Tutorial', is_active: true },
    
    // MEBT301 - Thermodynamics (TTh schedule)
    { course_code: 'MEBT301', day_of_week: 'Tuesday', room_number: 'R401', slot_type: 'Lecture', is_active: true },
    { course_code: 'MEBT301', day_of_week: 'Thursday', room_number: 'R401', slot_type: 'Lecture', is_active: true },
    
    // CEBT301 - Structural Analysis (MWF schedule)
    { course_code: 'CEBT301', day_of_week: 'Monday', room_number: 'R501', slot_type: 'Lecture', is_active: true },
    { course_code: 'CEBT301', day_of_week: 'Wednesday', room_number: 'R501', slot_type: 'Lecture', is_active: true },
    { course_code: 'CEBT301', day_of_week: 'Friday', room_number: 'R501', slot_type: 'Tutorial', is_active: true }
  ];

  await TimetableSlot.bulkCreate(timetableData);
  console.log('Created timetable slots for all 9 courses (weekly schedules with rooms).');

  console.log('=== Database Seeding Completed Successfully! ===');
}

if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeder finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seeder failed with error:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
