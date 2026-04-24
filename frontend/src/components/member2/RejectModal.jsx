//Admin popup - enter reason before rejecting

import { useState } from 'react';

export default function RejectModal({ booking, onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  const [error, setError]   = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('You must provide a rejection reason.');
      return;
    }
    onConfirm(booking.id, reason);
    onClose();
  };

  // Clicking the dark overlay closes the modal
  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        <h3 style={styles.title}>Reject Booking #{booking.id}</h3>
        <p style={styles.subtitle}>
          Resource ID: {booking.resourceId} · {booking.purpose}
        </p>

        <div style={styles.field}>
          <label style={styles.label}>Rejection Reason *</label>
          <textarea
            rows={4}
            value={reason}
            onChange={e => { setReason(e.target.value); setError(''); }}
            placeholder="e.g. Room is reserved for examinations on this date."
            style={styles.textarea}
          />
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.confirmBtn} onClick={handleConfirm}>
            Confirm Reject
          </button>
        </div>

      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff',
    borderRadius: '14px',
    padding: '28px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  title:      { fontSize: '18px', fontWeight: '700', color: '#111827', margin: '0 0 6px' },
  subtitle:   { fontSize: '13px', color: '#6B7280', margin: '0 0 20px' },
  field:      { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' },
  label:      { fontSize: '13px', fontWeight: '600', color: '#374151' },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box',
  },
  errorText:  { color: '#DC2626', fontSize: '12px', margin: 0 },
  actions:    { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  cancelBtn: {
    background: '#F3F4F6',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    padding: '8px 18px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  confirmBtn: {
    background: '#DC2626',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 18px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};