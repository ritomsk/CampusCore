import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import Toast from '../components/common/Toast';
import CourseCatalog from '../components/admin/CourseCatalog';

// System Settings Component
const SystemSettingsSection = () => {
  const [loading, setLoading] = useState(true);
  const [currentSemester, setCurrentSemester] = useState('');
  const [currentYear, setCurrentYear] = useState('');
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/settings/current-semester');
      setCurrentSemester(response.data.semester);
      setCurrentYear(response.data.academic_year);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ text: 'Failed to load settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSetting = async (key, value) => {
    try {
      setUpdating(true);
      await axios.put(`/settings/${key}`, { setting_value: value });
      setMessage({ text: 'Setting updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage({ 
        text: error.response?.data?.error || 'Failed to update setting', 
        type: 'error' 
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 
          'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Current Semester Configuration</h3>
        <p className="text-sm text-slate-600 mb-6">
          This setting controls the default semester shown to students and restricts professors to creating batches only in the current semester.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Semester Setting */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Current Semester
            </label>
            <select
              value={currentSemester}
              onChange={(e) => {
                setCurrentSemester(e.target.value);
                handleUpdateSetting('current_semester', e.target.value);
              }}
              disabled={updating}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="Autumn">Autumn</option>
              <option value="Spring">Spring</option>
            </select>
          </div>

          {/* Academic Year Setting */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Academic Year
            </label>
            <select
              value={currentYear}
              onChange={(e) => {
                setCurrentYear(e.target.value);
                handleUpdateSetting('current_academic_year', e.target.value);
              }}
              disabled={updating}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
            <div className="text-sm text-blue-800">
              <strong>Current Setting:</strong> {currentSemester} {currentYear}
              <br />
              <span className="text-xs">Professors can only create batches for this semester. Students will see this semester by default.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default initial data matching prototype
const initialStats = {
  totalStudents: 342,
  totalProfessors: 28,
  activeCourses: 45,
  activeBatches: 38,
  placementRate: 87,
  avgPackage: 12.8,
  totalPlaced: 298,
  highestPackage: 44.5,
  companiesCount: 42
};

const initialDeptPerformance = [
  { name: 'Computer Science (120)', percent: 92, color: 'bg-emerald-500', textColor: 'text-emerald-600', delay: '0s' },
  { name: 'Electronics (85)', percent: 78, color: 'bg-blue-500', textColor: 'text-blue-600', delay: '0.1s' },
  { name: 'Mechanical (72)', percent: 71, color: 'bg-amber-500', textColor: 'text-amber-500', delay: '0.2s' },
  { name: 'Civil (65)', percent: 68, color: 'bg-red-500', textColor: 'text-red-500', delay: '0.3s' },
];

const initialActivities = [
  { id: 1, icon: 'fa-user-plus', bg: 'bg-blue-50', textCol: 'text-blue-600', text: 'New student registered: Arun Patel', sub: '30 min ago' },
  { id: 2, icon: 'fa-layer-group', bg: 'bg-emerald-50', textCol: 'text-emerald-600', text: 'Batch created: B-2026-EC301 by Dr. Mehta', sub: '2 hours ago' },
  { id: 3, icon: 'fa-briefcase', bg: 'bg-purple-50', textCol: 'text-purple-600', text: 'Placement record added: Amazon, 28 LPA', sub: '5 hours ago' },
  { id: 4, icon: 'fa-book', bg: 'bg-amber-50', textCol: 'text-amber-600', text: 'Course catalog updated: 3 new courses', sub: 'Yesterday' }
];

const initialPlacements = [
  { id: 'PL-2026-01', dept: 'CSE', year: '2026', company: 'Infosys', packageLpa: 44.5, type: 'On Campus', placed: 4 },
  { id: 'PL-2026-02', dept: 'CSE', year: '2026', company: 'Google', packageLpa: 32.0, type: 'On Campus', placed: 2 },
  { id: 'PL-2026-03', dept: 'CSE', year: '2026', company: 'Amazon', packageLpa: 28.0, type: 'On Campus', placed: 5 },
  { id: 'PL-2026-04', dept: 'CSE', year: '2026', company: 'Microsoft', packageLpa: 35.0, type: 'On Campus', placed: 3 },
  { id: 'PL-2026-05', dept: 'CSE', year: '2026', company: 'Wipro', packageLpa: 6.5, type: 'On Campus', placed: 15 },
  { id: 'PL-2026-06', dept: 'CSE', year: '2026', company: 'TCS Digital', packageLpa: 7.0, type: 'On Campus', placed: 28 },
  { id: 'PL-2026-07', dept: 'ECE', year: '2026', company: 'Samsung', packageLpa: 18.0, type: 'On Campus', placed: 6 },
  { id: 'PL-2026-08', dept: 'ECE', year: '2026', company: 'Qualcomm', packageLpa: 22.0, type: 'On Campus', placed: 3 },
  { id: 'PL-2026-09', dept: 'ME', year: '2026', company: 'Tata Motors', packageLpa: 8.5, type: 'On Campus', placed: 12 },
  { id: 'PL-2026-10', dept: 'CE', year: '2026', company: 'L&T', packageLpa: 7.2, type: 'On Campus', placed: 8 },
];

const initialDepartments = [
  {
    code: 'CSE',
    name: 'Computer Science & Engineering',
    students: 120,
    faculty: 12,
    courses: 45,
    placementRate: 92,
    avgPackage: 15.2,
    borderCol: 'border-t-blue-500',
    rateCol: 'text-emerald-600',
    description: 'Leading department in software engineering, AI/ML, distributed systems, and core computing technologies.'
  },
  {
    code: 'ECE',
    name: 'Electronics & Communication',
    students: 85,
    faculty: 8,
    courses: 32,
    placementRate: 78,
    avgPackage: 11.5,
    borderCol: 'border-t-purple-500',
    rateCol: 'text-blue-600',
    description: 'Specializing in VLSI design, embedded systems, wireless communications, and signal processing.'
  },
  {
    code: 'ME',
    name: 'Mechanical Engineering',
    students: 72,
    faculty: 6,
    courses: 28,
    placementRate: 71,
    avgPackage: 9.8,
    borderCol: 'border-t-amber-500',
    rateCol: 'text-amber-600',
    description: 'Excellence in robotics, thermal sciences, automotive dynamics, and advanced materials engineering.'
  },
  {
    code: 'CE',
    name: 'Civil Engineering',
    students: 65,
    faculty: 5,
    courses: 25,
    placementRate: 68,
    avgPackage: 8.2,
    borderCol: 'border-t-emerald-500',
    rateCol: 'text-red-500',
    description: 'Pioneering structural infrastructure, environmental sustainability, GIS modeling, and geotechnical design.'
  }
];

const initialStudents = [
  { rollNo: 'CSB24002', name: 'Ritom Saikia', dept: 'CSE', sem: 4, cgpa: 9.05, backlogs: 0, status: 'Active' },
  { rollNo: 'CSB24007', name: 'Partha Pratim Das', dept: 'CSE', sem: 4, cgpa: 8.72, backlogs: 0, status: 'Active' },
  { rollNo: 'CSB24008', name: 'Debankur Saikia', dept: 'CSE', sem: 4, cgpa: 8.91, backlogs: 0, status: 'Active' },
  { rollNo: 'CSB24010', name: 'Rahul Kumar', dept: 'CSE', sem: 4, cgpa: 7.85, backlogs: 1, status: 'Active' },
  { rollNo: 'CSB24015', name: 'Priya Singh', dept: 'CSE', sem: 4, cgpa: 8.45, backlogs: 0, status: 'Active' },
  { rollNo: 'CSB24018', name: 'Vikram Singh', dept: 'CSE', sem: 4, cgpa: 7.23, backlogs: 2, status: 'Probation' },
  { rollNo: 'ECB24001', name: 'Ankit Patel', dept: 'ECE', sem: 4, cgpa: 8.12, backlogs: 0, status: 'Active' },
  { rollNo: 'ECB24005', name: 'Sneha Roy', dept: 'ECE', sem: 4, cgpa: 8.67, backlogs: 0, status: 'Active' },
  { rollNo: 'MEB24003', name: 'Rohit Verma', dept: 'ME', sem: 4, cgpa: 7.95, backlogs: 1, status: 'Active' },
  { rollNo: 'CEB24002', name: 'Deepak Nair', dept: 'CE', sem: 4, cgpa: 8.34, backlogs: 0, status: 'Active' },
];

const initialCourses = [
  { code: 'CSBT302', title: 'Database Systems Laboratory', dept: 'CSE', credits: 3, batches: 2, enrolled: 64 },
  { code: 'CSBT303', title: 'Computer Networks', dept: 'CSE', credits: 4, batches: 2, enrolled: 56 },
  { code: 'CSBT304', title: 'Operating Systems Lab', dept: 'CSE', credits: 3, batches: 1, enrolled: 32 },
  { code: 'CSBT305', title: 'Software Engineering', dept: 'CSE', credits: 3, batches: 1, enrolled: 30 },
  { code: 'CSBT306', title: 'Data Structures', dept: 'CSE', credits: 4, batches: 2, enrolled: 54 },
  { code: 'ECBT301', title: 'Digital Signal Processing', dept: 'ECE', credits: 3, batches: 1, enrolled: 28 },
  { code: 'ECBT302', title: 'VLSI Design', dept: 'ECE', credits: 4, batches: 1, enrolled: 25 },
  { code: 'MEBT301', title: 'Thermodynamics', dept: 'ME', credits: 3, batches: 1, enrolled: 24 },
  { code: 'CEBT301', title: 'Structural Analysis', dept: 'CE', credits: 4, batches: 1, enrolled: 22 },
];

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation state
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  // Main stats
  const [stats, setStats] = useState(initialStats);
  const [departments, setDepartments] = useState(initialDepartments);
  const [placements, setPlacements] = useState(initialPlacements);
  const [students, setStudents] = useState(initialStudents);
  const [courses, setCourses] = useState(initialCourses);

  // Global search input in header
  const [globalSearch, setGlobalSearch] = useState('');

  // Placements filters
  const [placementDeptFilter, setPlacementDeptFilter] = useState('All Departments');
  const [placementYearFilter, setPlacementYearFilter] = useState('All');
  const [placementTypeFilter, setPlacementTypeFilter] = useState('All Types');

  // Students filters & pagination
  const [studentSearch, setStudentSearch] = useState('');
  const [studentDeptFilter, setStudentDeptFilter] = useState('All Depts');
  const [studentSemFilter, setStudentSemFilter] = useState('All Semesters');
  const [studentCgpaFilter, setStudentCgpaFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Courses search
  const [courseSearch, setCourseSearch] = useState('');

  // Modals state
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState({
    code: '',
    name: '',
    students: '',
    faculty: '',
    courses: '',
    placementRate: '',
    avgPackage: '',
    description: ''
  });

  const [selectedDeptDetail, setSelectedDeptDetail] = useState(null);

  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [newCourseForm, setNewCourseForm] = useState({
    code: '',
    title: '',
    dept: 'CSE',
    credits: '3',
    batches: '1',
    enrolled: '0'
  });

  const [isAddPlacementModalOpen, setIsAddPlacementModalOpen] = useState(false);
  const [newPlacementForm, setNewPlacementForm] = useState({
    dept: 'CSE',
    year: '2026',
    company: '',
    packageLpa: '',
    type: 'On Campus',
    placed: '1'
  });

  const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);

  // Reports state
  const [reportFormats, setReportFormats] = useState({
    placement: 'PDF',
    attendance: 'PDF',
    academic: 'PDF',
    enrollment: 'PDF'
  });
  const [lastGenerated, setLastGenerated] = useState({
    placement: 'Today, 10:00 AM',
    attendance: 'Yesterday',
    academic: 'Sep 1, 2026',
    enrollment: 'Sep 15, 2026'
  });
  const [generatingReport, setGeneratingReport] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  // Fetch live stats from API if available
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await axios.get('/admin/stats');
        if (statsRes.data) {
          const d = statsRes.data;
          setStats(prev => ({
            ...prev,
            totalStudents: d.total_students ?? prev.totalStudents,
            totalProfessors: d.total_professors ?? prev.totalProfessors,
            activeCourses: d.total_courses ?? prev.activeCourses,
            activeBatches: d.total_batches ?? prev.activeBatches,
            placementRate: d.placement_rate ?? prev.placementRate,
            avgPackage: d.avg_package ?? prev.avgPackage,
            totalPlaced: d.total_placed ?? prev.totalPlaced
          }));
        }
      } catch (err) {
        // Backend offline or mock mode: rely gracefully on default prototype data
      }

      try {
        const deptRes = await axios.get('/admin/departments');
        if (deptRes.data && Array.isArray(deptRes.data) && deptRes.data.length > 0) {
          const borderColors = ['border-t-blue-500', 'border-t-purple-500', 'border-t-amber-500', 'border-t-emerald-500'];
          const rateColors = ['text-emerald-600', 'text-blue-600', 'text-amber-600', 'text-red-500'];
          const mappedDepts = deptRes.data.map((deptItem, idx) => ({
            code: deptItem.department,
            name: deptItem.department === 'CSE' ? 'Computer Science & Engineering' :
                  deptItem.department === 'ECE' ? 'Electronics & Communication' :
                  deptItem.department === 'ME' ? 'Mechanical Engineering' :
                  deptItem.department === 'CE' ? 'Civil Engineering' : `${deptItem.department} Department`,
            students: deptItem.students_count || 50,
            faculty: deptItem.faculty_count || 5,
            courses: deptItem.courses_count || 10,
            placementRate: Math.round(deptItem.placement_rate || 75),
            avgPackage: deptItem.avg_package || 10.5,
            borderCol: borderColors[idx % borderColors.length],
            rateCol: rateColors[idx % rateColors.length],
            description: `Academic and research department specializing in ${deptItem.department} studies and projects.`
          }));
          setDepartments(mappedDepts);
        }
      } catch (err) {
        // Fallback to initial prototype departments
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Section titles mapping
  const sectionTitles = {
    dashboard: 'Admin Overview',
    placements: 'Placements',
    departments: 'Departments',
    students: 'Students',
    courses: 'Courses',
    reports: 'Reports'
  };

  // Filtered Placements
  const filteredPlacements = placements.filter(item => {
    if (placementDeptFilter !== 'All Departments' && item.dept !== placementDeptFilter) return false;
    if (placementYearFilter !== 'All' && item.year !== placementYearFilter) return false;
    if (placementTypeFilter !== 'All Types' && item.type !== placementTypeFilter) return false;
    if (globalSearch && !item.company.toLowerCase().includes(globalSearch.toLowerCase()) && !item.id.toLowerCase().includes(globalSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Filtered Students
  const filteredStudents = students.filter(student => {
    const searchLower = (studentSearch || globalSearch).toLowerCase();
    if (searchLower) {
      const matchName = student.name.toLowerCase().includes(searchLower);
      const matchRoll = student.rollNo.toLowerCase().includes(searchLower);
      if (!matchName && !matchRoll) return false;
    }
    if (studentDeptFilter !== 'All Depts' && student.dept !== studentDeptFilter) return false;
    if (studentSemFilter !== 'All Semesters') {
      const semNum = parseInt(studentSemFilter.replace('Semester ', ''), 10);
      if (student.sem !== semNum) return false;
    }
    if (studentCgpaFilter === '> 8.0' && student.cgpa < 8.0) return false;
    if (studentCgpaFilter === '< 6.0' && student.cgpa >= 6.0) return false;
    return true;
  });

  // Filtered Courses
  const filteredCourses = courses.filter(c => {
    const query = (courseSearch || globalSearch).toLowerCase();
    if (!query) return true;
    return c.code.toLowerCase().includes(query) || c.title.toLowerCase().includes(query) || c.dept.toLowerCase().includes(query);
  });

  // Handle Add Department
  const handleAddDepartment = (e) => {
    e.preventDefault();
    if (!newDeptForm.code || !newDeptForm.name) {
      showToast('Department Code and Name are required.', 'error');
      return;
    }

    const newDept = {
      code: newDeptForm.code.toUpperCase(),
      name: newDeptForm.name,
      students: parseInt(newDeptForm.students, 10) || 0,
      faculty: parseInt(newDeptForm.faculty, 10) || 0,
      courses: parseInt(newDeptForm.courses, 10) || 0,
      placementRate: parseInt(newDeptForm.placementRate, 10) || 0,
      avgPackage: parseFloat(newDeptForm.avgPackage) || 0,
      borderCol: 'border-t-sky-500',
      rateCol: 'text-sky-600',
      description: newDeptForm.description || 'Newly added academic department.'
    };

    setDepartments(prev => [...prev, newDept]);
    setIsAddDeptModalOpen(false);
    setNewDeptForm({ code: '', name: '', students: '', faculty: '', courses: '', placementRate: '', avgPackage: '', description: '' });
    showToast(`Department ${newDept.code} created successfully!`, 'success');
  };

  // Handle Add Course
  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseForm.code || !newCourseForm.title) {
      showToast('Course code and title are required.', 'error');
      return;
    }

    const newCourse = {
      code: newCourseForm.code.toUpperCase(),
      title: newCourseForm.title,
      dept: newCourseForm.dept,
      credits: parseInt(newCourseForm.credits, 10) || 3,
      batches: parseInt(newCourseForm.batches, 10) || 1,
      enrolled: parseInt(newCourseForm.enrolled, 10) || 0
    };

    setCourses(prev => [newCourse, ...prev]);
    setIsAddCourseModalOpen(false);
    setNewCourseForm({ code: '', title: '', dept: 'CSE', credits: '3', batches: '1', enrolled: '0' });
    showToast(`Course ${newCourse.code} added to catalog!`, 'success');
  };

  // Handle Add Placement
  const handleAddPlacement = (e) => {
    e.preventDefault();
    if (!newPlacementForm.company || !newPlacementForm.packageLpa) {
      showToast('Company name and package are required.', 'error');
      return;
    }

    const nextId = `PL-2026-${String(placements.length + 1).padStart(2, '0')}`;
    const newRecord = {
      id: nextId,
      dept: newPlacementForm.dept,
      year: newPlacementForm.year,
      company: newPlacementForm.company,
      packageLpa: parseFloat(newPlacementForm.packageLpa) || 0,
      type: newPlacementForm.type,
      placed: parseInt(newPlacementForm.placed, 10) || 1
    };

    setPlacements(prev => [newRecord, ...prev]);
    setIsAddPlacementModalOpen(false);
    setNewPlacementForm({ dept: 'CSE', year: '2026', company: '', packageLpa: '', type: 'On Campus', placed: '1' });
    showToast(`Placement record for ${newRecord.company} created!`, 'success');
  };

  // Handle Report Generation
  const handleGenerateReport = (reportType, title) => {
    const format = reportFormats[reportType];
    setGeneratingReport(reportType);

    setTimeout(() => {
      setGeneratingReport(null);
      setLastGenerated(prev => ({
        ...prev,
        [reportType]: 'Just now'
      }));
      showToast(`${title} generated in ${format} format!`, 'success');
    }, 700);
  };

  const currentDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-slate-50 text-slate-800 flex h-screen overflow-hidden font-sans">
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-slate-900 text-slate-300 fixed h-full z-30 transition-transform duration-300 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 flex flex-col`}
      >
        <div className="p-6 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 text-white hover:text-blue-400 transition-colors">
            <i className="fas fa-graduation-cap text-3xl text-blue-500"></i>
            <span className="text-2xl font-bold tracking-tight">CampusCore</span>
          </Link>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-slate-700/50 mb-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{user?.name || 'System Admin'}</p>
            <p className="text-xs text-slate-400">Campus Administration</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge-high' },
            { id: 'placements', label: 'Placements', icon: 'fa-briefcase' },
            { id: 'departments', label: 'Departments', icon: 'fa-building' },
            { id: 'students', label: 'Students', icon: 'fa-users' },
            { id: 'courses', label: 'Courses', icon: 'fa-book' },
            { id: 'reports', label: 'Reports', icon: 'fa-file-export' },
            { id: 'settings', label: 'Settings', icon: 'fa-cog' },
          ].map(item => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500 font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-center`}></i>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-700/50 space-y-1">
          <button
            onClick={() => showToast('Settings saved to local administration cache.', 'info')}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors text-left"
          >
            <i className="fas fa-gear w-5 text-center"></i>
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors text-left"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10 sticky top-0 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-slate-500 hover:text-slate-700 focus:outline-none"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
              {sectionTitles[activeSection]}
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search system..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 w-64 text-sm transition-shadow"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
            <button
              onClick={() => showToast('All system logs and university cron monitors are healthy.', 'info')}
              className="relative text-slate-500 hover:text-blue-600 transition-colors p-1"
            >
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute 0 top-0.5 right-0.5 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white"></span>
            </button>
            <div
              onClick={() => setActiveSection('dashboard')}
              title="Campus Administration"
              className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer hover:opacity-90"
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* SECTION: Dashboard */}
            {activeSection === 'dashboard' && (
              <div className="animate-fade-in space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Admin Overview</h2>
                    <p className="text-slate-500 mt-1">{currentDateString}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        showToast('System synced with MySQL server database.', 'success');
                      }}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-sm text-slate-600 font-medium flex items-center gap-2 transition-colors"
                    >
                      <i className="fas fa-rotate text-xs"></i> Sync Status
                    </button>
                  </div>
                </div>

                {/* 6 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Total Students */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Students</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.totalStudents}</h3>
                        <p className="text-xs text-emerald-600 mt-1"><i className="fas fa-arrow-up mr-1"></i> +12% from last year</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <i className="fas fa-users text-xl"></i>
                      </div>
                    </div>
                  </div>

                  {/* Total Professors */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Total Professors</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.totalProfessors}</h3>
                        <p className="text-xs text-purple-600 mt-1"><i className="fas fa-check-circle mr-1"></i> All departments staffed</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                        <i className="fas fa-chalkboard-teacher text-xl"></i>
                      </div>
                    </div>
                  </div>

                  {/* Active Courses */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Active Courses</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.activeCourses}</h3>
                        <p className="text-xs text-emerald-600 mt-1"><i className="fas fa-book-open mr-1"></i> Spring Semester 2026</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <i className="fas fa-book text-xl"></i>
                      </div>
                    </div>
                  </div>

                  {/* Active Batches */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Active Batches</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2">{stats.activeBatches}</h3>
                        <p className="text-xs text-amber-600 mt-1"><i className="fas fa-calendar-alt mr-1"></i> 4 Batches scheduled today</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                        <i className="fas fa-layer-group text-xl"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2 Side-by-Side Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Department Performance */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-slate-800">Department Performance (Placements)</h3>
                      <button
                        onClick={() => setActiveSection('departments')}
                        className="text-xs text-blue-600 hover:underline font-medium"
                      >
                        All Departments &rarr;
                      </button>
                    </div>
                    <div className="space-y-5">
                      {initialDeptPerformance.map((dept, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-700">{dept.name}</span>
                            <span className={`font-bold ${dept.textColor}`}>{dept.percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`${dept.color} h-2.5 rounded-full transition-all duration-1000`}
                              style={{ width: `${dept.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-semibold text-slate-800">Recent System Activity</h3>
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-medium">
                        Live Feed
                      </span>
                    </div>
                    <div className="space-y-5">
                      {initialActivities.map(act => (
                        <div key={act.id} className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-full ${act.bg} flex items-center justify-center ${act.textCol} shrink-0 shadow-sm`}>
                            <i className={`fas ${act.icon}`}></i>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800">{act.text}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{act.sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: Placements */}
            {activeSection === 'placements' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">Placement Records</h2>
                  <button
                    onClick={() => setIsAddPlacementModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                  >
                    <i className="fas fa-plus text-xs"></i> Add Placement Record
                  </button>
                </div>

                {/* 4 KPI summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider mb-1">Total Placed</p>
                    <h4 className="text-2xl font-bold text-blue-900">{stats.totalPlaced}</h4>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider mb-1">Average Package</p>
                    <h4 className="text-2xl font-bold text-emerald-900">{stats.avgPackage} <span className="text-sm font-normal">LPA</span></h4>
                  </div>
                  <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wider mb-1">Highest Package</p>
                    <h4 className="text-2xl font-bold text-purple-900">{stats.highestPackage} <span className="text-sm font-normal">LPA</span></h4>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1">Companies</p>
                    <h4 className="text-2xl font-bold text-amber-900">{stats.companiesCount}</h4>
                  </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                      <select
                        value={placementDeptFilter}
                        onChange={(e) => setPlacementDeptFilter(e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm bg-white"
                      >
                        <option>All Departments</option>
                        <option>CSE</option>
                        <option>ECE</option>
                        <option>ME</option>
                        <option>CE</option>
                      </select>
                      <select
                        value={placementYearFilter}
                        onChange={(e) => setPlacementYearFilter(e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm bg-white"
                      >
                        <option value="All">All Years</option>
                        <option value="2026">Batch 2026</option>
                        <option value="2025">Batch 2025</option>
                        <option value="2024">Batch 2024</option>
                      </select>
                      <select
                        value={placementTypeFilter}
                        onChange={(e) => setPlacementTypeFilter(e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-1.5 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm bg-white"
                      >
                        <option>All Types</option>
                        <option>On Campus</option>
                        <option>Off Campus</option>
                      </select>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Showing {filteredPlacements.length} of {placements.length} records
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-white border-b border-slate-100 text-slate-500">
                        <tr>
                          <th className="px-6 py-4 font-medium">ID</th>
                          <th className="px-6 py-4 font-medium">Department</th>
                          <th className="px-6 py-4 font-medium">Year</th>
                          <th className="px-6 py-4 font-medium">Company</th>
                          <th className="px-6 py-4 font-medium">Package (LPA)</th>
                          <th className="px-6 py-4 font-medium">Type</th>
                          <th className="px-6 py-4 font-medium text-right">Placed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredPlacements.map(record => (
                          <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-3 text-slate-500">{record.id}</td>
                            <td className="px-6 py-3 font-bold text-slate-700">{record.dept}</td>
                            <td className="px-6 py-3 text-slate-600">{record.year}</td>
                            <td className="px-6 py-3 font-medium text-slate-800">{record.company}</td>
                            <td className="px-6 py-3 font-bold text-emerald-600">{Number(record.packageLpa).toFixed(1)}</td>
                            <td className="px-6 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                                record.type === 'On Campus' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {record.type}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-right font-medium">{record.placed}</td>
                          </tr>
                        ))}
                        {filteredPlacements.length === 0 && (
                          <tr>
                            <td colSpan="7" className="text-center py-8 text-slate-500">
                              No placement records match the current filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Package Distribution Bars */}
                  <div className="p-6 border-t border-slate-100 bg-white">
                    <h3 className="font-semibold text-slate-800 mb-4">Package Distribution</h3>
                    <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-slate-600 text-right">0-5 LPA</div>
                        <div className="flex-1 bg-slate-100 rounded-sm h-4 overflow-hidden">
                          <div className="bg-red-400 h-full rounded-sm" style={{ width: '5%' }}></div>
                        </div>
                        <div className="w-16 text-sm font-medium text-slate-800">15 <span className="text-xs text-slate-500 font-normal">sts</span></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-slate-600 text-right">5-10 LPA</div>
                        <div className="flex-1 bg-slate-100 rounded-sm h-4 overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-sm" style={{ width: '40%' }}></div>
                        </div>
                        <div className="w-16 text-sm font-medium text-slate-800">120 <span className="text-xs text-slate-500 font-normal">sts</span></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-slate-600 text-right">10-20 LPA</div>
                        <div className="flex-1 bg-slate-100 rounded-sm h-4 overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-sm" style={{ width: '28%' }}></div>
                        </div>
                        <div className="w-16 text-sm font-medium text-slate-800">85 <span className="text-xs text-slate-500 font-normal">sts</span></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-slate-600 text-right">20-30 LPA</div>
                        <div className="flex-1 bg-slate-100 rounded-sm h-4 overflow-hidden">
                          <div className="bg-blue-400 h-full rounded-sm" style={{ width: '15%' }}></div>
                        </div>
                        <div className="w-16 text-sm font-medium text-slate-800">45 <span className="text-xs text-slate-500 font-normal">sts</span></div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-20 text-sm text-slate-600 text-right">30+ LPA</div>
                        <div className="flex-1 bg-slate-100 rounded-sm h-4 overflow-hidden">
                          <div className="bg-purple-500 h-full rounded-sm" style={{ width: '11%' }}></div>
                        </div>
                        <div className="w-16 text-sm font-medium text-slate-800">33 <span className="text-xs text-slate-500 font-normal">sts</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: Departments */}
            {activeSection === 'departments' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-800">Departments</h2>
                  <button
                    onClick={() => setIsAddDeptModalOpen(true)}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                  >
                    <i className="fas fa-plus text-xs"></i> Add Department
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {departments.map((dept, index) => (
                    <div
                      key={dept.code || index}
                      className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden border-t-4 ${dept.borderCol} hover:shadow-md transition-all`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-slate-800">{dept.name}</h3>
                          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {dept.code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-5">{dept.description}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">Students</p>
                            <p className="text-lg font-bold text-slate-800">{dept.students}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">Faculty</p>
                            <p className="text-lg font-bold text-slate-800">{dept.faculty}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">Courses</p>
                            <p className="text-lg font-bold text-slate-800">{dept.courses}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">Placement</p>
                            <p className={`text-lg font-bold ${dept.rateCol}`}>{dept.placementRate}%</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-4">
                          <span className="text-slate-500">
                            Avg Package: <span className="font-bold text-slate-800">{dept.avgPackage} LPA</span>
                          </span>
                          <button
                            onClick={() => setSelectedDeptDetail(dept)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm"
                          >
                            View Details &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION: Students */}
            {activeSection === 'students' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>
                  <div className="text-sm text-slate-500">
                    Showing {filteredStudents.length} of 342 students
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-4 items-center justify-between">
                    <div className="relative flex-1 min-w-[200px]">
                      <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Search by name or roll number..."
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm bg-white"
                      />
                      {studentSearch && (
                        <button
                          onClick={() => setStudentSearch('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={studentDeptFilter}
                        onChange={(e) => setStudentDeptFilter(e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-2 text-sm shadow-sm bg-white focus:ring-blue-500"
                      >
                        <option>All Depts</option>
                        <option>CSE</option>
                        <option>ECE</option>
                        <option>ME</option>
                        <option>CE</option>
                      </select>
                      <select
                        value={studentSemFilter}
                        onChange={(e) => setStudentSemFilter(e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-2 text-sm shadow-sm bg-white focus:ring-blue-500"
                      >
                        <option>All Semesters</option>
                        <option>Semester 4</option>
                        <option>Semester 6</option>
                        <option>Semester 8</option>
                      </select>
                      <select
                        value={studentCgpaFilter}
                        onChange={(e) => setStudentCgpaFilter(e.target.value)}
                        className="border border-slate-300 rounded-md px-3 py-2 text-sm shadow-sm bg-white focus:ring-blue-500"
                      >
                        <option>CGPA: All</option>
                        <option>&gt; 8.0</option>
                        <option>&lt; 6.0</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-white border-b border-slate-100 text-slate-500">
                        <tr>
                          <th className="px-6 py-4 font-medium">Roll No</th>
                          <th className="px-6 py-4 font-medium">Name</th>
                          <th className="px-6 py-4 font-medium">Department</th>
                          <th className="px-6 py-4 font-medium">Semester</th>
                          <th className="px-6 py-4 font-medium">CGPA</th>
                          <th className="px-6 py-4 font-medium">Backlogs</th>
                          <th className="px-6 py-4 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.map((st) => (
                          <tr
                            key={st.rollNo}
                            onClick={() => setSelectedStudentDetail(st)}
                            className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                              st.status === 'Probation' ? 'bg-amber-50/30' : ''
                            }`}
                          >
                            <td className="px-6 py-3 text-slate-600 font-mono font-medium">{st.rollNo}</td>
                            <td className="px-6 py-3 font-bold text-slate-800">{st.name}</td>
                            <td className="px-6 py-3 text-slate-600">{st.dept}</td>
                            <td className="px-6 py-3 text-slate-600">{st.sem}</td>
                            <td className={`px-6 py-3 font-bold ${st.cgpa >= 8.0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                              {st.cgpa.toFixed(2)}
                            </td>
                            <td className={`px-6 py-3 font-medium ${st.backlogs > 0 ? (st.backlogs > 1 ? 'text-red-500' : 'text-amber-600') : 'text-slate-500'}`}>
                              {st.backlogs}
                            </td>
                            <td className="px-6 py-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                st.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {st.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                          <tr>
                            <td colSpan="7" className="text-center py-8 text-slate-500">
                              No students found matching current criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600">
                    <div>Showing 1-{filteredStudents.length} of 342</div>
                    <div className="flex gap-1 items-center">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 text-xs font-medium"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(1)}
                        className={`px-3 py-1 border rounded text-xs font-medium ${
                          currentPage === 1 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        1
                      </button>
                      <button
                        onClick={() => setCurrentPage(2)}
                        className={`px-3 py-1 border rounded text-xs font-medium ${
                          currentPage === 2 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        2
                      </button>
                      <button
                        onClick={() => setCurrentPage(3)}
                        className={`px-3 py-1 border rounded text-xs font-medium ${
                          currentPage === 3 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        3
                      </button>
                      <span className="px-2 py-1 text-xs text-slate-400">...</span>
                      <button
                        onClick={() => setCurrentPage(35)}
                        className={`px-3 py-1 border rounded text-xs font-medium ${
                          currentPage === 35 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        35
                      </button>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(35, p + 1))}
                        disabled={currentPage === 35}
                        className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 text-xs font-medium"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION: Courses */}
            {activeSection === 'courses' && (
              <CourseCatalog />
            )}

            {/* SECTION: Reports */}
            {activeSection === 'reports' && (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-slate-800">System Reports</h2>
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    Compliance & Accreditation Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Placement Report */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">
                    <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600 absolute top-0 left-0 right-0"></div>
                    <div className="p-6 pt-8 flex-1 flex flex-col">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-xl mb-4">
                        <i className="fas fa-briefcase"></i>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Placement Report</h3>
                      <p className="text-sm text-slate-500 mb-6 h-10">
                        Generate department-wise placement summary with package analytics.
                      </p>

                      <div className="bg-slate-50 p-1 rounded-lg inline-flex mb-6 w-full border border-slate-200">
                        {['PDF', 'CSV', 'Excel'].map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setReportFormats(prev => ({ ...prev, placement: fmt }))}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                              reportFormats.placement === fmt
                                ? 'text-slate-800 bg-white shadow-sm font-bold'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400">
                          Last generated: {lastGenerated.placement}
                        </span>
                        <button
                          onClick={() => handleGenerateReport('placement', 'Placement Report')}
                          disabled={generatingReport === 'placement'}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                        >
                          {generatingReport === 'placement' ? (
                            <>
                              <i className="fas fa-spinner fa-spin text-xs"></i> Generating...
                            </>
                          ) : (
                            'Generate Report'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Report */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">
                    <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 absolute top-0 left-0 right-0"></div>
                    <div className="p-6 pt-8 flex-1 flex flex-col">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center text-xl mb-4">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Attendance Report</h3>
                      <p className="text-sm text-slate-500 mb-6 h-10">
                        Generate course-wise attendance analytics with trends.
                      </p>

                      <div className="bg-slate-50 p-1 rounded-lg inline-flex mb-6 w-full border border-slate-200">
                        {['PDF', 'CSV', 'Excel'].map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setReportFormats(prev => ({ ...prev, attendance: fmt }))}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                              reportFormats.attendance === fmt
                                ? 'text-slate-800 bg-white shadow-sm font-bold'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400">
                          Last generated: {lastGenerated.attendance}
                        </span>
                        <button
                          onClick={() => handleGenerateReport('attendance', 'Attendance Report')}
                          disabled={generatingReport === 'attendance'}
                          className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                        >
                          {generatingReport === 'attendance' ? (
                            <>
                              <i className="fas fa-spinner fa-spin text-xs"></i> Generating...
                            </>
                          ) : (
                            'Generate Report'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Academic Performance */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">
                    <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600 absolute top-0 left-0 right-0"></div>
                    <div className="p-6 pt-8 flex-1 flex flex-col">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-xl mb-4">
                        <i className="fas fa-trophy"></i>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Academic Performance</h3>
                      <p className="text-sm text-slate-500 mb-6 h-10">
                        Generate CGPA distribution and grade analytics report.
                      </p>

                      <div className="bg-slate-50 p-1 rounded-lg inline-flex mb-6 w-full border border-slate-200">
                        {['PDF', 'CSV', 'Excel'].map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setReportFormats(prev => ({ ...prev, academic: fmt }))}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                              reportFormats.academic === fmt
                                ? 'text-slate-800 bg-white shadow-sm font-bold'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400">
                          Last generated: {lastGenerated.academic}
                        </span>
                        <button
                          onClick={() => handleGenerateReport('academic', 'Academic Performance Report')}
                          disabled={generatingReport === 'academic'}
                          className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                        >
                          {generatingReport === 'academic' ? (
                            <>
                              <i className="fas fa-spinner fa-spin text-xs"></i> Generating...
                            </>
                          ) : (
                            'Generate Report'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Statistics */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative flex flex-col">
                    <div className="h-2 bg-gradient-to-r from-purple-400 to-purple-600 absolute top-0 left-0 right-0"></div>
                    <div className="p-6 pt-8 flex-1 flex flex-col">
                      <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center text-xl mb-4">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">Enrollment Statistics</h3>
                      <p className="text-sm text-slate-500 mb-6 h-10">
                        Generate semester-wise enrollment trends and approval rates.
                      </p>

                      <div className="bg-slate-50 p-1 rounded-lg inline-flex mb-6 w-full border border-slate-200">
                        {['PDF', 'CSV', 'Excel'].map(fmt => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={() => setReportFormats(prev => ({ ...prev, enrollment: fmt }))}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                              reportFormats.enrollment === fmt
                                ? 'text-slate-800 bg-white shadow-sm font-bold'
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-400">
                          Last generated: {lastGenerated.enrollment}
                        </span>
                        <button
                          onClick={() => handleGenerateReport('enrollment', 'Enrollment Statistics Report')}
                          disabled={generatingReport === 'enrollment'}
                          className="bg-slate-800 hover:bg-slate-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                        >
                          {generatingReport === 'enrollment' ? (
                            <>
                              <i className="fas fa-spinner fa-spin text-xs"></i> Generating...
                            </>
                          ) : (
                            'Generate Report'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            )}

            {/* SECTION: Settings */}
            {activeSection === 'settings' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
                
                <SystemSettingsSection />
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Modal: Add Department */}
      {isAddDeptModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Add New Department</h3>
              <button
                onClick={() => setIsAddDeptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI"
                    value={newDeptForm.code}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Artificial Intelligence"
                    value={newDeptForm.name}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Students Count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="60"
                    value={newDeptForm.students}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, students: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Faculty Count</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="6"
                    value={newDeptForm.faculty}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, faculty: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Placement Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="85"
                    value={newDeptForm.placementRate}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, placementRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Avg Package (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="14.0"
                    value={newDeptForm.avgPackage}
                    onChange={(e) => setNewDeptForm({ ...newDeptForm, avgPackage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Description / Focus Areas</label>
                <textarea
                  rows="2"
                  placeholder="Specialization in machine learning, deep neural nets, and robotics..."
                  value={newDeptForm.description}
                  onChange={(e) => setNewDeptForm({ ...newDeptForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddDeptModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Department Details */}
      {selectedDeptDetail && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded mr-2">
                  {selectedDeptDetail.code}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mt-1">{selectedDeptDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDeptDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {selectedDeptDetail.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">Total Enrolled</span>
                <p className="text-2xl font-bold text-slate-800 mt-1">{selectedDeptDetail.students}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">Professors & Mentors</span>
                <p className="text-2xl font-bold text-slate-800 mt-1">{selectedDeptDetail.faculty}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">Placement Rate</span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{selectedDeptDetail.placementRate}%</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-500">Average Salary</span>
                <p className="text-2xl font-bold text-purple-600 mt-1">{selectedDeptDetail.avgPackage} LPA</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedDeptDetail(null);
                  setActiveSection('students');
                  setStudentDeptFilter(selectedDeptDetail.code);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                View {selectedDeptDetail.code} Students
              </button>
              <button
                onClick={() => setSelectedDeptDetail(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Course */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Add New Course</h3>
              <button
                onClick={() => setIsAddCourseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CSBT307"
                    value={newCourseForm.code}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                  <select
                    value={newCourseForm.dept}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, dept: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option>CSE</option>
                    <option>ECE</option>
                    <option>ME</option>
                    <option>CE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  value={newCourseForm.title}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    placeholder="3"
                    value={newCourseForm.credits}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, credits: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Initial Batches</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={newCourseForm.batches}
                    onChange={(e) => setNewCourseForm({ ...newCourseForm, batches: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Placement */}
      {isAddPlacementModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Add Placement Record</h3>
              <button
                onClick={() => setIsAddPlacementModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleAddPlacement} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                  <select
                    value={newPlacementForm.dept}
                    onChange={(e) => setNewPlacementForm({ ...newPlacementForm, dept: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option>CSE</option>
                    <option>ECE</option>
                    <option>ME</option>
                    <option>CE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={newPlacementForm.year}
                    onChange={(e) => setNewPlacementForm({ ...newPlacementForm, year: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adobe, Oracle, Cisco"
                  value={newPlacementForm.company}
                  onChange={(e) => setNewPlacementForm({ ...newPlacementForm, company: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Package (LPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    required
                    placeholder="24.5"
                    value={newPlacementForm.packageLpa}
                    onChange={(e) => setNewPlacementForm({ ...newPlacementForm, packageLpa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Drive Type</label>
                  <select
                    value={newPlacementForm.type}
                    onChange={(e) => setNewPlacementForm({ ...newPlacementForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option>On Campus</option>
                    <option>Off Campus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Students Placed</label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="2"
                    value={newPlacementForm.placed}
                    onChange={(e) => setNewPlacementForm({ ...newPlacementForm, placed: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddPlacementModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Student Detail */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedStudentDetail.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedStudentDetail.name}</h3>
                  <p className="text-xs font-mono text-slate-500">{selectedStudentDetail.rollNo}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-800">{selectedStudentDetail.dept}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Current Semester</span>
                <span className="font-semibold text-slate-800">Semester {selectedStudentDetail.sem}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Cumulative GPA</span>
                <span className="font-bold text-emerald-600">{selectedStudentDetail.cgpa.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Active Backlogs</span>
                <span className={`font-semibold ${selectedStudentDetail.backlogs > 0 ? 'text-red-500' : 'text-slate-700'}`}>
                  {selectedStudentDetail.backlogs}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Academic Standing</span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  selectedStudentDetail.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedStudentDetail.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  showToast(`Student transcript requested for ${selectedStudentDetail.rollNo}.`, 'info');
                  setSelectedStudentDetail(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Download Dossier
              </button>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
