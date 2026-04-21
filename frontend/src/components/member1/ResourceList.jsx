import React, { useState, useEffect } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import resourceService from '../../services/member1/resourceService';

const ResourceList = ({ onEdit, onDelete, onAddNew, resources: initialResources }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchResources();
  }, [currentPage, pageSize]);

  const fetchResources = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await resourceService.getAllResources(currentPage, pageSize);
      const data = response.data;
      const resourcesData = data.content || data || [];
      const totalPagesData = data.totalPages || 0;
      
      setResources(Array.isArray(resourcesData) ? resourcesData : []);
      setTotalPages(totalPagesData);
    } catch (err) {
      setError('Failed to load resources');
      console.error('Error loading resources:', err);
      setResources([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await resourceService.deleteResource(id);
        fetchResources();
        if (onDelete) onDelete();
      } catch (err) {
        setError('Failed to delete resource');
        console.error(err);
      }
    }
  };

  const formatTime = (time) => {
    if (!time) return '-';
    return time.substring(0, 5);
  };

  const getTypeLabel = (type) => {
    const labels = {
      LECTURE_HALL: 'Lecture Hall',
      LAB: 'Lab',
      MEETING_ROOM: 'Meeting Room',
      EQUIPMENT: 'Equipment'
    };
    return labels[type] || type;
  };

  if (loading && (!resources || resources.length === 0)) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6c757d' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            margin: '0 auto',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #0d6efd',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        <p style={{ fontSize: '15px', fontWeight: '500' }}>Loading resources...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Card style={{ 
      borderRadius: '12px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: 'none',
      overflow: 'hidden'
    }}>
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '16px 20px',
          margin: '0',
          borderRadius: '0',
          fontSize: '14px',
          fontWeight: '500',
          borderBottom: '1px solid #f5c6cb'
        }}>
          Error: {error}
        </div>
      )}
      
      <Card.Body style={{ padding: '0' }}>
        <div style={{ overflowX: 'auto' }}>
          <Table hover style={{ marginBottom: '0', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Name</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Type</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Equipment</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Capacity</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Location</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Hours</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Status</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px',
                  textAlign: 'center'
                }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources && resources.length > 0 ? (
                resources.map((resource, index) => (
                  <tr 
                    key={resource.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                      borderBottom: '1px solid #e9ecef',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f1ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa'}
                  >
                    <td style={{ padding: '16px 18px', fontWeight: '600', color: '#1a3a52' }}>
                      {resource.name}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057' }}>
                      <span style={{ 
                        fontSize: '13px',
                        backgroundColor: '#e9ecef',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {getTypeLabel(resource.type)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057', fontSize: '13px' }}>
                      {resource.equipmentType || '-'}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057' }}>
                      {resource.capacity} people
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057' }}>
                      {resource.location}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057', fontSize: '13px' }}>
                      {formatTime(resource.availableFrom)} - {formatTime(resource.availableTo)}
                    </td>
                    <td style={{ padding: '16px 18px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: resource.status === 'ACTIVE' ? '#d4edda' : '#f8d7da',
                        color: resource.status === 'ACTIVE' ? '#155724' : '#721c24',
                        border: resource.status === 'ACTIVE' ? '1.5px solid #c3e6cb' : '1.5px solid #f5c6cb',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
                      }}>
                        {resource.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => onEdit(resource)}
                        style={{ 
                          marginRight: '8px', 
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '6px 14px',
                          borderRadius: '6px'
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(resource.id)}
                        style={{ 
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '6px 14px',
                          borderRadius: '6px'
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ padding: '60px 15px', textAlign: 'center', color: '#6c757d' }}>
                    <div style={{ marginBottom: '15px', fontSize: '16px', fontWeight: '600', color: '#1a3a52' }}>
                      No Resources Found
                    </div>
                    <p style={{ fontSize: '14px', marginBottom: '0' }}>Click "Add New Resource" to create your first resource</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>

      {totalPages > 0 && (
        <Card.Footer style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          backgroundColor: '#f8f9fa',
          borderTop: '2px solid #e9ecef',
          padding: '24px 15px'
        }}>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            style={{
              fontWeight: '600',
              fontSize: '14px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1.5px solid #dee2e6'
            }}
          >
            Previous
          </Button>
          <div style={{ 
            backgroundColor: '#e9ecef', 
            padding: '8px 16px', 
            borderRadius: '6px',
            color: '#1a3a52', 
            fontSize: '14px', 
            fontWeight: '600',
            minWidth: '160px', 
            textAlign: 'center' 
          }}>
            Page {currentPage + 1} of {totalPages}
          </div>
          <Button
            size="sm"
            variant="outline-primary"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
            style={{
              fontWeight: '600',
              fontSize: '14px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1.5px solid #dee2e6'
            }}
          >
            Next
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ResourceList;
