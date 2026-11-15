import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = ({ currentRole, setCurrentRole, showToast }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const demos = {
    student: 'csb24002@tezu.ac.in',
    professor: 'sroy@tezu.ac.in',
    admin: 'admin@tezu.ac.in',
  };

  const fillDemo = (role) => {
    setCurrentRole(role);
    setFormData({ email: demos[role], password: 'demo123' });
    showToast(`Filled demo credentials for ${role.charAt(0).toUpperCase() + role.slice(1)}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, currentRole.charAt(0).toUpperCase() + currentRole.slice(1));

      if (result.success) {
        showToast('Login successful! Redirecting...', 'success');
        setTimeout(() => {
          navigate(`/${currentRole}`);
        }, 800);
      } else {
        showToast(result.error || 'Login failed. Please try again.', 'error');
      }
    } catch (error) {
      showToast(error.message || 'An error occurred during login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
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
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              currentRole === role
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-envelope text-slate-400"></i>
            </div>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
              placeholder="you@tezu.ac.in"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-lock text-slate-400"></i>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
              Remember me
            </label>
          </div>
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 font-bold transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Demo Access */}
      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Quick Demo Access</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => fillDemo('student')}
            className="py-2 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex flex-col items-center gap-1"
          >
            <i className="fas fa-user-graduate text-blue-500"></i> Student
          </button>
          <button
            type="button"
            onClick={() => fillDemo('professor')}
            className="py-2 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex flex-col items-center gap-1"
          >
            <i className="fas fa-chalkboard-teacher text-emerald-500"></i> Professor
          </button>
          <button
            type="button"
            onClick={() => fillDemo('admin')}
            className="py-2 px-3 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors flex flex-col items-center gap-1"
          >
            <i className="fas fa-building-columns text-purple-500"></i> Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
