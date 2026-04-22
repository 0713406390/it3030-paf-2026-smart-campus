import { Container, Nav, Navbar as BsNavbar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <BsNavbar bg="light" expand="lg" className="mb-4 border-bottom">
      <Container>
        <BsNavbar.Brand as={Link} to="/dashboard">Smart Campus</BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/notifications">Notifications</Nav.Link>
            {isAdmin && <Nav.Link as={Link} to="/admin/users">Users</Nav.Link>}
          </Nav>
          <div className="d-flex align-items-center gap-3">
            <NotificationBell />
            <span className="text-muted small">{user?.name ?? 'User'}</span>
            <Button variant="outline-secondary" size="sm" onClick={handleLogout}>Log Out</Button>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
