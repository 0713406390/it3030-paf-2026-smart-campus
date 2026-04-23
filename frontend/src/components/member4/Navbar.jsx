import { useEffect, useState } from 'react';
import { Container, Nav, Navbar as BsNavbar, Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getUnreadCount } from '../../services/member4/notificationService';

function initials(name) {
  if (!name) return 'U';
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const count = await getUnreadCount();
        if (active) setUnread(count);
      } catch { /* silent */ }
    };
    load();
    const t = setInterval(load, 30000);
    return () => { active = false; clearInterval(t); };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) =>
    path === '/admin'
      ? location.pathname.startsWith('/admin')
      : location.pathname === path;

  const navLinks = [
    { to: '/dashboard',     icon: 'bi-grid-1x2',        label: 'Dashboard' },
    { to: '/profile',       icon: 'bi-person',           label: 'Profile' },
    { to: '/notifications', icon: 'bi-bell',             label: 'Notifications' },
    { to: '/tickets',       icon: 'bi-ticket-detailed',  label: 'Tickets' },
  ];

  const userInitials = initials(user?.name);

  return (
    <BsNavbar className="sc-navbar" expand="lg" sticky="top">
      <Container fluid="xl">
        <BsNavbar.Brand as={Link} to="/dashboard" className="sc-brand">
          <span className="sc-brand-icon">🏫</span>
          Smart Campus
        </BsNavbar.Brand>

        <BsNavbar.Toggle
          aria-controls="sc-main-nav"
          className="border-0"
          style={{ filter: 'invert(1)' }}
        />

        <BsNavbar.Collapse id="sc-main-nav">
          <Nav className="me-auto align-items-lg-stretch">
            {navLinks.map(({ to, icon, label }) => (
              <Nav.Link
                key={to}
                as={Link}
                to={to}
                className={`sc-nav-link${isActive(to) ? ' active' : ''}`}
              >
                <i className={`bi ${icon}`} />
                {label}
              </Nav.Link>
            ))}
            {isAdmin && (
              <Nav.Link
                as={Link}
                to="/admin/users"
                className={`sc-nav-link${isActive('/admin') ? ' active' : ''}`}
              >
                <i className="bi bi-shield-check" />
                Admin
              </Nav.Link>
            )}
          </Nav>

          <div className="d-flex align-items-center gap-2 py-2 py-lg-0">
            {isAdmin && (
              <span className="sc-admin-badge d-none d-lg-inline">ADMIN</span>
            )}

            <Dropdown align="end">
              <Dropdown.Toggle as="div" id="sc-user-dropdown" className="sc-user-menu">
                <div className="user-avatar position-relative">
                  {userInitials}
                  {unread > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: 9, padding: '2px 5px', minWidth: 16 }}
                    >
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </div>
                <span className="sc-username d-none d-lg-block">
                  {user?.name?.split(' ')[0] ?? 'User'}
                </span>
                <i
                  className="bi bi-chevron-down d-none d-lg-block"
                  style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="sc-dropdown-menu">
                <div className="sc-dropdown-header">
                  <div className="sc-dropdown-avatar">{userInitials}</div>
                  <div className="overflow-hidden">
                    <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>
                      {user?.name}
                    </div>
                    <div className="text-muted text-truncate" style={{ fontSize: 12 }}>
                      {user?.email}
                    </div>
                    <span
                      className="badge mt-1"
                      style={{
                        background: isAdmin ? 'rgba(124,58,237,0.12)' : 'rgba(59,130,246,0.12)',
                        color: isAdmin ? '#6d28d9' : '#1d4ed8',
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {user?.role ?? 'USER'}
                    </span>
                  </div>
                </div>

                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2 text-muted" />
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/notifications">
                  <i className="bi bi-bell me-2 text-muted" />
                  Notifications
                  {unread > 0 && (
                    <span className="badge bg-danger ms-2" style={{ fontSize: 10 }}>
                      {unread}
                    </span>
                  )}
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/dashboard">
                  <i className="bi bi-grid me-2 text-muted" />
                  Dashboard
                </Dropdown.Item>

                {isAdmin && (
                  <>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/admin/users">
                      <i className="bi bi-people me-2 text-muted" />
                      User Management
                    </Dropdown.Item>
                  </>
                )}

                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <i className="bi bi-box-arrow-right me-2" />
                  Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}
