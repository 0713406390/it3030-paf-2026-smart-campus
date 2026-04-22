/* eslint-disable react-hooks/set-state-in-effect, react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api, { clearAuthToken, publicApi, setAuthToken } from '../services/member4/api';

const AuthContext = createContext(null);

function readSavedUser() {
  const saved = localStorage.getItem('user');
  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readSavedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);

    const syncCurrentUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch {
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    syncCurrentUser();
  }, []);

  const login = async (email, password) => {
    clearAuthToken();
    const { data } = await publicApi.post('/auth/login', { email, password });
    const nextUser = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      enabled: true,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setAuthToken(data.token);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (name, email, password) => {
    clearAuthToken();
    const { data } = await publicApi.post('/auth/register', { name, email, password });
    const nextUser = {
      id: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      enabled: true,
    };

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setAuthToken(data.token);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === 'ADMIN',
      isAuthenticated: Boolean(user),
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
