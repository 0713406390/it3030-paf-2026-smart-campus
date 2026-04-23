import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: 'Too short', color: '#ef4444', width: '25%' };
    if (p.length < 8) return { label: 'Weak', color: '#f97316', width: '50%' };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: 'Fair', color: '#eab308', width: '75%' };
    return { label: 'Strong', color: '#22c55e', width: '100%' };
  };

  const strength = passwordStrength();

  return (
    <div className="auth-wrapper">
      <div className="auth-sidebar">
        <div className="brand-icon">🏫</div>
        <h1>Join Smart Campus</h1>
        <p>Create your account and get access to all campus services in one place.</p>
        <div className="features">
          <div className="feature-item"><i className="bi bi-person-check"></i> Easy Account Setup</div>
          <div className="feature-item"><i className="bi bi-shield-lock"></i> Secure JWT Authentication</div>
          <div className="feature-item"><i className="bi bi-google"></i> Google Sign-In Support</div>
          <div className="feature-item"><i className="bi bi-people"></i> Role-Based Permissions</div>
        </div>
      </div>

      <div className="auth-form-area">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="subtitle">Fill in the details below to get started</p>

          {error && (
            <div className="alert alert-danger py-2 d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
              <i className="bi bi-exclamation-circle-fill"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-person text-muted"></i></span>
                <input name="name" className="form-control border-start-0" value={form.name}
                  onChange={handleChange} required placeholder="John Doe" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email address</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-envelope text-muted"></i></span>
                <input name="email" type="email" className="form-control border-start-0" value={form.email}
                  onChange={handleChange} required placeholder="you@example.com" />
              </div>
            </div>

            <div className="mb-1">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-lock text-muted"></i></span>
                <input name="password" type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0" value={form.password}
                  onChange={handleChange} required placeholder="Min. 6 characters" />
                <button type="button" className="input-group-text bg-white"
                  onClick={() => setShowPassword(!showPassword)}>
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div style={{ height: 4, background: '#e5e7eb', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: 4, transition: 'width 0.3s' }}></div>
                  </div>
                  <small style={{ color: strength.color }}>{strength.label}</small>
                </div>
              )}
            </div>

            <div className="mb-3 mt-3">
              <label className="form-label">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-lock-fill text-muted"></i></span>
                <input name="confirm" type="password" className="form-control border-start-0"
                  value={form.confirm} onChange={handleChange} required placeholder="Repeat password" />
                {form.confirm && (
                  <span className="input-group-text bg-white">
                    <i className={`bi ${form.password === form.confirm ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`}></i>
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary-auth mb-3" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
              ) : (
                <><i className="bi bi-person-plus me-2"></i>Create Account</>
              )}
            </button>
          </form>

          <div className="divider-text">or sign up with</div>

          <a href="http://localhost:8080/oauth2/authorization/google" className="btn-google mb-4">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
            </svg>
            Continue with Google
          </a>

          <p className="text-center mb-0" style={{ fontSize: 14 }}>
            Already have an account? <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}