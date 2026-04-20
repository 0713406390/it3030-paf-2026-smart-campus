import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/resources';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token or basic auth to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  const username = localStorage.getItem('smartCampusUsername');
  const password = localStorage.getItem('smartCampusPassword');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (username && password) {
    // Use Basic Auth if we have credentials
    const credentials = btoa(`${username}:${password}`);
    config.headers.Authorization = `Basic ${credentials}`;
  }
  return config;
});

export const resourceService = {
  // Get all resources
  getAllResources: (page = 0, size = 10) => {
    return api.get('', {
      params: { page, size },
    });
  },

  // Get resource by ID
  getResourceById: (id) => {
    return api.get(`/${id}`);
  },

  // Get resources by type
  getResourcesByType: (type, page = 0, size = 10) => {
    return api.get(`/by-type/${type}`, {
      params: { page, size },
    });
  },

  // Get resources by status
  getResourcesByStatus: (status, page = 0, size = 10) => {
    return api.get(`/by-status/${status}`, {
      params: { page, size },
    });
  },

  // Get resources by location
  getResourcesByLocation: (location, page = 0, size = 10) => {
    return api.get(`/by-location/${location}`, {
      params: { page, size },
    });
  },

  // Get resources by filters
  getResourcesByFilters: (filters, page = 0, size = 10) => {
    return api.get('/filter', {
      params: { ...filters, page, size },
    });
  },

  // Search and filter resources
  searchResources: (searchTerm, filters, page = 0, size = 10) => {
    const params = {
      search: searchTerm || '',
      type: filters.type || '',
      capacity: filters.capacity || '',
      location: filters.location || '',
      status: filters.status || '',
      page,
      size
    };
    return api.get('/search', { params });
  },

  // Create new resource
  createResource: (resourceData) => {
    return api.post('', resourceData);
  },

  // Update resource
  updateResource: (id, resourceData) => {
    return api.put(`/${id}`, resourceData);
  },

  // Delete resource
  deleteResource: (id) => {
    return api.delete(`/${id}`);
  },
};

export default resourceService;
