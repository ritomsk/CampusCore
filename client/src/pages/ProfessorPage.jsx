import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Dashboard from '../components/professor/Dashboard';
import MyBatches from '../components/professor/MyBatches';
import BatchDetailsPage from '../components/professor/BatchDetailsPage';
import Enrollments from '../components/professor/Enrollments';
import Attendance from '../components/professor/Attendance';
import AssignmentMgmt from '../components/professor/AssignmentMgmt';
import GradingPanel from '../components/professor/GradingPanel';
import Profile from '../components/professor/Profile';
import UpcomingSessions from '../components/professor/UpcomingSessions';
import Toast from '../components/common/Toast';

const ProfessorPage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [professorProfile, setProfessorProfile] = useState(null);
  
  const showToast = (message, type = 'info') => setToast({ visible: true, message, type });
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  // Fetch professor profile for sidebar on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/professors/me');
        setProfessorProfile(response.data);
      } catch (error) {
        console.error('Error fetching professor profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const profName = professorProfile?.name || user?.name || 'Professor';
  const profId = professorProfile?.prof_id || user?.prof_id || user?.role_id || 'P-001';
  const profDept = professorProfile?.department || user?.department || 'Department';

  // Generate initials from name without titles (Dr., Prof., etc.)
  const nameWithoutTitle = profName.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s*/i, '');
  const initials = nameWithoutTitle
    .split(' ')
    .filter((n) => n.length > 0)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'PR';

  const isActive = (path) => {
    if (path === '/professor' || path === '/professor/dashboard') {
      return location.pathname === '/professor' || location.pathname === '/professor/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/professor/dashboard', label: 'Dashboard', icon: 'fa-home' },
    { path: '/professor/batches', label: 'My Batches', icon: 'fa-layer-group' },
    { path: '/professor/upcoming-sessions', label: 'Upcoming Sessions', icon: 'fa-calendar-alt' },
    { path: '/professor/enrollments', label: 'Enrollments', icon: 'fa-user-check' },
    { path: '/professor/attendance', label: 'Attendance', icon: 'fa-clipboard-list' },
    { path: '/professor/assignments', label: 'Assignments', icon: 'fa-file-upload' },
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

        {/* Professor Profile */}
        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-inner flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{profName}</p>
            <p className="text-xs text-slate-400 truncate">{profId}</p>
            <p className="text-[11px] text-slate-500 truncate">{profDept}</p>
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
              Professor Dashboard
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
              onClick={() => showToast('You have 5 pending enrollment requests', 'info')}
              className="relative text-slate-500 hover:text-blue-600 transition-colors p-1"
            >
              <i className="fas fa-bell text-lg"></i>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button
              onClick={() => navigate('/professor/profile')}
              className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="batches" element={<MyBatches />} />
              <Route path="batches/:batchId" element={<BatchDetailsPage />} />
              <Route path="enrollments" element={<Enrollments />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="assignments" element={<AssignmentMgmt />} />
              <Route path="assignments/:assignmentId/grade" element={<GradingPanel />} />
              <Route path="upcoming-sessions" element={<UpcomingSessions />} />
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

export default ProfessorPage;
