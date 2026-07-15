import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaHotel, FaUser, FaSignOutAlt, FaCrown, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <FaHotel className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">
                saihotel
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/hotels"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Hotels
                </Link>
                {user?.role !== 'admin' && (
                  <Link
                    to="/bookings"
                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    My Bookings
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-indigo-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-50 border border-indigo-200"
                  >
                    <FaCrown className="inline mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center space-x-3 rounded-lg px-4 py-2 border border-gray-200">
                  <FaUser className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                  {user?.role === 'admin' && (
                    <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-indigo-600 hover:bg-indigo-700"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/hotels"
                  className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Hotels
                </Link>
                {user?.role !== 'admin' && (
                  <Link
                    to="/bookings"
                    className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block w-full text-left px-4 py-2 rounded-md text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaCrown className="inline mr-2" />
                    Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center justify-between px-4 py-2 border border-gray-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <FaUser className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                  </div>
                  {user?.role === 'admin' && (
                    <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full font-semibold">
                      ADMIN
                    </span>
                  )}
                </div>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center justify-center space-x-2 text-white px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-left px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
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
