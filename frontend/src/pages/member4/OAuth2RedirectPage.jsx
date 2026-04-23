import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function OAuth2RedirectPage() {
  const navigate = useNavigate();
  const { user, completeOAuthLogin } = useAuth();
  const processed = useRef(false);

  // Run once on mount: extract params and commit them to auth state.
  // Navigation is intentionally NOT done here — we wait for the user
  // state to be committed before navigating (see effect below).
  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const email = params.get('email');

    if (!token || !email) {
      navigate('/login?error=google_auth_failed', { replace: true });
      return;
    }

    const id = params.get('id');
    const name = params.get('name');
    const role = params.get('role');

    completeOAuthLogin(token, {
      id: id ? Number(id) : null,
      name: name || email,
      email,
      role: role || 'USER',
      enabled: true,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Navigate only after React has committed the user state so that
  // ProtectedRoute sees an authenticated user and doesn't bounce back to login.
  useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin/users' : '/profile', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 mb-0">Signing you in with Google...</p>
      </div>
    </div>
  );
}
