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
    <nav className="bg-white border-b border-gray-100 shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                <FaHotel className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-charcoal tracking-tight">
                Stay<span className="text-primary">finity</span>
              </span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/hotels" className="btn-ghost text-sm">
                  Hotels
                </Link>
                {user?.role !== 'admin' && (
                  <Link to="/bookings" className="btn-ghost text-sm">
                    My Bookings
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                               bg-primary-50 text-primary border border-primary/20
                               hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    <FaCrown className="text-xs" />
                    Admin Dashboard
                  </Link>
                )}

                {/* User pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-100 bg-base ml-2">
                  <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FaUser className="text-primary text-xs" />
                  </div>
                  <span className="text-sm text-charcoal font-medium">{user?.name}</span>
                  {user?.role === 'admin' && (
                    <span className="badge-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      Admin
                    </span>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="btn-accent text-sm px-4 py-2 ml-1"
                >
                  <FaSignOutAlt className="text-xs" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
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
              className="p-2 rounded-xl text-muted hover:bg-primary-50 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen
                ? <FaTimes className="h-5 w-5" />
                : <FaBars className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/hotels"
                  className="block px-4 py-2.5 rounded-xl text-charcoal hover:bg-primary-50 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Hotels
                </Link>
                {user?.role !== 'admin' && (
                  <Link
                    to="/bookings"
                    className="block px-4 py-2.5 rounded-xl text-charcoal hover:bg-primary-50 hover:text-primary font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-primary bg-primary-50 border border-primary/20 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaCrown className="text-xs" /> Admin Dashboard
                  </Link>
                )}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-100 bg-base">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-primary text-xs" />
                    <span className="text-sm font-medium text-charcoal">{user?.name}</span>
                  </div>
                  {user?.role === 'admin' && (
                    <span className="badge-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Admin</span>
                  )}
                </div>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="w-full btn-accent text-sm py-2.5"
                >
                  <FaSignOutAlt className="text-xs" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2.5 rounded-xl text-charcoal hover:bg-primary-50 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2.5 rounded-xl text-white bg-primary font-medium text-center"
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
