import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { clearError(); }, [clearError]);

  const validate = () => {
    const e = {};
    if (!formData.email)                          e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email    = 'Invalid email address';
    if (!formData.password)                        e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = ({ target: { name, value } }) => {
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
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <div>
          <span className="text-2xl font-extrabold text-white tracking-tight">
            Stay<span className="text-highlight">finity</span>
          </span>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Welcome<br />back.
          </h2>
          <p className="text-primary-100 text-lg">The world's best stays are one sign-in away.</p>
        </div>
        <div className="flex gap-2">
          {['#0F6E56','#FAC775','#D85A30'].map(c => (
            <div key={c} className="w-8 h-2 rounded-full opacity-70" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-base px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-charcoal mb-1">Sign in</h1>
          <p className="text-muted text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1.5">
                Email address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input
                  id="email" name="email" type="email" autoComplete="email"
                  value={formData.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-400 focus:ring-red-300' : ''}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input
                  id="password" name="password" type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 focus:ring-red-300' : ''}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors">
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {/* Auth error */}
            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? <span className="spinner" /> : <>Sign in <FaArrowRight size={13} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
