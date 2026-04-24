import axios from 'axios';

const BASE = '/api/bookings';

// -----USER SIDE------------------------------------------------

// Create a new booking request
export const createBooking = (data) =>
  axios.post(BASE, data);

// Get logged-in user's own bookings
export const getMyBookings = () =>
  axios.get(`${BASE}/my`);

// Cancel an approved booking (user cancels their own)
export const cancelBooking = (id) =>
  axios.delete(`${BASE}/${id}`);

// Get one booking by ID
export const getBookingById = (id) =>
  axios.get(`${BASE}/${id}`);

// -----ADMIN SIDE-----------------------------------------

// Get ALL bookings (admin only)
export const getAllBookings = () =>
  axios.get(BASE);

// Approve a booking
export const approveBooking = (id) =>
  axios.patch(`${BASE}/${id}/status`, { status: 'APPROVED' });

// Reject a booking with a reason
export const rejectBooking = (id, rejectionReason) =>
  axios.patch(`${BASE}/${id}/status`, { status: 'REJECTED', rejectionReason });

// ----- SHARED ------------------------------------------------

// Load all resources (from Member 1's API) for the booking form dropdown
export const getAllResources = () =>
  axios.get('/api/resources');