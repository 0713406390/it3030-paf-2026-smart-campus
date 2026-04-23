import React, { useState, useEffect } from 'react';
import { 
  Tab, 
  Tabs, 
  Row, 
  Col, 
  Badge, 
  Button, 
  Form, 
  Alert,
  Spinner,
  Card
} from 'react-bootstrap';
import { format } from 'date-fns';
import TicketStatusBadge from './TicketStatusBadge';
import TicketAttachments from './TicketAttachments';
import TicketComments from './TicketComments';
import { 
  getTicketById, 
  updateTicketStatus, 
  assignTechnician,
  getUsers 
} from '../../services/member3/ticketService';
import { useAuth } from '../../hooks/useAuth';

const TECHNICIAN_DIRECTORY = [
  {
    fullName: 'Mr.Tharanath Ambilla',
    reputation: 'Location Management Head',
  },
  {
    fullName: 'Mr.Tharuka Rewnith',
    reputation: 'Documentation Management Head',
  },
  {
    fullName: 'Mr.Amaranath Athukorala',
    reputation: 'Network Management Head',
  },
  {
    fullName: 'Mr.Surath Abewardhana',
    reputation: 'Facility Service Head',
  },
];

const normalizeName = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const findTechnicianDirectoryEntry = (rawName) => {
  const normalizedRawName = normalizeName(rawName);

  return TECHNICIAN_DIRECTORY.find((technician) => {
    const normalizedDirectoryName = normalizeName(technician.fullName);
    return (
      normalizedRawName === normalizedDirectoryName ||
      normalizedRawName.startsWith(`${normalizedDirectoryName} `)
    );
  });
};

const TicketDetail = ({ ticketId, canUpdateStatus, onStatusUpdate }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [statusUpdateForm, setStatusUpdateForm] = useState({
    status: '',
    notes: '',
  });
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const { user } = useAuth();
  const roles = user?.roles || [];
  const isAdmin = roles.includes('ADMIN');
  const isTechnician = roles.includes('TECHNICIAN');
  const isRejectedTicket = ticket?.status === 'REJECTED';

  const formatEnum = (value) => {
    if (!value) return 'N/A';
    return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };
  
  const getStatusOptions = () => {
    const current = ticket?.status;
    if (!current) {
      return [];
    }

    if (isAdmin) {
      return ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'];
    }

    if (isTechnician) {
      switch (current) {
        case 'OPEN':
          return ['OPEN', 'IN_PROGRESS'];
        case 'IN_PROGRESS':
          return ['IN_PROGRESS', 'RESOLVED'];
        default:
          return [current];
      }
    }

    return [current];
  };
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketData = await getTicketById(ticketId);
        setTicket(ticketData);
        setStatusUpdateForm(prev => ({
          ...prev,
          status: ticketData.status,
        }));
        
        // If ticket has an assigned technician, set it as selected
        if (ticketData.assignedTechnician) {
          setSelectedTechnician(ticketData.assignedTechnician.id);
        }
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError(
          err.response?.data?.message || 
          'Failed to load ticket details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTechnicians = async () => {
      try {
        const users = await getUsers({ role: 'TECHNICIAN' });
        const technicianUsers = Array.isArray(users) ? users : [];

        const options = TECHNICIAN_DIRECTORY.map((directoryEntry) => {
          const matchedUser = technicianUsers.find((tech) => {
            const mappedEntry = findTechnicianDirectoryEntry(tech?.name);
            return mappedEntry?.fullName === directoryEntry.fullName;
          });

          return {
            id: matchedUser?.id || '',
            displayLabel: `${directoryEntry.fullName} - ${directoryEntry.reputation}`,
            available: Boolean(matchedUser?.id),
          };
        });

        setTechnicians(options);
      } catch (err) {
        console.error('Error fetching technicians:', err);
      }
    };
    
    fetchTicket();
    if (canUpdateStatus) {
      fetchTechnicians();
    }
  }, [ticketId, canUpdateStatus]);
  
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    if (!statusUpdateForm.status) return;

    if (statusUpdateForm.status === 'REJECTED' && !statusUpdateForm.notes.trim()) {
      setUpdateError('Please provide a rejection reason.');
      return;
    }
    
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const updatedTicket = await updateTicketStatus(
        ticketId, 
        statusUpdateForm.status, 
        statusUpdateForm.notes
      );
      
      setTicket(updatedTicket);
      onStatusUpdate(updatedTicket);
    } catch (err) {
      console.error('Error updating ticket status:', err);
      setUpdateError(
        err.response?.data?.message || 
        'Failed to update ticket status. Please try again.'
      );
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleAssignTechnician = async () => {
    if (ticket?.status === 'REJECTED') {
      setUpdateError('Cannot assign a technician to a rejected ticket.');
      return;
    }

    if (!selectedTechnician) return;
    
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const updatedTicket = await assignTechnician(ticketId, selectedTechnician);
      setTicket(updatedTicket);
    } catch (err) {
      console.error('Error assigning technician:', err);
      setUpdateError(
        err.response?.data?.message || 
        'Failed to assign technician. Please try again.'
      );
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }
  
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }
  
  return (
    <div className="p-4">
      {updateError && <Alert variant="danger">{updateError}</Alert>}
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="details" title="Details">
          <Row>
            <Col md={8}>
              <h4>{ticket.title}</h4>
              
              <div className="mb-3">
                <TicketStatusBadge status={ticket.status} />
                <Badge bg="secondary" className="ms-2">
                  {ticket.category.replace('_', ' ')}
                </Badge>
                <Badge bg="info" className="ms-2">
                  {ticket.priority}
                </Badge>
              </div>
              
              <p>{ticket.description}</p>
              
              <div className="mt-4">
                <h6>Location</h6>
                <p>{ticket.location}</p>
              </div>
              
              <div className="mt-4">
                <h6>Contact Information</h6>
                <p>{ticket.contactInfo}</p>
              </div>
              
              {ticket.resolutionNotes && (
                <Card className="mt-4 border-0 shadow-sm">
                  <Card.Body className="bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0 text-success">Resolution Note</h6>
                      {ticket.resolvedAt && (
                        <small className="text-muted">
                          {format(new Date(ticket.resolvedAt), 'PPP p')}
                        </small>
                      )}
                    </div>
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {ticket.resolutionNotes}
                    </p>
                  </Card.Body>
                </Card>
              )}
              
              {ticket.rejectionReason && (
                <Alert variant="danger" className="mt-4">
                  <strong>Rejected:</strong> {ticket.rejectionReason}
                </Alert>
              )}

              <div className="mt-4">
                <h6>Requester Details</h6>
                <p className="mb-1"><strong>Name:</strong> {ticket.requesterName || 'N/A'}</p>
                <p className="mb-1"><strong>Email:</strong> {ticket.requesterEmail || 'N/A'}</p>
                <p className="mb-1"><strong>Registration Number:</strong> {ticket.registrationNumber || 'N/A'}</p>
                <p className="mb-1"><strong>Type:</strong> {formatEnum(ticket.requesterType)}</p>
                <p className="mb-1"><strong>Contact Number:</strong> {ticket.contactNumber || 'N/A'}</p>
                <p className="mb-1"><strong>Faculty/School:</strong> {formatEnum(ticket.facultyOrSchool)}</p>
              </div>

              <div className="mt-4">
                <h6>Request Details</h6>
                <p className="mb-1"><strong>Request Type:</strong> {formatEnum(ticket.requestType)}</p>
                {ticket.officialDocumentType && (
                  <p className="mb-1"><strong>Document Type:</strong> {formatEnum(ticket.officialDocumentType)}</p>
                )}
                {(ticket.academicYear || ticket.academicSemester || ticket.programme || ticket.registrationType) && (
                  <>
                    <p className="mb-1"><strong>Academic Year:</strong> {ticket.academicYear || 'N/A'}</p>
                    <p className="mb-1"><strong>Academic Semester:</strong> {ticket.academicSemester || 'N/A'}</p>
                    <p className="mb-1"><strong>Programme:</strong> {ticket.programme || 'N/A'}</p>
                    <p className="mb-1"><strong>Registration Type:</strong> {formatEnum(ticket.registrationType)}</p>
                  </>
                )}
                {(ticket.buildingNumber || ticket.roomNumber || ticket.itemNumber || ticket.incidentDescription) && (
                  <>
                    <p className="mb-1"><strong>Building No:</strong> {ticket.buildingNumber || 'N/A'}</p>
                    <p className="mb-1"><strong>Room No:</strong> {ticket.roomNumber || 'N/A'}</p>
                    <p className="mb-1"><strong>Item No:</strong> {ticket.itemNumber || 'N/A'}</p>
                    <p className="mb-1"><strong>Incident Description:</strong> {ticket.incidentDescription || 'N/A'}</p>
                  </>
                )}
              </div>
            </Col>
            
            <Col md={4}>
              <Card>
                <Card.Body>
                  <h6>Ticket Information</h6>
                  <hr />
                  
                  <div className="mb-3">
                    <small className="text-muted">Created By</small>
                    <p>{ticket.reporter.name}</p>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">Created At</small>
                    <p>{format(new Date(ticket.createdAt), 'PPP p')}</p>
                  </div>
                  
                  {ticket.updatedAt && (
                    <div className="mb-3">
                      <small className="text-muted">Last Updated</small>
                      <p>{format(new Date(ticket.updatedAt), 'PPP p')}</p>
                    </div>
                  )}
                  
                  {ticket.resolvedAt && (
                    <div className="mb-3">
                      <small className="text-muted">Resolved At</small>
                      <p>{format(new Date(ticket.resolvedAt), 'PPP p')}</p>
                    </div>
                  )}
                  
                  {ticket.assignedTechnician && (
                    <div className="mb-3">
                      <small className="text-muted">Assigned Technician</small>
                      <p>{ticket.assignedTechnician.name}</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              {canUpdateStatus && (
                <Card className="mt-3">
                  <Card.Body>
                    <h6>Update Ticket</h6>
                    <hr />
                    
                    {(user?.roles || []).includes('ADMIN') && (
                      <div className="mb-3">
                        <Form.Label>Assign Technician</Form.Label>
                        <Form.Select
                          value={selectedTechnician}
                          onChange={(e) => setSelectedTechnician(e.target.value)}
                          disabled={isRejectedTicket || isUpdating}
                        >
                          <option value="">Select Technician</option>
                          {technicians.map(tech => (
                            <option
                              key={tech.displayLabel}
                              value={tech.id || `missing-${tech.displayLabel}`}
                              disabled={!tech.available}
                            >
                              {tech.displayLabel}{!tech.available ? ' (Not available in system)' : ''}
                            </option>
                          ))}
                        </Form.Select>
                        {isRejectedTicket && (
                          <small className="text-danger d-block mt-2">
                            Technician assignment is disabled because this ticket is rejected.
                          </small>
                        )}
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="mt-2"
                          onClick={handleAssignTechnician}
                          disabled={isRejectedTicket || !selectedTechnician || isUpdating}
                        >
                          Assign
                        </Button>
                      </div>
                    )}
                    
                    <Form onSubmit={handleStatusUpdate}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={statusUpdateForm.status}
                          onChange={(e) => setStatusUpdateForm(prev => ({
                            ...prev,
                            status: e.target.value
                          }))}
                        >
                            {getStatusOptions().map((status) => (
                              <option key={status} value={status}>{formatEnum(status)}</option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>
                          {statusUpdateForm.status === 'REJECTED'
                            ? 'Rejection Reason (required)'
                            : statusUpdateForm.status === 'RESOLVED'
                              ? 'Resolution Note (optional)'
                              : 'Update Notes'}
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={statusUpdateForm.notes}
                          onChange={(e) => setStatusUpdateForm(prev => ({
                            ...prev,
                            notes: e.target.value
                          }))}
                          placeholder={statusUpdateForm.status === 'RESOLVED'
                            ? 'Write a clear and complete resolution note for this request'
                            : 'Add notes about this status update'}
                        />
                      </Form.Group>
                      
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Submitting...' : statusUpdateForm.status === 'RESOLVED' ? 'Submit Resolution Note & Update Status' : 'Update Status'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="attachments" title="Attachments">
          <TicketAttachments ticketId={ticketId} />
        </Tab>
        
        <Tab eventKey="comments" title="Comments">
          <TicketComments ticketId={ticketId} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default TicketDetail;