import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left sidebar */}
      <div className="auth-sidebar">
        <div className="brand-icon">🏫</div>
        <h1>Smart Campus</h1>
        <p>Your all-in-one platform for campus operations, incident management, and facility booking.</p>
        <div className="features">
          <div className="feature-item"><i className="bi bi-ticket-detailed"></i> Incident Ticket Management</div>
          <div className="feature-item"><i className="bi bi-calendar-check"></i> Facility Booking</div>
          <div className="feature-item"><i className="bi bi-bell"></i> Real-time Notifications</div>
          <div className="feature-item"><i className="bi bi-shield-check"></i> Role-Based Access Control</div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-form-area">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to your Smart Campus account</p>

          {error && (
            <div className="alert alert-danger py-2 d-flex align-items-center gap-2" style={{ fontSize: 14 }}>
              <i className="bi bi-exclamation-circle-fill"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-envelope text-muted"></i></span>
                <input
                  type="email"
                  className="form-control border-start-0"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mb-1">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white"><i className="bi bi-lock text-muted"></i></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-start-0 border-end-0"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="input-group-text bg-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                </button>
              </div>
            </div>

            <div className="text-end mb-3">
              <Link to="/forgot-password" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="btn btn-primary-auth mb-3" disabled={loading}>
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Signing in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
              )}
            </button>
          </form>

          <div className="divider-text">or continue with</div>

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
            Don't have an account? <Link to="/register" style={{ color: '#3b82f6', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}