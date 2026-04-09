import React from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import TicketForm from '../../components/member3/TicketForm';

const CreateTicketPage = ({ onSuccess }) => {
  const handleSuccess = (result) => {
    if (onSuccess) {
      onSuccess(result);
    }
  };
  
  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    }
  };
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">Create New Ticket</h1>
      
      <Card>
        <Card.Body>
          <Alert variant="info">
            Please provide as much detail as possible to help us resolve your issue quickly.
          </Alert>
          
          <TicketForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateTicketPage;