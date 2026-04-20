

import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Button, ButtonGroup, Container, Nav } from 'react-bootstrap';
import TicketsPage from './pages/member3/TicketsPage';
import AdminCatalogManagePage from './pages/member1/AdminCatalogManagePage';
import UserCatalogPage from './pages/member1/UserCatalogPage';

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

function AppContent() {
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
  const location = useLocation();

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* Side Switch Buttons */}
        <div>
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

        {/* Navigation Menu */}
        <Nav className="gap-2">
          <Link
            to="/tickets"
            className={`btn btn-sm ${
              location.pathname === '/tickets'
                ? 'btn-info'
                : 'btn-outline-info'
            }`}
          >
            Tickets
          </Link>
          {activeSide === 'admin' && (
            <Link
              to="/resources"
              className={`btn btn-sm ${
                location.pathname === '/resources'
                  ? 'btn-warning'
                  : 'btn-outline-warning'
              }`}
            >
              Resources
            </Link>
          )}
          <Link
            to="/resources"
            className="btn btn-sm btn-success"
          >
            Resource Admin
          </Link>
          <Link
            to="/user-catalog"
            className={`btn btn-sm ${
              location.pathname === '/user-catalog'
                ? 'btn-secondary'
                : 'btn-outline-secondary'
            }`}
          >
            Resource User
          </Link>
        </Nav>
      </div>

      <Routes>
        <Route path="/tickets" element={<TicketsPage mode={activeSide} />} />
        <Route path="/resources" element={<AdminCatalogManagePage />} />
        <Route path="/user-catalog" element={<UserCatalogPage />} />
        <Route path="/" element={<TicketsPage mode={activeSide} />} />
      </Routes>
    </Container>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
