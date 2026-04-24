import React, { useEffect, useState } from 'react';
import { Alert, Container, Nav, Tab } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';
import TicketList from '../../components/member3/TicketList';
import CreateTicketPage from './CreateTicketPage';

const TicketsPage = ({ mode = 'user' }) => {
  const initialTab = mode === 'admin' ? 'all-tickets' : 'my-tickets';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setActiveTab(mode === 'admin' ? 'all-tickets' : 'my-tickets');
    setShowCreateForm(false);
  }, [mode]);
  
  const handleTabSelect = (key) => {
    setActiveTab(key);
    if (key === 'create') {
      setShowCreateForm(true);
    } else {
      setShowCreateForm(false);
    }
  };
  
  const handleTicketCreated = (result) => {
    setShowCreateForm(false);
    setActiveTab('my-tickets');

    if (result?.isCreate && result?.ticket) {
      setSubmissionResult(result);
    } else {
      setSubmissionResult(null);
    }
  };
  
  const roles = user?.roles || [];
  const isAdmin = mode === 'admin' || roles.includes('ADMIN');
  const isUserMode = mode !== 'admin';
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">{isAdmin && !isUserMode ? 'Admin Ticket Dashboard' : 'Incident Tickets'}</h1>

      {submissionResult?.ticket && (
        <Alert variant="success" dismissible onClose={() => setSubmissionResult(null)}>
          <Alert.Heading>Ticket submitted successfully</Alert.Heading>
          <p className="mb-2">
            Your request has been submitted and saved in the system.
          </p>
          <div><strong>Ticket ID:</strong> {submissionResult.ticket.id}</div>
          <div><strong>Title:</strong> {submissionResult.ticket.title}</div>
          <div><strong>Request Type:</strong> {submissionResult.ticket.requestType}</div>
          <div><strong>Priority:</strong> {submissionResult.ticket.priority}</div>
          <div><strong>Requester:</strong> {submissionResult.ticket.requesterName}</div>
          <div><strong>Email:</strong> {submissionResult.ticket.requesterEmail}</div>
          {submissionResult.warning && (
            <div className="mt-2 text-warning-emphasis"><strong>Note:</strong> {submissionResult.warning}</div>
          )}
        </Alert>
      )}
      
      <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
        <Nav variant="tabs" className="mb-4">
          {isUserMode && (
            <Nav.Item>
              <Nav.Link eventKey="my-tickets">My Tickets</Nav.Link>
            </Nav.Item>
          )}

          {isAdmin && (
            <Nav.Item>
              <Nav.Link eventKey="assigned-tickets">Assigned to Me</Nav.Link>
            </Nav.Item>
          )}

          {isAdmin && (
            <Nav.Item>
              <Nav.Link eventKey="all-tickets">All Tickets</Nav.Link>
            </Nav.Item>
          )}

          {isUserMode && (
            <Nav.Item>
              <Nav.Link eventKey="create">Create New Ticket</Nav.Link>
            </Nav.Item>
          )}
        </Nav>
        
        <Tab.Content>
          {isUserMode && (
            <Tab.Pane eventKey="my-tickets">
              <TicketList view="my" />
            </Tab.Pane>
          )}
          
          {isAdmin && (
            <Tab.Pane eventKey="assigned-tickets">
              <TicketList view="assigned" />
            </Tab.Pane>
          )}
          
          {isAdmin && (
            <Tab.Pane eventKey="all-tickets">
              <TicketList view="all" />
            </Tab.Pane>
          )}
          
          {isUserMode && (
            <Tab.Pane eventKey="create">
              {showCreateForm && (
                <CreateTicketPage onSuccess={handleTicketCreated} />
              )}
            </Tab.Pane>
          )}
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default TicketsPage;