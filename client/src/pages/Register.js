import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { clearError(); }, [clearError]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim())                      e.name            = 'Name is required';
    else if (formData.name.trim().length < 2)        e.name            = 'Name must be at least 2 characters';
    if (!formData.email)                             e.email           = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))  e.email           = 'Invalid email address';
    if (!formData.password)                          e.password        = 'Password is required';
    else if (formData.password.length < 6)           e.password        = 'At least 6 characters required';
    if (!formData.confirmPassword)                   e.confirmPassword = 'Please confirm your password';
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

  const Field = ({ id, label, type = 'text', icon: Icon, show, onToggle, placeholder, autoComplete }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-charcoal mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={14} />
        <input
          id={id} name={id}
          type={onToggle ? (show ? 'text' : 'password') : type}
          autoComplete={autoComplete}
          value={formData[id]} onChange={handleChange}
          placeholder={placeholder}
          className={`input-field pl-10 ${onToggle ? 'pr-10' : ''} ${errors[id] ? 'border-red-400 focus:ring-red-300' : ''}`}
        />
        {onToggle && (
          <button type="button" onClick={onToggle}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors">
            {show ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
          </button>
        )}
      </div>
      {errors[id] && <p className="mt-1 text-xs text-red-500">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-between p-12">
        <span className="text-2xl font-extrabold text-white tracking-tight">
          Stay<span className="text-highlight">finity</span>
        </span>
        <div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            Your next great<br />adventure starts here.
          </h2>
          {['Free to join', 'Best-price guarantee', 'Instant confirmation'].map(t => (
            <div key={t} className="flex items-center gap-2 text-primary-100 text-sm mb-2">
              <FaCheckCircle size={13} className="text-highlight" /> {t}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {['#FAC775','#D85A30','#0F6E56'].map(c => (
            <div key={c} className="w-8 h-2 rounded-full opacity-70" style={{ background: c }} />
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center bg-base px-4 py-16">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-charcoal mb-1">Create account</h1>
          <p className="text-muted text-sm mb-8">
            Already have one?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field id="name"            label="Full name"        icon={FaUser}    placeholder="Your full name"  autoComplete="name" />
            <Field id="email"           label="Email address"   icon={FaEnvelope} placeholder="you@example.com" autoComplete="email" />
            <Field id="password"        label="Password"        icon={FaLock}     placeholder="Min. 6 characters"
              show={showPassword} onToggle={() => setShowPassword(!showPassword)} autoComplete="new-password" />
            <Field id="confirmPassword" label="Confirm password" icon={FaLock}    placeholder="Repeat password"
              show={showConfirm}  onToggle={() => setShowConfirm(!showConfirm)}   autoComplete="new-password" />

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-sm text-red-600">{authError}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 rounded-xl mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? <span className="spinner" /> : <>Create account <FaArrowRight size={13} /></>}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted">
            By signing up you agree to our{' '}
            <span className="text-primary font-medium cursor-pointer hover:underline">Terms</span> and{' '}
            <span className="text-primary font-medium cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
