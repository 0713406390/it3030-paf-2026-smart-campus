// Color-coded pill showing booking status
const statusColors = {
  PENDING:   'background: #FFF9C4; color: #F57F17; border: 1px solid #F9A825',
  APPROVED:  'background: #E8F5E9; color: #2E7D32; border: 1px solid #4CAF50',
  REJECTED:  'background: #FFEBEE; color: #C62828; border: 1px solid #EF5350',
  CANCELLED: 'background: #F5F5F5; color: #616161; border: 1px solid #BDBDBD',
};

export default function BookingStatusBadge({ status }) {
  return (
    <span style={{
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold',
      ...parseStyle(statusColors[status])
    }}>
      {status}
    </span>
  );
}
