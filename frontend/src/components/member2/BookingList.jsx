//Renders all booking cards in a list - user side

import BookingCard from './BookingCard';

export default function BookingList({ bookings, onCancel }) {
  if (bookings.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>You have no bookings yet.</p>
        <a href="/bookings/new" style={styles.emptyLink}>
          Make your first booking →
        </a>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {bookings.map(booking => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}

const styles = {
  list:      { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty:     { textAlign: 'center', padding: '60px 20px' },
  emptyText: { color: '#6B7280', fontSize: '15px', marginBottom: '12px' },
  emptyLink: {
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
  },
};