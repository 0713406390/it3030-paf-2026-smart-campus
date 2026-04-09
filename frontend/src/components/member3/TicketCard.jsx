import React, { useState } from 'react';
import { Badge, Card, Button, Modal } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';
import TicketStatusBadge from './TicketStatusBadge';
import TicketDetail from './TicketDetail';
import { useAuth } from '../../hooks/useAuth';

const TicketCard = ({ ticket, onUpdate, view }) => {
  const [showDetail, setShowDetail] = useState(false);
  const { user } = useAuth();
  
  const handleStatusUpdate = (updatedTicket) => {
    onUpdate(updatedTicket);
    setShowDetail(false);
  };
  
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN');
  const isTechnician = roles.includes('TECHNICIAN');
  const canUpdateStatus = isAdmin || (isTechnician && view === 'assigned');
  
  return (
    <>
      <Card className="h-100">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span className="text-truncate fw-bold">{ticket.title}</span>
          <TicketStatusBadge status={ticket.status} />
        </Card.Header>
        
        <Card.Body>
          {view === 'my' && ticket.hasAdminComment && (
            <Badge bg="warning" text="dark" className="mb-2">New admin comment</Badge>
          )}

          <Card.Text className="text-muted small mb-2">
            {ticket.category.replace('_', ' ')} • {ticket.priority}
          </Card.Text>
          
          <Card.Text className="text-truncate">
            {ticket.description}
          </Card.Text>
          
          <div className="mt-auto">
            <small className="text-muted">
              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
            </small>
          </div>
        </Card.Body>
        
        <Card.Footer className="d-flex justify-content-between">
          <div>
            {ticket.assignedTechnician ? (
              <small className="text-muted">
                Assigned to: {ticket.assignedTechnician.name}
              </small>
            ) : view === 'my' ? (
              <small className="text-muted">
                Assigned to: Not assigned yet
              </small>
            ) : null}
          </div>
          
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => setShowDetail(true)}
          >
            View Details
          </Button>
        </Card.Footer>
      </Card>
      
      <Modal 
        show={showDetail} 
        onHide={() => setShowDetail(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ticket Details</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-0">
          <TicketDetail 
            ticketId={ticket.id}
            canUpdateStatus={canUpdateStatus}
            onStatusUpdate={handleStatusUpdate}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TicketCard;