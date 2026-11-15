# 🎓 CampusCore - Academic ERP System

> **A comprehensive web-based Enterprise Resource Planning (ERP) system for university management**

[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-Academic-purple.svg)](LICENSE)

CampusCore is a modern, cloud-based Academic ERP system that digitizes and streamlines university operations. Built with a three-tier architecture, it provides an integrated platform for students, professors, and administrators to manage academic activities including course enrollment, attendance tracking, assignment management, grading, timetable scheduling, and placement records.

---

## 📑 Table of Contents

- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#️-tech-stack)
- [Database Schema](#-database-schema)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Features

### 👨‍🎓 Student Portal
- **📚 Course Management**
  - Browse available courses by department and semester
  - Enroll in batches using unique 8-character class codes
  - View enrolled courses filtered by current semester
  - Access course materials (Notes, Assignments, PYQs)

- **📝 Assignment & Grading**
  - Submit assignments online with file upload
  - Track submission status and deadlines
  - View grades with detailed feedback
  - Calculate real-time CGPA across all courses

- **✅ Attendance Tracking**
  - View session-wise attendance records
  - Real-time attendance percentage calculation
  - Historical attendance logs per course

- **📅 Personal Timetable**
  - Weekly class schedule view
  - Room allocation and class types (Lecture/Lab/Tutorial)
  - Auto-generated from enrolled courses

- **📢 Communication**
  - Receive batch announcements from professors
  - Priority-based notifications (Low/Medium/High)

### 👨‍🏫 Professor Portal
- **📚 Batch Management**
  - Create and manage course batches
  - Generate unique class codes for enrollment
  - Configure enrollment modes (Open/Request/Invite-only)
  - Filter batches by current semester

- **✅ Attendance System**
  - Create new class sessions with topic tracking
  - Mark attendance (Present/Absent) in one action
  - View individual student attendance percentages
  - Historical session records

- **📝 Assignment & Grading**
  - Create assignments with due dates and point allocation
  - Upload course materials (Notes, PYQs)
  - Grade submissions with feedback
  - Track submission counts and grading progress

- **👥 Enrollment Management**
  - Review and approve enrollment requests
  - Add students directly to batches
  - View enrolled student lists with roll numbers

- **📊 Student Analytics**
  - View batch-wise performance metrics
  - Individual student progress tracking
  - Assignment completion rates

### 👨‍💼 Admin Portal
- **🏢 Course Catalog Management**
  - Create and manage courses (title, department, credits)
  - Schedule weekly timetables at course level
  - Set room numbers and class types for each day
  - Delete courses with cascade operations

- **👥 Student & Professor Registry**
  - View complete student directory with filters
  - Track student status (Active/Probation)
  - Monitor CGPA and backlogs
  - Manage professor profiles and departments

- **💼 Placement Tracking**
  - Record placement offers (company, package, role)
  - Track on-campus vs internship offers
  - View placement analytics (avg package, highest package)
  - Department-wise placement statistics

- **⚙️ System Configuration**
  - Set current semester (Autumn/Spring)
  - Configure academic year
  - System-wide semester filtering for students and professors

- **📈 Analytics Dashboard**
  - Total students, professors, and active courses
  - Active batches count
  - Department-wise performance metrics
  - Recent system activity feed

---

## 🏗️ System Architecture

CampusCore follows a **three-tier architecture** ensuring separation of concerns and scalability:

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│    (React Frontend - Port 5173)         │
│  • Student Portal                       │
│  • Professor Portal                     │
│  • Admin Portal                         │
│  • Landing Page                         │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS REST API
               │ JWT Bearer Tokens
┌──────────────▼──────────────────────────┐
│         APPLICATION LAYER               │
│   (Express.js Backend - Port 3000)      │
│  • JWT Authentication Service           │
│  • 16 RESTful API Modules               │
│  • Business Logic Layer                 │
│  • File Upload Service (Multer)         │
│  • Role-Based Access Control            │
└──────────────┬──────────────────────────┘
               │ TCP/IP Connection
               │ Sequelize ORM
┌──────────────▼──────────────────────────┐
│           DATA LAYER                    │
│  (MySQL Database - Railway Cloud)       │
│  • 15 Normalized Tables (3NF)           │
│  • Foreign Key Constraints              │
│  • Cascade Delete Operations            │
│  • Indexed Queries                      │
└─────────────────────────────────────────┘
```

### Key Architectural Decisions

1. **Three-Tier Architecture**: Separation of UI, business logic, and data storage for maintainability
2. **RESTful API**: Stateless communication with JWT tokens for scalability
3. **Cloud Database**: Railway MySQL for reliability and automated backups
4. **Component-Based Frontend**: React for reusable UI components
5. **ORM Pattern**: Sequelize for database abstraction and SQL injection prevention

---

## 🛠️ Tech Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | Component-based UI framework |
| **Vite** | Latest | Fast build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first styling framework |
| **React Router** | 6.x | Client-side routing and navigation |
| **Axios** | Latest | HTTP client for API communication |
| **Lucide React** | Latest | Modern icon library |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 16+ | JavaScript runtime environment |
| **Express.js** | 4.x | Web application framework |
| **Sequelize** | 6.x | Promise-based ORM for MySQL |
| **MySQL** | 8.0+ | Relational database management system |
| **JWT** | Latest | JSON Web Tokens for authentication |
| **bcrypt** | Latest | Password hashing and security |
| **Multer** | Latest | Multipart form data and file uploads |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Git** | Version control system |
| **VS Code** | Integrated development environment |
| **Postman** | API testing and documentation |
| **Railway** | Cloud database hosting |
| **npm** | Package management |

---

## 📊 Database Schema

CampusCore uses a **normalized relational database** with 15 tables following Third Normal Form (3NF):

### Core Entities

#### 1. Authentication & Users
- **users** - Base authentication (email, password_hash, role)
- **students** - Student profiles (roll_no, name, program, department, semester, cgpa, backlogs, status)
- **professors** - Professor profiles (prof_id, name, department, designation, phone)

#### 2. Academic Structure
- **courses** - Course catalog (course_code, title, department, credits)
- **batches** - Course instances (batch_id, course_code, prof_id, section, class_code, enrollment_mode, academic_year, semester, status)
- **enrollments** - Student-batch relationships (enrollment_id, batch_id, roll_no, status, request_date)

#### 3. Content & Assignments
- **course_materials** - Files and assignments (material_id, batch_id, title, type, file_url, due_date, total_points, topic)
- **submissions** - Student submissions (submission_id, material_id, enrollment_id, file_url, submission_date)
- **grades** - Assessment records (grade_id, enrollment_id, grade_type, points_scored, total_points, remarks)

#### 4. Attendance System
- **class_sessions** - Class meetings (session_id, batch_id, session_date, topic_covered)
- **attendance_logs** - Individual attendance (log_id, session_id, roll_no, status)

#### 5. Communication & Placement
- **announcements** - Batch notifications (announcement_id, batch_id, prof_id, content, priority)
- **placements** - Job offers (placement_id, roll_no, company_name, job_role, package, placement_date, offer_type)

#### 6. Configuration
- **system_settings** - System config (setting_key, setting_value, description, updated_at)
- **timetable_slots** - Weekly schedules (slot_id, course_code, day_of_week, room_number, slot_type, is_active)

### Key Relationships
```
User (1:1) Student/Professor
Course (1:N) Batch, TimetableSlot
Professor (1:N) Batch, Announcement
Batch (1:N) Enrollment, CourseMaterial, ClassSession, Announcement
Student (1:N) Enrollment, AttendanceLog, Placement
CourseMaterial (1:N) Submission
Enrollment (1:N) Submission, Grade
ClassSession (1:N) AttendanceLog
```

### Database Features
- ✅ Third Normal Form (3NF) normalization
- ✅ Foreign key constraints with CASCADE delete
- ✅ Unique constraints (email, roll_no, class_code, course_code + day_of_week)
- ✅ Indexed columns for frequent queries
- ✅ ENUM types for status fields
- ✅ Default values and NOT NULL constraints

---

## 📦 Installation

### Prerequisites

Ensure you have the following installed:
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MySQL** 8.0+ (local or cloud)
- **Git** ([Download](https://git-scm.com/))

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/campuscore.git
cd campuscore
```

### Step 2: Backend Setup

#### 2.1 Install Dependencies
```bash
cd server
npm install
```

#### 2.2 Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration (Railway Cloud)
DATABASE_URL=mysql://root:password@host:port/database
# OR individual fields:
DB_HOST=reseau.proxy.rlwy.net
DB_PORT=53716
DB_NAME=railway
DB_USER=root
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

**Security Note:** Change `JWT_SECRET` to a strong random string in production!

#### 2.3 Database Setup

**Option A: Using Railway Cloud (Recommended)**
1. Create a free Railway account at [railway.app](https://railway.app)
2. Create a new MySQL database
3. Copy the public connection details to your `.env`
4. Run the seeder:
```bash
node seeders/seed.js
```

**Option B: Local MySQL**
1. Create a database: `CREATE DATABASE campuscore;`
2. Update `.env` with local credentials
3. Run the seeder:
```bash
node seeders/seed.js
```

#### 2.4 Start Backend Server
```bash
npm start
```

Server will run on `http://localhost:3000` ✅

### Step 3: Frontend Setup

#### 3.1 Install Dependencies
```bash
cd ../client
npm install
```

#### 3.2 Configure Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

#### 3.3 Start Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:5173` ✅

### Step 4: Verify Installation

1. Open browser and navigate to `http://localhost:5173`
2. You should see the CampusCore landing page
3. Click "Login" and use demo credentials (see below)

---

## 🔑 Usage

### Default Login Credentials

After running the seeder script, use these demo accounts:

#### 👨‍💼 Admin Account
- **Email:** `admin@tezu.ac.in`
- **Password:** `demo123`
- **Access:** Full system administration

#### 👨‍🏫 Professor Account
- **Email:** `sroy@tezu.ac.in`
- **Password:** `demo123`
- **Access:** Batch management, grading, attendance

#### 👨‍🎓 Student Account
- **Email:** `csb24002@tezu.ac.in`
- **Password:** `demo123`
- **Access:** Course enrollment, assignments, grades

### Quick Start Guide

#### For Students:
1. Login with student credentials
2. Navigate to "My Courses" → Click "+ Join with Class Code"
3. Enter class code (e.g., `XK7P2M9Q` from seeded data)
4. Wait for professor approval (if required)
5. View course materials, submit assignments, check grades

#### For Professors:
1. Login with professor credentials
2. Click "Create Batch" to start a new course section
3. Share the auto-generated class code with students
4. Go to "Enrollments" to approve student requests
5. Use "Mark Attendance" to record class sessions
6. Grade assignments from the "Assignments" tab

#### For Admins:
1. Login with admin credentials
2. Navigate to "Courses" to manage course catalog
3. Click "Schedule" to set weekly timetables for courses
4. View "Students" and "Placements" for analytics
5. Update "System Settings" to configure current semester

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Modules (16 Total)

#### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login and get JWT token | ❌ |

#### 2. Students (`/api/students`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Get current student profile | ✅ |
| GET | `/me/courses` | Get enrolled courses (current semester) | ✅ |
| GET | `/me/stats` | Get dashboard statistics | ✅ |

#### 3. Professors (`/api/professors`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/me` | Get current professor profile | ✅ |
| GET | `/batches` | Get professor's batches | ✅ |

#### 4. Courses (`/api/courses`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all courses | ✅ |
| POST | `/` | Create new course | ✅ Admin |
| DELETE | `/:courseCode` | Delete course | ✅ Admin |

#### 5. Batches (`/api/batches`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/:batchId` | Get batch details | ✅ |
| POST | `/` | Create new batch | ✅ Professor |
| GET | `/:batchId/attendance` | Get attendance summary | ✅ |
| DELETE | `/:batchId` | Delete batch | ✅ Professor |

#### 6. Enrollments (`/api/enrollments`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Enroll in batch (class code) | ✅ Student |
| PUT | `/:enrollmentId` | Approve/reject enrollment | ✅ Professor |

#### 7. Materials (`/api/materials`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Upload course material | ✅ Professor |
| GET | `/:materialId/submissions` | Get submissions list | ✅ |

#### 8. Attendance (`/api/attendance`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/mark` | Create session + mark attendance | ✅ Professor |

#### 9. Timetable (`/api/timetable`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/courses/:courseCode/timetable` | Add timetable slots | ✅ Admin |
| GET | `/courses/:courseCode/timetable` | Get course timetable | ✅ |

#### 10. Settings (`/api/settings`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get system settings | ✅ |
| PUT | `/current-semester` | Update semester config | ✅ Admin |

#### 11-16. Other Modules
- **Submissions** (`/api/submissions`) - Assignment submission management
- **Grades** (`/api/grades`) - Grading operations
- **Sessions** (`/api/sessions`) - Class session records
- **Announcements** (`/api/announcements`) - Batch notifications
- **Placements** (`/api/placements`) - Placement tracking and analytics
- **Admin** (`/api/admin`) - Administrative operations

### Sample API Request

```javascript
// Login
const response = await axios.post('http://localhost:3000/api/auth/login', {
  email: 'csb24002@tezu.ac.in',
  password: 'demo123'
});

const token = response.data.token;

// Get student courses
const courses = await axios.get('http://localhost:3000/api/students/me/courses', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🚀 Deployment

### Database Deployment (Railway - Recommended)

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy MySQL Database**
   - Click "New Project" → "Provision MySQL"
   - Copy connection details from "Connect" tab
   - Use **Public Network** details (not mysql.railway.internal)

3. **Update Backend .env**
   ```env
   DATABASE_URL=mysql://root:password@reseau.proxy.rlwy.net:53716/railway
   ```

4. **Seed Database**
   ```bash
   cd server
   node seeders/seed.js
   ```

### Backend Deployment Options

#### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Render
1. Create account at [render.com](https://render.com)
2. Create new Web Service from GitHub repo
3. Set environment variables in dashboard
4. Deploy automatically on git push

#### Option 3: Heroku
```bash
heroku create campuscore-api
git push heroku main
heroku config:set JWT_SECRET=your_secret
```

### Frontend Deployment Options

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd client
npm run build
netlify deploy --prod
```

### Production Checklist

- [ ] Change `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up automated database backups
- [ ] Configure error logging (Sentry, LogRocket)
- [ ] Set up monitoring (UptimeRobot, Pingdom)
- [ ] Update `VITE_API_URL` to production backend URL

---

## 🧪 Testing

### Manual Testing

Use the provided test credentials to verify:

#### Authentication Tests
- ✅ Register new user with all three roles
- ✅ Login with valid credentials
- ✅ Login with invalid credentials (should fail)
- ✅ Token expiration after 7 days

#### Student Flow Tests
- ✅ Enroll in course with valid class code
- ✅ Enroll with invalid class code (should fail)
- ✅ Submit assignment before deadline
- ✅ View grades and CGPA calculation
- ✅ Check attendance percentage

#### Professor Flow Tests
- ✅ Create new batch with unique class code
- ✅ Mark attendance for enrolled students
- ✅ Grade student submissions
- ✅ Approve enrollment requests
- ✅ Post batch announcements

#### Admin Flow Tests
- ✅ Create course and schedule timetable
- ✅ View student registry with filters
- ✅ Update system settings (current semester)
- ✅ Track placement records

### API Testing with Postman

Import the Postman collection (coming soon) for automated API testing.

### Performance Benchmarks

Based on testing with 50 concurrent users:
- **Page Load Time:** < 1.2 seconds
- **API Response Time:** 250-400ms
- **Database Query Time:** < 100ms
- **File Upload (5MB):** 3-5 seconds

---

## 👥 Team

**Group 18 - Stage 3 Project**

| Name | Roll Number | Role | GitHub |
|------|-------------|------|--------|
| Ritom Saikia | CSB24002 | Full-Stack Developer | [@ritomsaikia](#) |
| Partha Pratim Das | CSB24007 | Backend Developer | [@parthadash](#) |
| Debankur Saikia | CSB24008 | Frontend Developer | [@debankur](#) |

**Institution:** Tezpur University  
**Department:** Computer Science and Engineering  
**Academic Year:** 2026

---

## 🤝 Contributing

We welcome contributions! This is an academic project, but external contributions are appreciated.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/campuscore.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add comments for complex logic

4. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Describe your changes
   - Reference any related issues
   - Wait for review

### Code Style Guidelines

- Use ES6+ JavaScript features
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable names
- Write JSDoc comments for functions
- Keep functions small and focused

---

## 📄 License

This project is developed for **academic purposes** as part of the Stage 3 Project at Tezpur University, Department of Computer Science and Engineering.

**© 2026 Group 18. All rights reserved.**

For academic use, research, and educational purposes only. Commercial use requires permission.

---

## 📧 Contact & Support

### For Queries:
- **Email:** campuscore.support@tezu.ac.in
- **GitHub Issues:** [Create an issue](https://github.com/your-username/campuscore/issues)

### Documentation:
- **Project Report:** [STAGE_III_PROJECT_REPORT.docx](./STAGE_III_PROJECT_REPORT.docx)
- **Setup Guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Demo Script:** [STAGE_II_DEMO_SCRIPT.md](./STAGE_II_DEMO_SCRIPT.md)

---

## 🎯 Future Roadmap

### Phase 1 (Short-term)
- [ ] Email/SMS notifications for enrollments and announcements
- [ ] Advanced analytics with Chart.js visualizations
- [ ] Bulk operations (CSV import for grades, enrollments)
- [ ] In-browser document preview for submissions
- [ ] Global search functionality

### Phase 2 (Mid-term)
- [ ] React Native mobile apps (iOS & Android)
- [ ] Real-time chat between professors and students
- [ ] Online quiz module with auto-grading
- [ ] Video conferencing integration (Zoom/Meet API)
- [ ] Calendar synchronization (Google Calendar, Outlook)

### Phase 3 (Long-term)
- [ ] AI-powered features (performance prediction, plagiarism detection)
- [ ] Learning Management System (LMS) with video lectures
- [ ] Fee payment gateway integration
- [ ] Library management integration
- [ ] Hostel and event management modules

---

## 🙏 Acknowledgments

Special thanks to:
- **Dr. Swarup Roy** - Project Guide
- **Department of CSE, Tezpur University** - Resources and support
- **Railway** - Free cloud database hosting
- **Open Source Community** - React, Node.js, and all dependencies

---

## ⭐ Star This Repository

If you find CampusCore helpful for your academic project or learning, please give it a star ⭐

**Built with ❤️ by Group 18 at Tezpur University**
