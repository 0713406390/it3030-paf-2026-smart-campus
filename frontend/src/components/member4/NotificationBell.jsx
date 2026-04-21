import { useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getUnreadCount } from '../../services/member4/notificationService';

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadUnread = async () => {
      try {
        const unread = await getUnreadCount();
        if (active) {
          setCount(unread);
        }
      } catch {
        if (active) {
          setCount(0);
        }
      }
    };

    loadUnread();
    const timer = setInterval(loadUnread, 30000);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <Link to="/notifications" className="position-relative text-decoration-none text-dark" aria-label="Notifications">
      <i className="bi bi-bell fs-5" />
      {count > 0 && (
        <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
          {count}
        </Badge>
      )}
    </Link>
  );
}
