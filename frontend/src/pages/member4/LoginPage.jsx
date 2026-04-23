import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const nextUser = await login(email, password);
      navigate(nextUser.role === 'ADMIN' ? '/admin/users' : '/profile');
      navigate(nextUser.role === 'ADMIN' ? '/admin/users' : '/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid email or password');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.message === 'Network Error') {
        setError('Cannot reach the server. Make sure the backend is running on port 8080.');
      } else {
        setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 480 }}>
      <div className="p-4 border rounded bg-white shadow-sm">
        <h2 className="text-center mb-1">Smart Campus</h2>
        <p className="text-center text-muted mb-4">Sign in to your account</p>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Button type="submit" className="w-100 mb-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form>
        <p className="text-center mb-0">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </Container>
  );
}
