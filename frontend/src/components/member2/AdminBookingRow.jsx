//Single row in the admin table - approve/reject buttons

import BookingStatusBadge from './BookingStatusBadge';

export default function AdminBookingRow({ booking, onApprove, onRejectClick }) {
  const formatDateTime = (dt) =>
    new Date(dt).toLocaleString('en-GB', {
      day: '2-digit', month: 'short',
      hour: '2-digit', minute: '2-digit',
    });

  return (
    <tr style={styles.row}>
      <td style={styles.td}>
        <span style={styles.idBadge}>#{booking.id}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.bold}>Resource {booking.resourceId}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.small}>{booking.userId}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.mono}>
          {formatDateTime(booking.startTime)}<br/>
          → {formatDateTime(booking.endTime)}
        </span>
      </td>
      <td style={styles.td}>
        <span style={styles.purpose}>{booking.purpose}</span>
      </td>
      <td style={styles.td}>
        <span style={styles.mono}>{booking.attendees ?? '—'}</span>
      </td>
      <td style={styles.td}>
        <BookingStatusBadge status={booking.status} />
      </td>
      <td style={styles.td}>
        {booking.status === 'PENDING' ? (
          <div style={styles.actions}>
            <button
              style={styles.approveBtn}
              onClick={() => onApprove(booking.id)}
            >
              Approve
            </button>
            <button
              style={styles.rejectBtn}
              onClick={() => onRejectClick(booking)}
            >
              Reject
            </button>
          </div>
        ) : (
          <span style={styles.noAction}>—</span>
        )}
      </td>
    </tr>
  );
}

const styles = {
  row:       { borderBottom: '1px solid #F3F4F6' },
  td:        { padding: '14px 12px', fontSize: '13px', verticalAlign: 'middle' },
  idBadge:   { fontFamily: 'monospace', color: '#9CA3AF', fontSize: '12px' },
  bold:      { fontWeight: '600', color: '#111827' },
  small:     { fontSize: '12px', color: '#6B7280' },
  mono:      { fontFamily: 'monospace', fontSize: '12px', color: '#374151' },
  purpose:   { color: '#6B7280', fontSize: '12px', maxWidth: '140px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  actions:   { display: 'flex', gap: '6px' },
  noAction:  { color: '#D1D5DB' },
  approveBtn: {
    background: '#DCFCE7',
    color: '#15803D',
    border: '1px solid #86EFAC',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  rejectBtn: {
    background: '#FEE2E2',
    color: '#B91C1C',
    border: '1px solid #FCA5A5',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};