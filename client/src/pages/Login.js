import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaHotel } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData]       = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors]           = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { clearError(); }, [clearError]);

  const validate = () => {
    const e = {};
    if (!formData.email)                             e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))  e.email    = 'Enter a valid email';
    if (!formData.password)                          e.password = 'Password is required';
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
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);
    if (result.success) navigate('/hotels');
  };

  return (
    <div className="min-h-screen bg-base flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-primary p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #FAC775 0%, transparent 60%)' }} />
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <FaHotel className="text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-tight">Stayfinity</span>
        </Link>
        <div className="relative z-10">
          <blockquote className="text-white/90 text-xl font-medium leading-relaxed">
            "The easiest hotel booking experience I've ever had. Confirmed in under a minute."
          </blockquote>
          <p className="mt-4 text-primary-200 text-sm font-medium">— Alex R., frequent traveller</p>
        </div>
        <div className="relative z-10 flex gap-3">
          {[1,2,3].map(i => (
            <div key={i} className="w-2 h-2 rounded-full bg-white/40" />
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <FaHotel className="text-white text-sm" />
            </div>
            <span className="text-xl font-extrabold text-charcoal">
              Stay<span className="text-primary">finity</span>
            </span>
          </Link>

          <h2 className="text-3xl font-extrabold text-charcoal mb-1">Welcome back</h2>
          <p className="text-muted mb-8">
            New here?{' '}
            <Link to="/register" className="text-primary font-semibold hover:text-primary-600">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-1.5">
                Email address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-400/30' : ''}`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-sm" />
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={`input-field pl-10 pr-11 ${errors.password ? 'border-red-400 focus:ring-red-400/30' : ''}`}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                  onClick={() => setShowPassword(p => !p)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <div className="spinner mx-auto" /> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
