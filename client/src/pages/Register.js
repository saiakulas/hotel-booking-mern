import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHotel, FaCheckCircle } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors]                           = useState({});
  const [isSubmitting, setIsSubmitting]               = useState(false);

  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { clearError(); }, [clearError]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim())                          e.name            = 'Name is required';
    else if (formData.name.trim().length < 2)           e.name            = 'At least 2 characters';
    if (!formData.email)                                e.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))     e.email           = 'Enter a valid email';
    if (!formData.password)                             e.password        = 'Password is required';
    else if (formData.password.length < 6)              e.password        = 'Minimum 6 characters';
    if (!formData.confirmPassword)                      e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    const result = await register(formData.name, formData.email, formData.password);
    setIsSubmitting(false);
    if (result.success) navigate('/hotels');
  };

  const perks = [
    'Instant booking confirmation',
    'Access to 2 400+ hotels',
    'Free cancellation on most stays',
  ];

  return (
    <div className="min-h-screen bg-base flex">
      {/* Left decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-primary p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, #FAC775 0%, transparent 60%)' }} />
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <FaHotel className="text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">Stayfinity</span>
        </Link>
        <div className="relative z-10 space-y-5">
          <h3 className="text-white text-2xl font-bold leading-snug">
            Start booking smarter,<br />not harder.
          </h3>
          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p} className="flex items-center gap-3 text-white/90 text-sm">
                <FaCheckCircle className="text-highlight flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative z-10 flex gap-3">
          {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/40" />)}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="text-xl font-extrabold text-charcoal">
              Stay<span className="text-primary">finity</span>
            </span>
          </Link>

          <h2 className="text-3xl font-extrabold text-charcoal mb-1">Create your account</h2>
          <p className="text-muted mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-primary-600">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-1.5">Full name</label>
              <div className="relative">
                <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                <input
                  id="name" name="name" type="text" autoComplete="name"
                  className={`input-field pl-10 ${errors.name ? 'border-red-400' : ''}`}
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-1.5">Email address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-charcoal mb-1.5">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-400' : ''}`}
                  placeholder="Min. 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                  onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-charcoal mb-1.5">Confirm password</label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                <input
                  id="confirmPassword" name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`input-field pl-10 pr-11 ${errors.confirmPassword ? 'border-red-400' : ''}`}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button type="button" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                  onClick={() => setShowConfirmPassword(p => !p)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? <div className="spinner mx-auto" /> : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
