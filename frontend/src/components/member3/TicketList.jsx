import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Pagination, Alert, Spinner } from 'react-bootstrap';
import TicketCard from './TicketCard';
import TicketFilters from './TicketFilters';
import { getMyTickets, getAllTickets, getAssignedTickets, getTicketComments, getTicketById } from '../../services/member3/ticketService';
import { useAuth } from '../../hooks/useAuth';

const TicketList = ({ view = 'my' }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: '',
  });
  
  const { user } = useAuth();

  const enrichWithAdminCommentNotifications = async (ticketItems) => {
    const enriched = await Promise.all(
      ticketItems.map(async (ticket) => {
        try {
          const comments = await getTicketComments(ticket.id);
          const latestTicket = await getTicketById(ticket.id);
          const hasAdminComment = Array.isArray(comments)
            ? comments.some((comment) => {
                const authorName = (comment?.author?.name || '').toLowerCase();
                return authorName === 'admin' || authorName === 'administrator';
              })
            : false;

          return {
            ...ticket,
            ...latestTicket,
            hasAdminComment,
          };
        } catch (error) {
          return {
            ...ticket,
            hasAdminComment: false,
          };
        }
      })
    );

    return enriched;
  };
  
  const fetchTickets = async (page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (view === 'my') {
        response = await getMyTickets(page, size);
      } else if (view === 'assigned') {
        response = await getAssignedTickets(page, size);
      } else if (view === 'all' && (user?.roles || []).includes('ADMIN')) {
        response = await getAllTickets(
          page, 
          size, 
          filters.status || null, 
          filters.category || null, 
          filters.priority || null
        );
      } else {
        throw new Error('Unauthorized view');
      }
      
      if (view === 'my') {
        const enrichedTickets = await enrichWithAdminCommentNotifications(response.content || []);
        setTickets(enrichedTickets);
      } else {
        setTickets(response.content);
      }
      setPagination({
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
      });
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load tickets. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTickets(pagination.page, pagination.size);
  }, [view, pagination.page, pagination.size]);
  
  useEffect(() => {
    if (view === 'all') {
      // Reset to first page when filters change
      setPagination(prev => ({ ...prev, page: 0 }));
      fetchTickets(0, pagination.size);
    }
  }, [filters, view]);
  
  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  const handleTicketUpdate = (updatedTicket) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );
  };
  
  return (
    <div>
      {view === 'all' && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title as="h5">Filter Tickets</Card.Title>
            <TicketFilters 
              filters={filters} 
              onChange={handleFilterChange} 
            />
          </Card.Body>
        </Card>
      )}
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : tickets.length === 0 ? (
        <Alert variant="info">
          No tickets found. {view === 'my' ? 'Create your first ticket!' : ''}
        </Alert>
      ) : (
        <>
          <Row xs={1} md={2} lg={3} className="g-4">
            {tickets.map(ticket => (
              <Col key={ticket.id}>
                <TicketCard 
                  ticket={ticket} 
                  onUpdate={handleTicketUpdate}
                  view={view}
                />
              </Col>
            ))}
          </Row>
          
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev 
                  disabled={pagination.page === 0}
                  onClick={() => handlePageChange(pagination.page - 1)}
                />
                
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i === pagination.page}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                
                <Pagination.Next 
                  disabled={pagination.page === pagination.totalPages - 1}
                  onClick={() => handlePageChange(pagination.page + 1)}
                />
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TicketList;