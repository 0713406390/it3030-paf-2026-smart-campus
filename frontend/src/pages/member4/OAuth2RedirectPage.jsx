import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OAuth2RedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const id = params.get('id');
    const name = params.get('name');
    const email = params.get('email');
    const role = params.get('role');

    if (!token || !email) {
      navigate('/login?error=google_auth_failed', { replace: true });
      return;
    }

    const user = {
      id: id ? Number(id) : null,
      name: name || email,
      email,
      role: role || 'USER',
      enabled: true,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('smartcampus_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('smartcampus_user', JSON.stringify(user));

    navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true });
  }, [navigate]);

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3 mb-0">Signing you in with Google...</p>
      </div>
    </div>
  );
}
