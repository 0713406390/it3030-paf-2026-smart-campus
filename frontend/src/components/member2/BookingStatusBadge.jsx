export default function BookingStatusBadge({ status }) {
  const styles = {
    PENDING:   { background: '#FFF9C4', color: '#B45309', border: '1px solid #F59E0B' },
    APPROVED:  { background: '#DCFCE7', color: '#15803D', border: '1px solid #22C55E' },
    REJECTED:  { background: '#FEE2E2', color: '#B91C1C', border: '1px solid #EF4444' },
    CANCELLED: { background: '#F3F4F6', color: '#6B7280', border: '1px solid #D1D5DB' },
  };

  return (
    <span style={{
      ...styles[status],
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      display: 'inline-block',
    }}>
      {status}
    </span>
  );
}