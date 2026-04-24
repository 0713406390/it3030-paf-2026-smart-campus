//ADMIN Side - all bookings table+approve/reject

import { useState, useEffect } from 'react';
import {
  getAllBookings,
  approveBooking,
  rejectBooking,
} from '../../services/member2/bookingService';
import AdminBookingRow from '../../components/member2/AdminBookingRow';
import RejectModal from '../../components/member2/RejectModal';

export default function AdminBookingsPage() {
  const [bookings, setBookings]         = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [successMsg, setSuccessMsg]     = useState('');
  const [rejectTarget, setRejectTarget] = useState(null); // booking to reject
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchAll();
  }, []);

  // Apply filter whenever bookings or filter changes
  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFiltered(bookings);
    } else {
      setFiltered(bookings.filter(b => b.status === statusFilter));
    }
  }, [bookings, statusFilter]);

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveBooking(id);
      setSuccessMsg(`Booking #${id} approved.`);
      fetchAll(); // refresh table
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Cannot approve — a conflict exists for this time slot.');
      } else {
        alert(err.response?.data || 'Could not approve booking.');
      }
    }
  };

  const handleRejectConfirm = async (id, reason) => {
    try {
      await rejectBooking(id, reason);
      setSuccessMsg(`Booking #${id} rejected.`);
      fetchAll(); // refresh table
    } catch (err) {
      alert(err.response?.data || 'Could not reject booking.');
    }
  };

  const pendingCount  = bookings.filter(b => b.status === 'PENDING').length;
  const approvedCount = bookings.filter(b => b.status === 'APPROVED').length;

  return (
    <div style={styles.page}>

      {/* Page header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Booking Management</h1>
          <p style={styles.subtitle}>Review and action all booking requests</p>
        </div>
        <div style={styles.statsRow}>
          <div style={styles.statBox}>
            <span style={styles.statNum}>{bookings.length}</span>
            <span style={styles.statLabel}>Total</span>
          </div>
          <div style={{ ...styles.statBox, borderColor: '#F59E0B' }}>
            <span style={{ ...styles.statNum, color: '#B45309' }}>{pendingCount}</span>
            <span style={styles.statLabel}>Pending</span>
          </div>
          <div style={{ ...styles.statBox, borderColor: '#22C55E' }}>
            <span style={{ ...styles.statNum, color: '#15803D' }}>{approvedCount}</span>
            <span style={styles.statLabel}>Approved</span>
          </div>
        </div>
      </div>

      {/* Success message */}
      {successMsg && (
        <div style={styles.successBox}>✅ {successMsg}</div>
      )}

      {/* Error message */}
      {error && (
        <div style={styles.errorBox}>{error}</div>
      )}

      {/* Filter bar */}
      <div style={styles.filterBar}>
        <span style={styles.filterLabel}>Filter by status:</span>
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map(s => (
          <button
            key={s}
            style={{
              ...styles.filterBtn,
              background: statusFilter === s ? '#2563EB' : '#F3F4F6',
              color:      statusFilter === s ? '#fff'    : '#374151',
              border:     statusFilter === s ? '1px solid #2563EB' : '1px solid #D1D5DB',
            }}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
        <button style={styles.refreshBtn} onClick={fetchAll}>
          ↻ Refresh
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p style={styles.loading}>Loading bookings...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.empty}>No bookings found for this filter.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Resource</th>
                <th style={styles.th}>User</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Purpose</th>
                <th style={styles.th}>Pax</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => (
                <AdminBookingRow
                  key={booking.id}
                  booking={booking}
                  onApprove={handleApprove}
                  onRejectClick={setRejectTarget}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject modal — only shown when a booking is selected for rejection */}
      {rejectTarget && (
        <RejectModal
          booking={rejectTarget}
          onConfirm={handleRejectConfirm}
          onClose={() => setRejectTarget(null)}
        />
      )}

    </div>
  );
}

const styles = {
  page:        { maxWidth: '1100px', margin: '0 auto', padding: '32px 16px' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' },
  title:       { fontSize: '26px', fontWeight: '700', margin: 0, color: '#111827' },
  subtitle:    { fontSize: '14px', color: '#6B7280', marginTop: '4px' },
  statsRow:    { display: 'flex', gap: '12px' },
  statBox: {
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    padding: '10px 18px',
    textAlign: 'center',
    minWidth: '70px',
  },
  statNum:     { display: 'block', fontSize: '22px', fontWeight: '700', color: '#111827' },
  statLabel:   { fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' },
  filterBar:   { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' },
  filterLabel: { fontSize: '13px', color: '#6B7280', marginRight: '4px' },
  filterBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '0.3px',
  },
  refreshBtn: {
    marginLeft: 'auto',
    padding: '6px 14px',
    borderRadius: '6px',
    fontSize: '12px',
    background: '#F9FAFB',
    border: '1px solid #D1D5DB',
    color: '#374151',
    cursor: 'pointer',
  },
  tableWrap:   { overflowX: 'auto', borderRadius: '12px', border: '1px solid #E5E7EB' },
  table:       { width: '100%', borderCollapse: 'collapse', background: '#fff' },
  thead:       { background: '#F9FAFB' },
  th: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    borderBottom: '1px solid #E5E7EB',
  },
  loading:     { textAlign: 'center', padding: '48px', color: '#9CA3AF' },
  empty:       { textAlign: 'center', padding: '48px', color: '#9CA3AF' },
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
};