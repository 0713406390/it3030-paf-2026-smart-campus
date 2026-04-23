import { useMemo } from 'react';

const DEFAULT_USER = {
  id: 2,
  name: 'Campus User',
  roles: ['USER'],
};

const buildUserFromCredentials = () => {
  const username = localStorage.getItem('smartCampusUsername');
  if (username === 'admin') {
    return {
      id: 1,
      name: 'Administrator',
      roles: ['ADMIN'],
    };
  }

  if (username === 'user') {
    return {
      id: 2,
      name: 'Campus User',
      roles: ['USER'],
    };
  }

  return null;
};

export const useAuth = () => {
  const user = useMemo(() => {
    try {
      const derived = buildUserFromCredentials();
      if (derived) {
        return {
          ...DEFAULT_USER,
          ...derived,
        };
      }

      const storedUser = localStorage.getItem('smartCampusUser');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        return {
          ...DEFAULT_USER,
          ...parsed,
          roles: Array.isArray(parsed.roles) && parsed.roles.length > 0 ? parsed.roles : DEFAULT_USER.roles,
        };
      }
    } catch (error) {
      // Fallback to a local dev user profile.
    }

    return DEFAULT_USER;
  }, []);

  return {
    isAuthenticated: true,
    user,
  };
};
