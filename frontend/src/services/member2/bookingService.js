import axios from 'axios';

const BASE_URL = '/api/bookings';

// Create a new booking
export const createBooking = (bookingData) =>
    axios.post(BASE_URL, bookingData);

// Get logged-in user's bookings
export const getMyBookings = () =>
    axios.get(`${BASE_URL}/my`);

// Get all bookings (admin)
export const getAllBookings = () =>
    axios.get(BASE_URL);

// Get one booking
export const getBookingById = (id) =>
    axios.get(`${BASE_URL}/${id}`);

// Approve or reject (admin)
export const updateBookingStatus = (id, statusData) =>
    axios.patch(`${BASE_URL}/${id}/status`, statusData);

// Cancel booking
export const cancelBooking = (id) =>
    axios.delete(`${BASE_URL}/${id}`);
