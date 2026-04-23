import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/member4/api';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1=enter email, 2=enter token+password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoToken, setDemoToken] = useState(''); // for demo only

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setDemoToken(res.data.resetToken || '');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) return setError('Passwords do not match');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/reset-password', { token, newPassword });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-sidebar">
        <div className="brand-icon">🔐</div>
        <h1>Password Reset</h1>
        <p>Don't worry! It happens to everyone. We'll help you recover access to your Smart Campus account.</p>
        <div className="features">
          <div className="feature-item"><i className="bi bi-1-circle"></i> Enter your email address</div>
          <div className="feature-item"><i className="bi bi-2-circle"></i> Get your reset token</div>
          <div className="feature-item"><i className="bi bi-3-circle"></i> Set a new password</div>
        </div>
      </div>

      <div className="auth-form-area">
        <div className="auth-card">

          {step === 1 && (
            <>
              <h2>Forgot password?</h2>
              <p className="subtitle">Enter your email and we'll send you a reset token</p>

              {error && (
                <div className="alert alert-danger py-2" style={{ fontSize: 14 }}>
                  <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleRequestReset}>
                <div className="mb-4">
                  <label className="form-label">Email address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-envelope text-muted"></i></span>
                    <input type="email" className="form-control border-start-0" value={email}
                      onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary-auth mb-3" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                  ) : (
                    <><i className="bi bi-send me-2"></i>Send Reset Token</>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h2>Reset password</h2>
              <p className="subtitle">Enter the token and your new password</p>

              {message && (
                <div className="alert alert-success py-2" style={{ fontSize: 14 }}>
                  <i className="bi bi-check-circle-fill me-2"></i>{message}
                </div>
              )}

              {demoToken && (
                <div className="alert alert-warning py-2" style={{ fontSize: 13 }}>
                  <strong>Demo mode:</strong> Your token is <code style={{ userSelect: 'all' }}>{demoToken}</code>
                </div>
              )}

              {error && (
                <div className="alert alert-danger py-2" style={{ fontSize: 14 }}>
                  <i className="bi bi-exclamation-circle-fill me-2"></i>{error}
                </div>
              )}

              <form onSubmit={handleResetPassword}>
                <div className="mb-3">
                  <label className="form-label">Reset Token</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-key text-muted"></i></span>
                    <input type="text" className="form-control border-start-0" value={token}
                      onChange={(e) => setToken(e.target.value)} required placeholder="Paste token here" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-lock text-muted"></i></span>
                    <input type="password" className="form-control border-start-0" value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} required placeholder="Min. 6 characters" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Confirm New Password</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><i className="bi bi-lock-fill text-muted"></i></span>
                    <input type="password" className="form-control border-start-0" value={confirm}
                      onChange={(e) => setConfirm(e.target.value)} required placeholder="Repeat password" />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary-auth" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Resetting...</>
                  ) : (
                    <><i className="bi bi-check2-circle me-2"></i>Reset Password</>
                  )}
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div style={{ fontSize: 64 }}>✅</div>
              <h2 className="mt-3">Password reset!</h2>
              <p className="text-muted">{message}</p>
              <Link to="/login" className="btn btn-primary-auth mt-2" style={{ display: 'inline-block', width: 'auto', padding: '10px 32px' }}>
                <i className="bi bi-box-arrow-in-right me-2"></i>Go to Login
              </Link>
            </div>
          )}

          {step !== 3 && (
            <p className="text-center mt-3 mb-0" style={{ fontSize: 14 }}>
              Remember your password? <Link to="/login" style={{ color: '#3b82f6', fontWeight: 600 }}>Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}