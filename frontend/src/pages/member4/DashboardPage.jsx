import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/member4/Navbar';
import { getAllUsers } from '../../services/member4/userService';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function StatCard({ icon, iconClass, number, label }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${iconClass}`}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

/* ─── Admin dashboard ─────────────────────────────── */
function AdminDashboard({ user }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total       = users.length;
  const active      = users.filter((u) => u.enabled).length;
  const admins      = users.filter((u) => u.role === 'ADMIN').length;
  const technicians = users.filter((u) => u.role === 'TECHNICIAN').length;
  const recent      = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="sc-page">
      <Container fluid="xl">
        {/* Header */}
        <div className="page-header d-flex align-items-center justify-content-between flex-wrap gap-3">
          <div>
            <h1 className="mb-1">
              {greeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-muted mb-0">
              Here's what's happening across Smart Campus today.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="btn btn-primary"
            style={{ borderRadius: 10, fontWeight: 600 }}
          >
            <i className="bi bi-people me-2" />Manage Users
          </Link>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row className="g-3 mb-4">
            <Col sm={6} xl={3}>
              <StatCard icon="bi-people-fill" iconClass="si-blue" number={total} label="Total Users" />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard icon="bi-person-check-fill" iconClass="si-green" number={active} label="Active Users" />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard icon="bi-shield-fill-check" iconClass="si-purple" number={admins} label="Administrators" />
            </Col>
            <Col sm={6} xl={3}>
              <StatCard icon="bi-wrench-adjustable-circle-fill" iconClass="si-orange" number={technicians} label="Technicians" />
            </Col>
          </Row>
        )}

        <Row className="g-4">
          {/* Recent registrations */}
          <Col lg={7}>
            <div className="sc-section">
              <div className="sc-section-header">
                <h5>
                  <i className="bi bi-clock-history me-2 text-muted" />Recent Registrations
                </h5>
                <Link
                  to="/admin/users"
                  style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}
                >
                  View all <i className="bi bi-arrow-right" />
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-4">
                  <Spinner animation="border" size="sm" />
                </div>
              ) : recent.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">No users yet.</p>
              ) : (
                <div className="px-3 pb-2">
                  {recent.map((u) => {
                    const avClass   = u.role === 'ADMIN' ? 'av-admin' : u.role === 'TECHNICIAN' ? 'av-tech' : 'av-user';
                    const roleCls   = u.role === 'ADMIN' ? 'rb-admin' : u.role === 'TECHNICIAN' ? 'rb-technician' : 'rb-user';
                    const ini       = (u.name || 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
                    return (
                      <div
                        key={u.id}
                        className="d-flex align-items-center gap-3 py-3"
                        style={{ borderBottom: '1px solid #f3f4f6' }}
                      >
                        <div className={`table-avatar ${avClass}`}>{ini}</div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-semibold text-truncate" style={{ fontSize: 14 }}>{u.name}</div>
                          <div className="text-muted text-truncate" style={{ fontSize: 12 }}>{u.email}</div>
                        </div>
                        <span className={`role-badge ${roleCls}`}>{u.role}</span>
                        <div
                          className="text-muted d-none d-sm-block"
                          style={{ fontSize: 12, whiteSpace: 'nowrap' }}
                        >
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Col>

          {/* Quick actions */}
          <Col lg={5}>
            <div className="sc-section h-100">
              <div className="sc-section-header">
                <h5><i className="bi bi-lightning-charge me-2 text-muted" />Quick Actions</h5>
              </div>
              <div className="p-3 d-grid gap-2">
                {[
                  {
                    to: '/admin/users', icon: 'bi-person-plus-fill',
                    label: 'Create New User', desc: 'Add a user manually',
                    bg: 'rgba(59,130,246,0.07)', color: '#1d4ed8',
                  },
                  {
                    to: '/admin/users', icon: 'bi-people-fill',
                    label: 'Manage All Users', desc: 'Edit roles & account status',
                    bg: 'rgba(124,58,237,0.07)', color: '#6d28d9',
                  },
                  {
                    to: '/admin/users', icon: 'bi-file-earmark-bar-graph-fill',
                    label: 'Generate Report', desc: 'Export user CSV or print report',
                    bg: 'rgba(5,150,105,0.07)', color: '#065f46',
                  },
                  {
                    to: '/notifications', icon: 'bi-bell-fill',
                    label: 'Notifications', desc: 'Check system alerts',
                    bg: 'rgba(217,119,6,0.07)', color: '#92400e',
                  },
                ].map(({ to, icon, label, desc, bg, color }) => (
                  <Link
                    key={label}
                    to={to}
                    className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none"
                    style={{ background: bg }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                      style={{ width: 40, height: 40, background: 'white', color, fontSize: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                    >
                      <i className={`bi ${icon}`} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-semibold" style={{ fontSize: 14, color: '#111827' }}>{label}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{desc}</div>
                    </div>
                    <i className="bi bi-chevron-right text-muted" style={{ fontSize: 12 }} />
                  </Link>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

/* ─── Regular user dashboard ──────────────────────── */
function UserDashboard({ user }) {
  const actions = [
    {
      to: '/tickets', icon: 'bi-ticket-detailed-fill',
      title: 'My Tickets', desc: 'View & create support tickets',
      bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8',
    },
    {
      to: '/notifications', icon: 'bi-bell-fill',
      title: 'Notifications', desc: 'Check your latest alerts',
      bg: 'rgba(217,119,6,0.1)', color: '#92400e',
    },
    {
      to: '/profile', icon: 'bi-person-fill',
      title: 'My Profile', desc: 'Manage your account details',
      bg: 'rgba(124,58,237,0.1)', color: '#6d28d9',
    },
  ];

  return (
    <div className="sc-page">
      <Container fluid="xl">
        {/* Welcome hero */}
        <div className="welcome-hero">
          <Row className="align-items-center">
            <Col>
              <h2>{greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋</h2>
              <p>Welcome back to Smart Campus — your one-stop platform for campus services.</p>
            </Col>
            <Col xs="auto" className="d-none d-md-block">
              <div
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36,
                }}
              >
                🏫
              </div>
            </Col>
          </Row>
        </div>

        {/* Info strip */}
        <Row className="g-3 mb-4">
          <Col sm={6} md={4}>
            <StatCard icon="bi-person-badge" iconClass="si-blue" number={user?.role ?? 'USER'} label="Your Role" />
          </Col>
          <Col sm={6} md={4}>
            <StatCard icon="bi-check-circle-fill" iconClass="si-green" number="Active" label="Account Status" />
          </Col>
          <Col sm={12} md={4}>
            <div className="stat-card">
              <div className="stat-icon si-cyan"><i className="bi bi-envelope-at" /></div>
              <div className="overflow-hidden">
                <div
                  className="stat-number text-truncate"
                  style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0 }}
                  title={user?.email}
                >
                  {user?.email}
                </div>
                <div className="stat-label">Email Address</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Quick actions */}
        <div className="mb-3">
          <span className="fw-bold" style={{ fontSize: 16, color: '#111827' }}>
            <i className="bi bi-lightning-charge me-2 text-warning" />Quick Actions
          </span>
        </div>
        <Row className="g-3 mb-4">
          {actions.map(({ to, icon, title, desc, bg, color }) => (
            <Col key={to} sm={6} md={4}>
              <Link to={to} className="action-card">
                <div
                  className="action-card-icon"
                  style={{ background: bg, color }}
                >
                  <i className={`bi ${icon}`} />
                </div>
                <div className="fw-semibold mb-1" style={{ fontSize: 15 }}>{title}</div>
                <div className="text-muted" style={{ fontSize: 13 }}>{desc}</div>
              </Link>
            </Col>
          ))}
        </Row>

        {/* Profile completion nudge */}
        {(!user?.phone || !user?.department) && (
          <div
            className="p-4 rounded-3 d-flex align-items-center gap-3 flex-wrap"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px dashed rgba(59,130,246,0.3)' }}
          >
            <div className="stat-icon si-blue flex-shrink-0">
              <i className="bi bi-person-lines-fill" />
            </div>
            <div className="flex-grow-1">
              <div className="fw-semibold" style={{ fontSize: 14 }}>Complete your profile</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                Add your phone and department so others can reach you.
              </div>
            </div>
            <Link
              to="/profile"
              className="btn btn-sm btn-outline-primary"
              style={{ borderRadius: 8, whiteSpace: 'nowrap', fontWeight: 600 }}
            >
              Update Profile
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}

/* ─── Root ────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  return (
    <>
      <Navbar />
      {isAdmin ? <AdminDashboard user={user} /> : <UserDashboard user={user} />}
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/member4/Navbar';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  return (
    <>
      <Navbar />
      <Container>
        <h1 className="mb-1">Welcome, {user?.name ?? 'User'}</h1>
        <p className="text-muted mb-4">Role: <span className="badge bg-primary">{user?.role}</span></p>

        <Row className="g-4">
          <Col md={4}>
            <Card as={Link} to="/tickets" className="text-decoration-none h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="bi bi-ticket-detailed fs-1 text-primary" />
                <Card.Title className="mt-2">My Tickets</Card.Title>
                <Card.Text className="text-muted">View and create support tickets</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card as={Link} to="/notifications" className="text-decoration-none h-100 shadow-sm">
              <Card.Body className="text-center">
                <i className="bi bi-bell fs-1 text-warning" />
                <Card.Title className="mt-2">Notifications</Card.Title>
                <Card.Text className="text-muted">Check your alerts</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          {isAdmin && (
            <Col md={4}>
              <Card as={Link} to="/admin/users" className="text-decoration-none h-100 shadow-sm">
                <Card.Body className="text-center">
                  <i className="bi bi-people fs-1 text-success" />
                  <Card.Title className="mt-2">User Management</Card.Title>
                  <Card.Text className="text-muted">Admin tools</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}
