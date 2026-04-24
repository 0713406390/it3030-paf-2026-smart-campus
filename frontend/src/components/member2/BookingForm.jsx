import { useState, useEffect } from 'react';
import { createBooking, getAllResources } from '../../services/member2/bookingService';
import ConflictAlert from './ConflictAlert';

export default function BookingForm({ onSuccess }) {
  const [resources, setResources]     = useState([]);
  const [conflictMsg, setConflictMsg] = useState('');
  const [errorMsg, setErrorMsg]       = useState('');
  const [loading, setLoading]         = useState(false);

  const [form, setForm] = useState({
    resourceId: '',
    startTime:  '',
    endTime:    '',
    purpose:    '',
    attendees:  '',
  });

  // Load resources from Member 1's API when form opens
  useEffect(() => {
    getAllResources()
      .then(res => setResources(res.data))
      .catch(() => setErrorMsg('Could not load resources. Is Member 1\'s API running?'));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setConflictMsg('');
    setErrorMsg('');
  };

  const validate = () => {
    if (!form.resourceId) return 'Please select a resource.';
    if (!form.startTime)  return 'Please enter a start time.';
    if (!form.endTime)    return 'Please enter an end time.';
    if (!form.purpose.trim()) return 'Please enter the purpose.';
    if (new Date(form.endTime) <= new Date(form.startTime))
      return 'End time must be after start time.';
    if (new Date(form.startTime) < new Date())
      return 'Start time cannot be in the past.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConflictMsg('');
    setErrorMsg('');

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        resourceId: Number(form.resourceId),
        startTime:  form.startTime,
        endTime:    form.endTime,
        purpose:    form.purpose,
        attendees:  form.attendees ? Number(form.attendees) : null,
      });
      onSuccess(); // redirect to /bookings
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictMsg('This resource is already booked for that time slot. Please choose a different time.');
      } else if (err.response?.status === 400) {
        setErrorMsg(err.response?.data || 'Invalid booking details.');
      } else {
        setErrorMsg('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get today's date-time string for min attribute
  const nowLocal = new Date().toISOString().slice(0, 16);

  return (
    <form onSubmit={handleSubmit} style={styles.form}>

      {/* Resource dropdown */}
      <div style={styles.field}>
        <label style={styles.label}>Resource *</label>
        <select
          name="resourceId"
          value={form.resourceId}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">— Select a resource —</option>
          {resources.map(r => (
            <option
              key={r.id}
              value={r.id}
              disabled={r.status === 'OUT_OF_SERVICE'}
            >
              {r.name} ({r.type}){r.status === 'OUT_OF_SERVICE' ? ' — Unavailable' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Start and end time */}
      <div style={styles.row2}>
        <div style={styles.field}>
          <label style={styles.label}>Start Time *</label>
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            min={nowLocal}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>End Time *</label>
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            min={form.startTime || nowLocal}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
      </div>

      {/* Purpose */}
      <div style={styles.field}>
        <label style={styles.label}>Purpose *</label>
        <input
          type="text"
          name="purpose"
          value={form.purpose}
          onChange={handleChange}
          placeholder="e.g. Group project meeting"
          maxLength={500}
          style={styles.input}
          required
        />
      </div>

      {/* Expected attendees */}
      <div style={styles.field}>
        <label style={styles.label}>Expected Attendees</label>
        <input
          type="number"
          name="attendees"
          value={form.attendees}
          onChange={handleChange}
          placeholder="e.g. 8"
          min={1}
          max={500}
          style={styles.input}
        />
      </div>

      {/* Conflict error — shown when API returns 409 */}
      <ConflictAlert message={conflictMsg} />

      {/* General validation error */}
      {errorMsg && (
        <div style={styles.errorBox}>{errorMsg}</div>
      )}

      {/* Submit */}
      <button
        type="submit"
        style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Request Booking'}
      </button>
    </form>
  );
}

const styles = {
  form:      { display: 'flex', flexDirection: 'column', gap: '16px' },
  field:     { display: 'flex', flexDirection: 'column', gap: '6px' },
  row2:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  label:     { fontSize: '13px', fontWeight: '600', color: '#374151' },
  input: {
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#111827',
    background: '#FAFAFA',
    width: '100%',
    boxSizing: 'border-box',
  },
  errorBox: {
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    color: '#B91C1C',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
  },
  submitBtn: {
    background: '#2563EB',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
  },
};