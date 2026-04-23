import { useState, useEffect } from 'react';
import { createBooking } from '../../services/member2/bookingService';
import axios from 'axios';

export default function BookingForm({ onSuccess }) {
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({
    resourceId: '', startTime: '', endTime: '',
    purpose: '', attendees: ''
  });
  const [error, setError] = useState('');

// Load resources from Member 1's API
  useEffect(() => {
    axios.get('/api/resources').then(res => setResources(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await createBooking(form);
      onSuccess();  // redirect or refresh
    } catch (err) {
      if (err.response?.status === 409) {
        setError('This time slot is already booked. Please choose another time.');
      } else {
        setError(err.response?.data || 'Something went wrong');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{color:'red'}}>{error}</div>}
      <select value={form.resourceId}
        onChange={e => setForm({...form, resourceId: e.target.value})}>
        <option value=''>Select a resource</option>
        {resources.map(r => (
          <option key={r.id} value={r.id}
            disabled={r.status === 'OUT_OF_SERVICE'}>
            {r.name} {r.status === 'OUT_OF_SERVICE' ? '(Unavailable)' : ''}
          </option>
        ))}
      </select>
      <input type='datetime-local' placeholder='Start Time'
        value={form.startTime}
        onChange={e => setForm({...form, startTime: e.target.value})} />
      <input type='datetime-local' placeholder='End Time'
        value={form.endTime}
        onChange={e => setForm({...form, endTime: e.target.value})} />
      <textarea placeholder='Purpose of booking'
        value={form.purpose}
        onChange={e => setForm({...form, purpose: e.target.value})} />
      <input type='number' placeholder='Expected Attendees'
        value={form.attendees}
        onChange={e => setForm({...form, attendees: e.target.value})} />
      <button type='submit'>Request Booking</button>
    </form>
  );
}
