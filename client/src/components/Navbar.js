import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaBars, FaTimes, FaCrown } from 'react-icons/fa';

/* ── Stayfinity wordmark (inline SVG for crisp rendering) ── */
const StayfinityLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="32" height="32" rx="9" fill="#0F6E56"/>
    <path d="M8 22 L16 10 L24 22" stroke="#FAC775" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.5 18 H20.5" stroke="#FAC775" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="10" r="2" fill="#D85A30"/>
  </svg>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const close = () => setMenuOpen(false);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" onClick={close} className="flex items-center gap-2.5 group">
            <StayfinityLogo />
            <span className="text-xl font-extrabold tracking-tight text-charcoal group-hover:text-primary transition-colors">
              Stay<span className="text-primary">finity</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link to="/hotels"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary hover:bg-primary-50 transition-all duration-150">
                  Hotels
                </Link>

                {user?.role !== 'admin' && (
                  <Link to="/bookings"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary hover:bg-primary-50 transition-all duration-150">
                    My Bookings
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link to="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-primary bg-primary-50 border border-primary-100 hover:bg-primary-100 transition-all duration-150">
                    <FaCrown className="text-highlight-dark" size={12} />
                    Admin
                  </Link>
                )}

                {/* User pill */}
                <div className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
                    <FaUser size={11} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-charcoal">{user?.name}</span>
                  {user?.role === 'admin' && (
                    <span className="badge bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide">
                      ADMIN
                    </span>
                  )}
                </div>

                <button onClick={handleLogout}
                  className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-dark transition-all duration-200 shadow-sm">
                  <FaSignOutAlt size={13} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-primary hover:bg-primary-50 transition-all duration-150">
                  Sign in
                </Link>
                <Link to="/register"
                  className="ml-1 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-600 transition-all duration-200 shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-muted hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {isAuthenticated ? (
            <>
              {/* User pill */}
              <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-xl bg-primary-50 border border-primary-100">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <FaUser size={12} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">{user?.name}</p>
                  {user?.role === 'admin' && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin</span>
                  )}
                </div>
              </div>

              <Link to="/hotels" onClick={close}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-primary-50 hover:text-primary transition-colors">
                Hotels
              </Link>

              {user?.role !== 'admin' && (
                <Link to="/bookings" onClick={close}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-primary-50 hover:text-primary transition-colors">
                  My Bookings
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link to="/admin" onClick={close}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary bg-primary-50 border border-primary-100">
                  <FaCrown size={12} className="text-highlight-dark" />
                  Admin Dashboard
                </Link>
              )}

              <button onClick={handleLogout}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-accent hover:bg-accent-dark transition-colors">
                <FaSignOutAlt size={13} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={close}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-charcoal hover:bg-gray-100 transition-colors">
                Sign in
              </Link>
              <Link to="/register" onClick={close}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary-600 text-center transition-colors">
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
