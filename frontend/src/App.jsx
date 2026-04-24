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
