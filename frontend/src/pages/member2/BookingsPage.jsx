//USER Side - my bookings list+cancel

import { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../../services/member2/bookingService';
import BookingList from '../../components/member2/BookingList';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getMyBookings();
      setBookings(res.data);
    } catch {
      setError('Failed to load bookings. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setSuccessMsg('Booking cancelled successfully.');
      fetchBookings(); // refresh list
    } catch (err) {
      alert(err.response?.data || 'Could not cancel booking.');
    }
  };

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Bookings</h1>
          <p style={styles.subtitle}>View and manage your booking requests</p>
        </div>
        <a href="/bookings/new" style={styles.newBtn}>
          + New Booking
        </a>
      </div>

      {/* Success message */}
      {successMsg && (
        <div style={styles.successBox}>
          ✅ {successMsg}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <p style={styles.loading}>Loading your bookings...</p>}

      {/* Booking list */}
      {!loading && !error && (
        <BookingList
          bookings={bookings}
          onCancel={handleCancel}
        />
      )}

    </div>
  );
}

const styles = {
  page:       { maxWidth: '800px', margin: '0 auto', padding: '32px 16px' },
  header:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' },
  title:      { fontSize: '26px', fontWeight: '700', margin: 0, color: '#111827' },
  subtitle:   { fontSize: '14px', color: '#6B7280', marginTop: '4px' },
  newBtn: {
    background: '#2563EB',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '600',
    flexShrink: 0,
  },
  successBox: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    color: '#15803D',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#B91C1C',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  loading: { textAlign: 'center', padding: '48px', color: '#6B7280' },
};