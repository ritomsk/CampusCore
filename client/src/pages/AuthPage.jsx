import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [view, setView] = useState('login'); // 'login' | 'register'
  const [currentRole, setCurrentRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
  };
  const hideToast = () => setToast((prev) => ({ ...prev, visible: false }));

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Register form state
  const [regData, setRegData] = useState({
    role: 'student',
    name: '',
    rollNo: '',
    department: '',
    program: 'B.Tech',
    semester: 4,
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Demo accounts
  const demoAccounts = {
    student: { email: 'csb24002@tezu.ac.in', password: 'demo123' },
    professor: { email: 'sroy@tezu.ac.in', password: 'demo123' },
    admin: { email: 'admin@tezu.ac.in', password: 'demo123' },
  };

  const handleFillDemo = (roleKey) => {
    setCurrentRole(roleKey);
    setLoginData((prev) => ({
      ...prev,
      email: demoAccounts[roleKey].email,
      password: demoAccounts[roleKey].password,
    }));
    showToast(`Filled demo credentials for ${roleKey.charAt(0).toUpperCase() + roleKey.slice(1)}`, 'info');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedRole = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
    const res = await login(loginData.email, loginData.password, formattedRole);

    if (res.success) {
      showToast('Authentication successful! Redirecting...', 'success');
      setTimeout(() => {
        navigate(`/${currentRole}`);
      }, 700);
    } else {
      setLoading(false);
      showToast(res.error || 'Authentication failed. Please check credentials.', 'error');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (regData.password !== regData.confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }

    if (regData.password.length < 6) {
      showToast('Password must be at least 6 characters!', 'error');
      return;
    }

    setLoading(true);

    const formattedRole = regData.role.charAt(0).toUpperCase() + regData.role.slice(1);
    const payload = {
      email: regData.email,
      password: regData.password,
      role: formattedRole,
      name: regData.name,
      department: regData.department || 'Computer Science & Engineering',
    };

    if (formattedRole === 'Student') {
      payload.rollNo = regData.rollNo || 'CSB24002';
      payload.program = regData.program || 'B.Tech';
      payload.semester = Number(regData.semester) || 4;
    } else if (formattedRole === 'Professor') {
      payload.profId = regData.rollNo || 'P-002';
    }

    const res = await register(payload);
    setLoading(false);

    if (res.success) {
      showToast('Account created successfully! Please sign in.', 'success');
      setCurrentRole(regData.role);
      setLoginData({ email: regData.email, password: regData.password, rememberMe: false });
      setTimeout(() => {
        setView('login');
      }, 1000);
    } else {
      showToast(res.error || 'Registration failed. Try again.', 'error');
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 antialiased overflow-hidden">
      {/* LEFT SIDE (Hero) */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative items-center justify-center overflow-hidden flex-col p-12 text-white">
        {/* Decorative circles */}
        <div
          className="absolute top-1/4 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="absolute bottom-1/4 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>

        <div className="relative z-10 w-full max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <i className="fas fa-graduation-cap text-5xl text-blue-300"></i>
            <h1 className="text-4xl font-black tracking-tight">CampusCore</h1>
          </div>

          <h2 className="text-3xl font-bold mb-6 leading-tight">Your Academic Workspace Awaits</h2>

          <ul className="space-y-6 mt-10">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                <i className="fas fa-shield-halved text-blue-300"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg">Secure role-based access</h3>
                <p className="text-blue-100/80 text-sm mt-1">
                  Dedicated views for Students, Professors, and Admins based on distinct identity privileges.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                <i className="fas fa-clock text-blue-300"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg">Real-time attendance tracking</h3>
                <p className="text-blue-100/80 text-sm mt-1">
                  Time-stamped session logs and submission tracking ensuring complete academic integrity.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/20">
                <i className="fas fa-chart-pie text-blue-300"></i>
              </div>
              <div>
                <h3 className="font-bold text-lg">Comprehensive analytics</h3>
                <p className="text-blue-100/80 text-sm mt-1">
                  Real-time aggregation of department-wise recruitment metrics and performance.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE (Forms) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white relative h-screen overflow-y-auto">
        {/* Back to Home */}
        <Link
          to="/"
          className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors font-medium text-sm"
        >
          <i className="fas fa-arrow-left"></i> <span className="hidden sm:inline">Back to Home</span>
        </Link>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8 text-blue-600">
          <i className="fas fa-graduation-cap text-3xl"></i>
          <span className="text-2xl font-black text-slate-900 tracking-tight">CampusCore</span>
        </div>

        <div className="w-full max-w-md">
          {/* LOGIN VIEW */}
          {view === 'login' ? (
            <div className="animate-fade-in w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-500">Sign in to your CampusCore account</p>
              </div>

              {/* Role Selector */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
                {['student', 'professor', 'admin'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setCurrentRole(role)}
                    className={`role-tab flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      currentRole === role
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>

              <form className="space-y-5" onSubmit={handleLoginSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-slate-400"></i>
                    </div>
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
                      placeholder="you@tezu.ac.in"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <i className="fas fa-lock text-slate-400"></i>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-slate-600 cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Demo accounts use demo123 as password.', 'info')}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin"></i> Authenticating...
                    </>
                  ) : (
                    <>
                      Sign In <i className="fas fa-arrow-right text-sm"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Buttons */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500 font-medium">Quick Demo Access</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleFillDemo('student')}
                    className="py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex flex-col items-center gap-1.5 shadow-sm"
                  >
                    <i className="fas fa-user-graduate text-blue-500 text-base"></i> Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('professor')}
                    className="py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex flex-col items-center gap-1.5 shadow-sm"
                  >
                    <i className="fas fa-chalkboard-teacher text-emerald-500 text-base"></i> Professor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillDemo('admin')}
                    className="py-2.5 px-3 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex flex-col items-center gap-1.5 shadow-sm"
                  >
                    <i className="fas fa-building-columns text-purple-500 text-base"></i> Admin
                  </button>
                </div>
              </div>

              <p className="mt-8 text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className="font-bold text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  Register here
                </button>
              </p>
            </div>
          ) : (
            /* REGISTER VIEW */
            <div className="animate-fade-in w-full">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
                <p className="text-slate-500">Join the CampusCore platform</p>
              </div>

              <form className="space-y-4" onSubmit={handleRegisterSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={regData.role}
                    onChange={(e) => setRegData({ ...regData, role: e.target.value })}
                    className="w-full px-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50 text-slate-700 font-medium"
                  >
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                    placeholder="John Doe"
                  />
                </div>

                {regData.role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
                    <input
                      type="text"
                      required
                      value={regData.rollNo}
                      onChange={(e) => setRegData({ ...regData, rollNo: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                      placeholder="CSB2400X"
                    />
                  </div>
                )}

                {regData.role === 'professor' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Professor ID</label>
                    <input
                      type="text"
                      required
                      value={regData.rollNo}
                      onChange={(e) => setRegData({ ...regData, rollNo: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                      placeholder="P-00X"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={regData.department}
                    onChange={(e) => setRegData({ ...regData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                    placeholder="Computer Science & Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                    placeholder="you@tezu.ac.in"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm</label>
                    <input
                      type="password"
                      required
                      value={regData.confirmPassword}
                      onChange={(e) => setRegData({ ...regData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-slate-50"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin mr-2"></i> Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="font-bold text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onClose={hideToast}
      />
    </div>
  );
};

export default AuthPage;
