import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaUser, FaEnvelope, FaLock,
  FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle,
} from 'react-icons/fa';

/* ── reusable input row ─────────────────────────────────────── */
const InputField = ({ id, label, type, icon: Icon, value, onChange, placeholder, autoComplete, error, rightEl }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-semibold text-charcoal mb-2">
      {label}
    </label>
    <div className="relative flex items-center">
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
const Register = () => {
  const [formData,     setFormData]     = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { clearError(); }, [clearError]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim())                           e.name            = 'Name is required';
    else if (formData.name.trim().length < 2)             e.name            = 'At least 2 characters';
    if (!formData.email)                                  e.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))       e.email           = 'Enter a valid email';
    if (!formData.password)                               e.password        = 'Password is required';
    else if (formData.password.length < 6)                e.password        = 'At least 6 characters';
    if (!formData.confirmPassword)                        e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
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
    const result = await register(formData.name, formData.email, formData.password);
    setIsSubmitting(false);
    if (result.success) navigate('/hotels');
  };

  const ToggleBtn = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="text-muted hover:text-charcoal transition-colors focus:outline-none"
      tabIndex={-1}
    >
      {show ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-base">

      {/* ── Left panel ──────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <img
          src="https://images.pexels.com/photos/1579253/pexels-photo-1579253.jpeg"
          alt="Beautiful hotel room"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/35 to-charcoal/10" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow">
            Stay<span className="text-highlight">finity</span>
          </span>

          <div>
            <p className="text-primary-100 text-sm font-medium uppercase tracking-widest mb-3">
              Join millions of travellers
            </p>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              Your next great<br />adventure starts here.
            </h2>
            <div className="space-y-3">
              {[
                'Free to join — no credit card needed',
                'Best-price guarantee on every booking',
                'Instant confirmation & easy cancellation',
              ].map(t => (
                <div key={t} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary-100/20 border border-highlight/40 flex items-center justify-center flex-shrink-0">
                    <FaCheckCircle size={10} className="text-highlight" />
                  </span>
                  <span className="text-white/90 text-sm">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-[400px]">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <span className="text-2xl font-extrabold text-charcoal">
              Stay<span className="text-primary">finity</span>
            </span>
          </div>

          <h1 className="text-[28px] font-extrabold text-charcoal leading-tight mb-1">
            Create your account
          </h1>
          <p className="text-muted text-sm mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <InputField
              id="name" label="Full name" type="text"
              icon={FaUser} value={formData.name} onChange={handleChange}
              placeholder="Your full name" autoComplete="name" error={errors.name}
            />
            <InputField
              id="email" label="Email address" type="email"
              icon={FaEnvelope} value={formData.email} onChange={handleChange}
              placeholder="you@example.com" autoComplete="email" error={errors.email}
            />
            <InputField
              id="password" label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={FaLock} value={formData.password} onChange={handleChange}
              placeholder="Min. 6 characters" autoComplete="new-password" error={errors.password}
              rightEl={<ToggleBtn show={showPassword} onToggle={() => setShowPassword(s => !s)} />}
            />
            <InputField
              id="confirmPassword" label="Confirm password"
              type={showConfirm ? 'text' : 'password'}
              icon={FaLock} value={formData.confirmPassword} onChange={handleChange}
              placeholder="Repeat your password" autoComplete="new-password" error={errors.confirmPassword}
              rightEl={<ToggleBtn show={showConfirm} onToggle={() => setShowConfirm(s => !s)} />}
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
                : <> Create account <FaArrowRight size={13} /> </>}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            By signing up you agree to our{' '}
            <span className="text-primary font-medium cursor-pointer hover:underline">Terms</span>
            {' & '}
            <span className="text-primary font-medium cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
