import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { FiSun, FiMoon, FiUser, FiLogOut, FiBook, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg group-hover:scale-110 transition-transform">
              <FiBook className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              EduLearn India
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/')
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Home
            </Link>
            <Link
              to="/subjects"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/subjects')
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Subjects
            </Link>
            <Link
              to="/notes"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/notes')
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Notes
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ml-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ml-2"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ml-2">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary ml-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg font-medium ${
                isActive('/') ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/subjects"
              className={`block px-4 py-2 rounded-lg font-medium ${
                isActive('/subjects') ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Subjects
            </Link>
            <Link
              to="/notes"
              className={`block px-4 py-2 rounded-lg font-medium ${
                isActive('/notes') ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Notes
            </Link>
            
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
              <span>Toggle Theme</span>
            </button>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <FiUser className="w-5 h-5" />
                  <span>{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 dark:text-red-400"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-lg font-medium text-gray-600 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block btn btn-primary w-full text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
