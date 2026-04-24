export default function ConflictAlert({ message }) {
  if (!message) return null;

  return (
    <div style={{
      background: '#FEF2F2',
      border: '1px solid #FECACA',
      borderLeft: '4px solid #EF4444',
      borderRadius: '8px',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    }}>
      <span style={{ fontSize: '16px', flexShrink: 0 }}>⛔</span>
      <div>
        <p style={{ margin: 0, fontWeight: '600', color: '#B91C1C', fontSize: '13px' }}>
          Scheduling Conflict
        </p>
        <p style={{ margin: '4px 0 0', color: '#DC2626', fontSize: '13px' }}>
          {message}
        </p>
      </div>
    </div>
  );
}