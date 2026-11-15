import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';

const Sidebar = ({ activeSection, setActiveSection, sections }) => {
  const { logout, user } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        id="sidebarOverlay"
        className="fixed inset-0 bg-black/50 z-40 lg:hidden hidden"
        onClick={() => document.getElementById('sidebar').classList.remove('translate-x-0')}
      ></div>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className="fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 z-50 flex flex-col transform -translate-x-full lg:translate-x-0 transition-transform duration-300"
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-700/50">
          <Link to="/" className="flex items-center gap-2.5 text-white hover:opacity-90 transition">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-graduation-cap text-sm"></i>
            </div>
            <span className="text-lg font-bold tracking-tight">CampusCore</span>
          </Link>
        </div>

        {/* Profile Mini */}
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {getInitials(user?.name || 'User')}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user?.name || 'User'}</p>
              <p className="text-slate-400 text-xs truncate">{user?.roll_no || user?.prof_id || user?.email || 'ID'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {sections && sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all ${
                activeSection === section.id
                  ? 'bg-blue-600/10 text-blue-400 border-l-4 border-blue-500'
                  : 'border-l-4 border-transparent hover:bg-slate-800 hover:text-white'
              }`}
            >
              <i className={`fas ${section.icon} w-5 text-center text-slate-400`}></i>
              <span>{section.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={logout}
            className="nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full text-left"
          >
            <i className="fas fa-sign-out-alt w-5 text-center"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
