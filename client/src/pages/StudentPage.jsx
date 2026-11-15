import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Toast from '../components/common/Toast';
import MyCourses from '../components/student/MyCourses';
import BatchViewPage from '../components/student/BatchViewPage';
import Assignments from '../components/student/Assignments';
import Grades from '../components/student/Grades';
import Attendance from '../components/student/Attendance';
import Placements from '../components/student/Placements';
import Profile from '../components/student/Profile';
import Timetable from '../components/student/Timetable';

const StudentPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [studentProfile, setStudentProfile] = useState(null);
  
  const showToast = (message, type = 'info') => setToast({ visible: true, message, type });
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  // Fetch student profile for sidebar on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/students/me');
        setStudentProfile(response.data);
      } catch (error) {
        console.error('Error fetching student profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const studentName = studentProfile?.name || user?.name || 'Student';
  const studentRoll = studentProfile?.roll_no || user?.roll_no || user?.role_id || 'S-001';
  const studentProgram = studentProfile?.program || user?.program || 'B.Tech';
  const studentDept = studentProfile?.department || user?.department || 'Department';
  const studentCgpa = studentProfile?.cgpa ? Number(studentProfile.cgpa).toFixed(2) : '0.00';

  const initials = studentName
    .split(' ')
    .filter((n) => !n.includes('.'))
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST';

  const isActive = (path) => {
    if (path === '/student' || path === '/student/dashboard') {
      return location.pathname === '/student' || location.pathname === '/student/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/student/dashboard', label: 'Dashboard', icon: 'fa-th-large' },
    { path: '/student/courses', label: 'My Courses', icon: 'fa-book-open' },
    { path: '/student/timetable', label: 'Timetable', icon: 'fa-calendar-alt' },
    { path: '/student/assignments', label: 'Assignments', icon: 'fa-file-alt' },
    { path: '/student/grades', label: 'Grades', icon: 'fa-trophy' },
    { path: '/student/attendance', label: 'Attendance', icon: 'fa-calendar-check' },
    { path: '/student/placements', label: 'Placements', icon: 'fa-briefcase' },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-slate-900 text-slate-300 fixed h-full z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <i className="fas fa-graduation-cap text-base"></i>
            </div>
            <span className="text-xl font-bold tracking-tight">CampusCore</span>
          </Link>
        </div>

        {/* Student Profile */}
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-inner flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{studentName}</p>
            <p className="text-xs text-slate-400 truncate">{studentRoll}</p>
            <p className="text-[11px] text-slate-500 truncate">CGPA: {studentCgpa}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center ${active ? 'text-blue-400' : 'text-slate-400'}`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-30 sticky top-0 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-700 p-1"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              Student Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative hidden sm:block">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 w-56 text-sm outline-none transition"
              />
            </div>
            <button
              onClick={() => showToast('You have 3 pending assignments', 'info')}
              className="relative text-slate-500 hover:text-blue-600 transition-colors p-1"
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={() => navigate('/student/profile')}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {initials}
            </button>
          </div>
        </header>

        {/* Routes */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<StudentDashboard user={user} />} />
              <Route path="courses" element={<MyCourses />} />
              <Route path="batch/:batchId" element={<BatchViewPage />} />
              <Route path="timetable" element={<Timetable />} />
              <Route path="assignments" element={<Assignments />} />
              <Route path="grades" element={<Grades />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="placements" element={<Placements />} />
              <Route path="profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </main>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </div>
  );
};

// Simple Dashboard Component (inline for now)
const StudentDashboard = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cgpa: 0,
    enrolledCourses: 0,
    attendancePercentage: 0,
    assignmentsDue: 0
  });
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch student profile for name and CGPA
      const profileRes = await axios.get('/students/me');
      setStudentData(profileRes.data);
      
      // Fetch stats
      const statsRes = await axios.get('/students/me/stats');
      setStats({
        cgpa: statsRes.data.cgpa || 0,
        enrolledCourses: statsRes.data.enrolledCourses || 0,
        attendancePercentage: statsRes.data.attendancePercentage || 0,
        assignmentsDue: statsRes.data.assignmentsDue || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const studentName = studentData?.name || user?.name || 'Student';
  const studentCgpa = studentData?.cgpa ? Number(studentData.cgpa).toFixed(2) : '0.00';
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {studentName.split(' ')[0]}!</h1>
        <p className="text-blue-100">Here's your academic overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CGPA Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <i className="fas fa-star text-xl"></i>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{studentCgpa}</p>
          <p className="text-sm text-slate-500 mt-1">Current CGPA</p>
        </div>

        {/* Enrolled Courses Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <i className="fas fa-book-open text-xl"></i>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.enrolledCourses || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Enrolled Courses</p>
        </div>

        {/* Attendance Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <i className="fas fa-clipboard-check text-xl"></i>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.attendancePercentage || 0}%</p>
          <p className="text-sm text-slate-500 mt-1">Attendance</p>
        </div>

        {/* Assignments Due Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              <i className="fas fa-tasks text-xl"></i>
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.assignmentsDue || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Assignments Due</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/student/courses"
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center group"
          >
            <i className="fas fa-book-open text-3xl text-blue-600 mb-2"></i>
            <span className="block text-sm font-medium text-slate-700">View Courses</span>
          </Link>
          <Link
            to="/student/assignments"
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center group"
          >
            <i className="fas fa-file-alt text-3xl text-purple-600 mb-2"></i>
            <span className="block text-sm font-medium text-slate-700">Assignments</span>
          </Link>
          <Link
            to="/student/grades"
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center group"
          >
            <i className="fas fa-trophy text-3xl text-green-600 mb-2"></i>
            <span className="block text-sm font-medium text-slate-700">View Grades</span>
          </Link>
          <Link
            to="/student/attendance"
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center group"
          >
            <i className="fas fa-calendar text-3xl text-orange-600 mb-2"></i>
            <span className="block text-sm font-medium text-slate-700">Attendance</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <i className="fas fa-book"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">New course material uploaded</p>
              <p className="text-xs text-slate-500">Database Systems Lab • 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">Assignment graded</p>
              <p className="text-xs text-slate-500">Computer Networks • 5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <i className="fas fa-bell"></i>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-800">New assignment posted</p>
              <p className="text-xs text-slate-500">Operating Systems Lab • 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
