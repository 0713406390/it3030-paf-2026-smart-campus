import axios from 'axios';

const TOKEN_KEYS = ['token', 'smartcampus_token'];
const USER_KEYS = ['user', 'smartcampus_user'];

const readToken = () => {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key);
    if (value) return value;
  }
  return null;
};

export const setAuthToken = (token) => {
  TOKEN_KEYS.forEach((key) => localStorage.setItem(key, token));
};

export const clearAuthToken = () => {
  TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  USER_KEYS.forEach((key) => localStorage.removeItem(key));
};

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export const publicApi = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = readToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      if (!window.location.pathname.startsWith('/login') &&
          !window.location.pathname.startsWith('/register') &&
          !window.location.pathname.startsWith('/forgot-password')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;