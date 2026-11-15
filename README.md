# 🎓 CampusCore - Academic ERP System

A comprehensive Enterprise Resource Planning (ERP) system designed for university management, built with modern web technologies.

## 🌟 Features

### Student Portal
- 📚 Course enrollment with approval workflow
- 📝 Assignment submission and tracking
- 📊 Grade viewing and CGPA calculation
- 📅 Personal timetable view
- 📢 Batch announcements
- 👤 Profile management

### Professor Portal
- 👨‍🏫 Batch and course management
- ✅ Attendance marking with session tracking
- 📋 Assignment creation and grading
- 📎 Course material uploads (Notes, Assignments, PYQs)
- 📢 Announcement posting
- 📊 Student performance analytics

### Admin Portal
- 🏢 Department management
- 📖 Course catalog management
- 🗓️ Timetable scheduling (course-level)
- 👥 Student and professor registry
- 💼 Placement records tracking
- ⚙️ System settings (current semester configuration)
- 📈 Analytics dashboard

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** MySQL (Railway Cloud)
- **Authentication:** JWT (JSON Web Tokens)
- **File Upload:** Multer

### DevOps & Tools
- **Version Control:** Git & GitHub
- **Database Hosting:** Railway
- **Package Manager:** npm
- **Code Editor:** VS Code

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (local or Railway cloud)
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=your_database_host
DB_PORT=3306
DB_NAME=campuscore
DB_USER=your_username
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

4. Seed the database:
```bash
node seeders/seed.js
```

5. Start the server:
```bash
npm start
```

Server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔑 Default Login Credentials

After seeding the database, use these credentials:

### Admin
- **Email:** admin@tezu.ac.in
- **Password:** demo123

### Professor
- **Email:** sroy@tezu.ac.in
- **Password:** demo123

### Student
- **Email:** csb24002@tezu.ac.in
- **Password:** demo123

## 📊 Database Schema

The system includes 18 tables:
- Users, Students, Professors
- Courses, Batches, Enrollments
- Course Materials, Submissions, Grades
- Class Sessions, Attendance Logs
- Announcements, Placements
- System Settings, Timetable Slots

## 🚀 Deployment

### Railway (Recommended)
1. Create Railway account
2. Deploy MySQL database
3. Deploy Node.js backend
4. Update environment variables

### Frontend Deployment Options
- Vercel
- Netlify
- Render

## 📝 Features in Detail

### Enrollment Workflow
- Open enrollment with class codes
- Request-based enrollment with professor approval
- Invite-only batches

### Attendance System
- Session-based attendance marking
- Real-time attendance percentage calculation
- Historical attendance records

### Timetable Management
- Admin sets weekly schedules at course level
- All batches inherit course timetable
- Day-wise room allocation

### Assignment & Grading
- Multiple assignment types: Assignments, Notes, PYQs
- File upload support
- Grading with feedback
- Topic-wise organization

## 🤝 Contributing

This is an academic project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for academic purposes.

## 👥 Team

- **Developer:** [Your Name]
- **Institution:** Tezpur University
- **Year:** 2026

## 📧 Contact

For any queries, reach out at: your-email@example.com

---

⭐ Star this repo if you find it helpful!
