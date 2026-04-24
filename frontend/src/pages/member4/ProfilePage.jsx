import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/member4/Navbar';
import { getMyProfile, updateMyProfile } from '../../services/member4/userService';

export default function ProfilePage() {
  const { user, isAdmin, updateCurrentUser } = useAuth();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    department: '',
    bio: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const profile = await getMyProfile();
        updateCurrentUser(profile);
        setForm({
          name: profile.name || '',
          phone: profile.phone || '',
          department: profile.department || '',
          bio: profile.bio || '',
        });
      } catch (err) {
        // Fall back to auth context so the user can still fill in their details
        if (user) {
          setForm({
            name: user.name || '',
            phone: user.phone || '',
            department: user.department || '',
            bio: user.bio || '',
          });
          setError('Could not load saved profile data from server. You can still update your details below.');
        } else {
          setError(err.response?.data?.message || 'Failed to load profile data. Please refresh the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const updated = await updateMyProfile(form);
      setForm({
        name: updated.name || '',
        phone: updated.phone || '',
        department: updated.department || '',
        bio: updated.bio || '',
      });
      updateCurrentUser(updated);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            <Card className="shadow-sm border-0">
              <Card.Body className="p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-4">
                  <div>
                    <h1 className="mb-1">My Profile</h1>
                    <p className="text-muted mb-0">Manage your personal account details and access level.</p>
                  </div>
                  <Badge bg={isAdmin ? 'success' : 'primary'} className="px-3 py-2">
                    {user?.role ?? 'USER'}
                  </Badge>
                </div>

                {message && <Alert variant="success">{message}</Alert>}

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" role="status" />
                  </div>
                ) : (
                  <>
                  {error && (
                    <Alert variant="warning" className="py-2" style={{ fontSize: 14 }}>
                      <i className="bi bi-exclamation-triangle me-2"></i>{error}
                    </Alert>
                  )}
                  <Form onSubmit={handleSubmit}>
                    <Row className="g-3 mb-4">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Full name</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            maxLength={120}
                            required
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Phone number</Form.Label>
                          <Form.Control
                            type="text"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            maxLength={30}
                            placeholder="Optional"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Department</Form.Label>
                          <Form.Control
                            type="text"
                            name="department"
                            value={form.department}
                            onChange={handleChange}
                            maxLength={120}
                            placeholder="Optional"
                          />
                        </Form.Group>
                      </Col>

                      <Col md={12}>
                        <Form.Group>
                          <Form.Label>Bio</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            maxLength={500}
                            placeholder="Tell others a bit about yourself"
                          />
                          <Form.Text className="text-muted">{form.bio.length}/500</Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button type="submit" disabled={saving}>
                      {saving ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Profile'
                      )}
                    </Button>
                  </Form>
                  </>
                )}

                <Row className="g-3">
                  <Col md={6}>
                    <div className="p-3 border rounded-3 h-100">
                      <div className="small text-muted text-uppercase fw-semibold mb-1">Email</div>
                      <div className="fw-medium">{user?.email ?? '-'}</div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 border rounded-3 h-100">
                      <div className="small text-muted text-uppercase fw-semibold mb-1">Account status</div>
                      <div className="fw-medium">{user?.enabled ? 'Active' : 'Disabled'}</div>
                    </div>
                  </Col>
                </Row>

                <div className="mt-4 p-3 border rounded-3 bg-white">
                  <div className="small text-muted text-uppercase fw-semibold mb-1">Next steps</div>
                  <p className="mb-0 text-muted">
                    Use the dashboard for tickets and notifications. If you are an admin, the user management area is available from the top navigation.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}