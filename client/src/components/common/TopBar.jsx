import { getInitials } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ title, subtitle }) => {
  const { user } = useAuth();

  const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar?.classList.toggle('translate-x-0');
    sidebar?.classList.toggle('-translate-x-full');
    overlay?.classList.toggle('hidden');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 lg:top-0 z-30 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-slate-500 hover:text-slate-700">
          <i className="fas fa-bars text-xl"></i>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-sm border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white w-48 transition"
          />
        </div>
        <button className="relative p-2 hover:bg-slate-100 rounded-xl transition">
          <i className="fas fa-bell text-slate-500"></i>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {getInitials(user?.name || 'User')}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
