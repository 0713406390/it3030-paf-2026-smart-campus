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
