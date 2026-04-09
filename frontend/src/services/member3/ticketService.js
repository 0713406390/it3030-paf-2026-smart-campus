import api from './api';

// Get all tickets (admin only)
export const getAllTickets = async (page = 0, size = 10, status = null, category = null, priority = null) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('size', size);
  
  if (status) params.append('status', status);
  if (category) params.append('category', category);
  if (priority) params.append('priority', priority);

  const hasFilters = Boolean(status || category || priority);
  const endpoint = hasFilters ? '/api/tickets/filter' : '/api/tickets';
  const response = await api.get(`${endpoint}?${params}`);
  return response.data;
};

// Get users (for technician assignment dropdown)
export const getUsers = async (options = {}) => {
  try {
    const params = new URLSearchParams();
    if (options?.role) {
      params.append('role', options.role);
    }

    const query = params.toString();
    const response = await api.get(query ? `/api/users?${query}` : '/api/users');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    return [];
  }
};

// Get current user's tickets
export const getMyTickets = async (page = 0, size = 10) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('size', size);
  
  const response = await api.get(`/api/tickets/my-tickets?${params}`);
  return response.data;
};

// Get tickets assigned to current user (technician)
export const getAssignedTickets = async (page = 0, size = 10) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('size', size);
  
  const response = await api.get(`/api/tickets/assigned-to-me?${params}`);
  return response.data;
};

// Get ticket by ID
export const getTicketById = async (id) => {
  const response = await api.get(`/api/tickets/${id}`);
  return response.data;
};

// Create a new ticket
export const createTicket = async (ticketData) => {
  const response = await api.post('/api/tickets', ticketData);
  return response.data;
};

// Update a ticket
export const updateTicket = async (id, ticketData) => {
  const response = await api.put(`/api/tickets/${id}`, ticketData);
  return response.data;
};

// Update ticket status
export const updateTicketStatus = async (id, status, notes = '') => {
  const params = new URLSearchParams();
  params.append('status', status);
  if (notes) params.append('notes', notes);
  
  const response = await api.put(`/api/tickets/${id}/status?${params}`);
  return response.data;
};

// Assign technician to ticket
export const assignTechnician = async (ticketId, technicianId) => {
  const params = new URLSearchParams();
  params.append('technicianId', technicianId);
  
  const response = await api.put(`/api/tickets/${ticketId}/assign?${params}`);
  return response.data;
};

// Upload attachments to a ticket
export const uploadAttachments = async (ticketId, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  
  const response = await api.post(`/api/tickets/${ticketId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete an attachment
export const deleteAttachment = async (attachmentId) => {
  const response = await api.delete(`/api/tickets/attachments/${attachmentId}`);
  return response.data;
};

// Get ticket comments
export const getTicketComments = async (ticketId) => {
  const response = await api.get(`/api/tickets/${ticketId}/comments`);
  return response.data;
};

// Add a comment to a ticket
export const addComment = async (ticketId, content) => {
  const response = await api.post(`/api/tickets/${ticketId}/comments`, { content });
  return response.data;
};

// Update a comment
export const updateComment = async (commentId, content) => {
  const response = await api.put(`/api/tickets/comments/${commentId}`, { content });
  return response.data;
};

// Delete a comment
export const deleteComment = async (commentId) => {
  const response = await api.delete(`/api/tickets/comments/${commentId}`);
  return response.data;
};

// Get all attachments for a ticket
export const getTicketAttachments = async (ticketId) => {
  const response = await api.get(`/api/tickets/${ticketId}/attachments`);
  return response.data;
};

// View/download an attachment using authenticated request headers
export const viewAttachment = async (attachmentId) => {
  const response = await api.get(`/api/tickets/attachments/${attachmentId}/view`, {
    responseType: 'blob',
  });

  const contentType = response.headers['content-type'] || 'application/octet-stream';
  const blob = new Blob([response.data], { type: contentType });
  const url = window.URL.createObjectURL(blob);

  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (!win) {
    window.location.href = url;
  }

  // Delay cleanup so the new tab has time to consume the blob URL.
  setTimeout(() => window.URL.revokeObjectURL(url), 60000);
};