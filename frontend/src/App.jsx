import React, { useMemo, useState } from 'react';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import TicketsPage from './pages/member3/TicketsPage';

const persistRoleCredentials = (side) => {
  if (side === 'admin') {
    localStorage.setItem('smartCampusUsername', 'admin');
    localStorage.setItem('smartCampusPassword', 'admin123');
    localStorage.setItem('smartCampusUser', JSON.stringify({
      id: 1,
      name: 'Administrator',
      roles: ['ADMIN'],
    }));
    localStorage.setItem('smartCampusActiveSide', 'admin');
    return;
  }

  localStorage.setItem('smartCampusUsername', 'user');
  localStorage.setItem('smartCampusPassword', 'user123');
  localStorage.setItem('smartCampusUser', JSON.stringify({
    id: 2,
    name: 'Campus User',
    roles: ['USER'],
  }));
  localStorage.setItem('smartCampusActiveSide', 'user');
};

function App() {
  const initialSide = useMemo(() => {
    const querySide = new URLSearchParams(window.location.search).get('side');
    if (querySide === 'admin' || querySide === 'user') {
      return querySide;
    }

    const saved = localStorage.getItem('smartCampusActiveSide');
    if (saved === 'admin' || saved === 'user') {
      return saved;
    }

    return 'user';
  }, []);

  const [activeSide, setActiveSide] = useState(initialSide);

  const handleSwitchSide = (side) => {
    setActiveSide(side);
    persistRoleCredentials(side);
    const targetUrl = new URL(window.location.href);
    targetUrl.searchParams.set('side', side);
    window.history.replaceState({}, '', targetUrl.toString());
    window.location.reload();
  };

  return (
    <Container fluid className="py-3 px-3 px-md-4">
      <div className="d-flex justify-content-end mb-3">
        <ButtonGroup>
          <Button
            variant={activeSide === 'user' ? 'primary' : 'outline-primary'}
            onClick={() => handleSwitchSide('user')}
          >
            User Side
          </Button>
          <Button
            variant={activeSide === 'admin' ? 'danger' : 'outline-danger'}
            onClick={() => handleSwitchSide('admin')}
          >
            Admin Side
          </Button>
        </ButtonGroup>
      </div>

      <TicketsPage mode={activeSide} />
    </Container>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/member4/ProtectedRoute';
import AdminRoute from './components/member4/AdminRoute';

import LoginPage from './pages/member4/LoginPage';
import RegisterPage from './pages/member4/RegisterPage';
import DashboardPage from './pages/member4/DashboardPage';
import ProfilePage from './pages/member4/ProfilePage';
import AdminUsersPage from './pages/member4/AdminUsersPage';
import NotificationsPage from './pages/member4/NotificationsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected (any logged-in user) */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />

          {/* Placeholder routes — replaced when merged with Member 3 */}
          <Route path="/tickets" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/admin" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/tickets" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
export default App;
