import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-slate-900 bg-opacity-95 backdrop-blur shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-3">
            <i className="fas fa-graduation-cap text-3xl text-blue-500"></i>
            <Link to="/" className="text-2xl font-bold text-white tracking-tight">
              CampusCore
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-300 hover:text-white transition-colors font-medium">
              Features
            </a>
            <a href="#about" className="text-slate-300 hover:text-white transition-colors font-medium">
              About
            </a>
            <a href="#tech" className="text-slate-300 hover:text-white transition-colors font-medium">
              Tech Stack
            </a>
            <a href="#team" className="text-slate-300 hover:text-white transition-colors font-medium">
              Team
            </a>
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/30"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-400 focus:outline-none p-2"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <a
              href="#features"
              className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#about"
              className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#tech"
              className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tech Stack
            </a>
            <a
              href="#team"
              className="block px-3 py-3 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Team
            </a>
            <Link
              to="/login"
              className="block w-full text-center mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
