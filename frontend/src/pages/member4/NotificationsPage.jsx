/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { Alert, Badge, Button, Card, Container, Spinner } from 'react-bootstrap';
import Navbar from '../../components/member4/Navbar';
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from '../../services/member4/notificationService';

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark notification as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      await loadNotifications();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Notifications</h1>
          <Button variant="outline-secondary" size="sm" onClick={loadNotifications}>Refresh</Button>
        </div>

        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : items.length === 0 ? (
          <Card body className="text-center text-muted">No notifications yet.</Card>
        ) : (
          <div className="d-grid gap-3">
            {items.map((n) => (
              <Card key={n.id} className={n.read ? '' : 'border-primary'}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="mb-2">
                        <Badge bg={n.read ? 'secondary' : 'primary'}>{n.type || 'INFO'}</Badge>
                      </div>
                      <Card.Text className="mb-2">{n.message}</Card.Text>
                      <small className="text-muted">
                        {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      {!n.read && (
                        <Button size="sm" variant="outline-primary" onClick={() => handleRead(n.id)}>
                          Mark read
                        </Button>
                      )}
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(n.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
