//USER Side - new booking form page

import BookingForm from '../../components/member2/BookingForm';
import { useNavigate } from 'react-router-dom';

export default function CreateBookingPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/bookings');
  };

  return (
    <div style={styles.page}>

      {/* Back link */}
      <a href="/bookings" style={styles.back}>
        ← Back to My Bookings
      </a>

      {/* Page header */}
      <div style={styles.header}>
        <h1 style={styles.title}>New Booking Request</h1>
        <p style={styles.subtitle}>
          Select a resource, choose your time, and submit. An admin will review your request.
        </p>
      </div>

      {/* Card wrapping the form */}
      <div style={styles.card}>
        <BookingForm onSuccess={handleSuccess} />
      </div>

    </div>
  );
}

const styles = {
  page:     { maxWidth: '600px', margin: '0 auto', padding: '32px 16px' },
  back:     { fontSize: '13px', color: '#6B7280', textDecoration: 'none', display: 'inline-block', marginBottom: '16px' },
  header:   { marginBottom: '24px' },
  title:    { fontSize: '26px', fontWeight: '700', margin: '0 0 6px', color: '#111827' },
  subtitle: { fontSize: '14px', color: '#6B7280', margin: 0 },
  card: {
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: '14px',
    padding: '28px',
  },
};