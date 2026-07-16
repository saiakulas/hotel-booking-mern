import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

/* ── reusable input row ─────────────────────────────────────── */
const InputField = ({ id, label, type, icon: Icon, value, onChange, placeholder, autoComplete, error, rightEl }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-charcoal mb-2">
      {label}
    </label>
    <div className="relative flex items-center">
      {/* left icon container — fixed width so text never overlaps */}
      <span className="pointer-events-none absolute left-0 flex items-center justify-center w-11 h-full text-muted">
        <Icon size={15} />
      </span>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={[
          'w-full h-12 pl-11 rounded-xl border bg-white text-charcoal text-sm',
          'placeholder:text-gray-400 outline-none transition-all duration-200',
          'focus:ring-2 focus:ring-primary/30 focus:border-primary',
          rightEl ? 'pr-11' : 'pr-4',
          error ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-gray-200',
        ].join(' ')}
      />
      {/* right element (show/hide toggle) */}
      {rightEl && (
        <span className="absolute right-0 flex items-center justify-center w-11 h-full">
          {rightEl}
        </span>
      )}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
);

/* ════════════════════════════════════════════════════════════ */
const Login = () => {
  const [formData,     setFormData]     = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { clearError(); }, [clearError]);

  const validate = () => {
    const e = {};
    if (!formData.email)                           e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email    = 'Enter a valid email';
    if (!formData.password)                         e.password = 'Password is required';
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
    <div className="min-h-screen flex bg-base">

      {/* ── Left panel ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.pexels.com/photos/2096983/pexels-photo-2096983.jpeg"
          alt="Luxury hotel interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark-to-transparent overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Logo */}
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow">
            Stay<span className="text-highlight">finity</span>
          </span>

          {/* Bottom copy */}
          <div>
            <p className="text-primary-100 text-sm font-medium uppercase tracking-widest mb-3">
              Welcome back
            </p>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              The world's best<br />stays await you.
            </h2>
            {/* Rating strip */}
            <div className="flex items-center gap-3 mt-6 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 w-fit border border-white/20">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" fill="#FAC775" className="w-4 h-4">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white text-sm font-medium">Rated 4.9 by 1M+ travellers</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-2xl font-extrabold text-charcoal">
              Stay<span className="text-primary">finity</span>
            </span>
          </div>

          <h1 className="text-[28px] font-extrabold text-charcoal leading-tight mb-1">
            Sign in to your account
          </h1>
          <p className="text-muted text-sm mb-8">
            New here?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create a free account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <InputField
              id="email" label="Email address" type="email"
              icon={FaEnvelope} value={formData.email} onChange={handleChange}
              placeholder="you@example.com" autoComplete="email" error={errors.email}
            />

            <InputField
              id="password" label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={FaLock} value={formData.password} onChange={handleChange}
              placeholder="Enter your password" autoComplete="current-password"
              error={errors.password}
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="text-muted hover:text-charcoal transition-colors focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              }
            />

            {authError && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <span className="mt-0.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting
                ? <span className="spinner" style={{ borderTopColor: '#fff', width: 18, height: 18 }} />
                : <> Sign in <FaArrowRight size={13} /> </>}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted">
            By continuing you agree to our{' '}
            <span className="text-primary font-medium cursor-pointer hover:underline">Terms</span>
            {' & '}
            <span className="text-primary font-medium cursor-pointer hover:underline">Privacy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
