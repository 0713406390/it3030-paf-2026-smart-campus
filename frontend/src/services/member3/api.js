import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
  let username = localStorage.getItem('smartCampusUsername');
  let password = localStorage.getItem('smartCampusPassword');

  if (!username || !password) {
    try {
      const storedUser = localStorage.getItem('smartCampusUser');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const roles = Array.isArray(parsedUser?.roles) ? parsedUser.roles : [];

      if (roles.includes('ADMIN')) {
        username = 'admin';
        password = 'admin123';
      } else {
        username = 'user';
        password = 'user123';
      }
    } catch (error) {
      username = 'user';
      password = 'user123';
    }
  }

  const token = btoa(`${username}:${password}`);

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Basic ${token}`,
    },
  };
});

export default api;
