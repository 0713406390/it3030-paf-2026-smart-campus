//Single booking card - used inside BookingList

import BookingStatusBadge from './BookingStatusBadge';

export default function BookingCard({ booking, onCancel }) {
  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <div style={styles.card}>
      {/* Left: booking info */}
      <div style={styles.left}>
        <div style={styles.resourceName}>
          Resource ID: {booking.resourceId}
        </div>
        <div style={styles.timeRange}>
          {formatDateTime(booking.startTime)} → {formatDateTime(booking.endTime)}
        </div>
        <div style={styles.purpose}>
          📋 {booking.purpose}
        </div>
        {booking.attendees && (
          <div style={styles.meta}>
            👥 {booking.attendees} attendees
          </div>
        )}
        {/* Show rejection reason only when rejected */}
        {booking.status === 'REJECTED' && booking.rejectionReason && (
          <div style={styles.rejectionBox}>
            ❌ Rejected: {booking.rejectionReason}
          </div>
        )}
      </div>

      {/* Right: status + action */}
      <div style={styles.right}>
        <BookingStatusBadge status={booking.status} />

        {/* Cancel button only for APPROVED bookings */}
        {booking.status === 'APPROVED' && (
          <button
            style={styles.cancelBtn}
            onClick={() => onCancel(booking.id)}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: '12px',
    padding: '18px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
  },
  left:         { flex: 1 },
  right:        { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 },
  resourceName: { fontWeight: '600', fontSize: '15px', marginBottom: '4px', color: '#111827' },
  timeRange:    { fontSize: '13px', color: '#6B7280', fontFamily: 'monospace', marginBottom: '4px' },
  purpose:      { fontSize: '13px', color: '#374151', marginBottom: '4px' },
  meta:         { fontSize: '12px', color: '#9CA3AF' },
  rejectionBox: {
    marginTop: '8px',
    fontSize: '12px',
    color: '#B91C1C',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '6px',
    padding: '6px 10px',
  },
  cancelBtn: {
    background: '#F9FAFB',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
  },
};