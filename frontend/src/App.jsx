import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/member4/ProtectedRoute';
import AdminRoute from './components/member4/AdminRoute';

import LoginPage from './pages/member4/LoginPage';
import RegisterPage from './pages/member4/RegisterPage';
import DashboardPage from './pages/member4/DashboardPage';
import AdminUsersPage from './pages/member4/AdminUsersPage';
import NotificationsPage from './pages/member4/NotificationsPage';
import ForgotPasswordPage from './pages/member4/ForgotPasswordPage';
import OAuth2RedirectPage from './pages/member4/OAuth2RedirectPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2RedirectPage />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected (any logged-in user) */}
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