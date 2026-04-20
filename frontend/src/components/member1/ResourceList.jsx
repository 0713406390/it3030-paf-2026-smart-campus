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

  if (loading && (!resources || resources.length === 0)) {
    return <p style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>Loading resources...</p>;
  }

  return (
    <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px 20px',
          margin: '0',
          borderRadius: '8px 8px 0 0',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}
      
      <Card.Body style={{ padding: '0' }}>
        <Table striped hover style={{ marginBottom: '0' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Name</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Type</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Equipment</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Capacity</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Location</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Status</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Hours</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources && resources.length > 0 ? (
              resources.map((resource) => (
                <tr key={resource.id}>
                  <td style={{ padding: '12px 15px' }}>{resource.name}</td>
                  <td style={{ padding: '12px 15px' }}>{resource.type.replace(/_/g, ' ')}</td>
                  <td style={{ padding: '12px 15px' }}>{resource.equipmentType || '-'}</td>
                  <td style={{ padding: '12px 15px' }}>{resource.capacity}</td>
                  <td style={{ padding: '12px 15px' }}>{resource.location}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: resource.status === 'ACTIVE' ? '#d4edda' : '#e2e3e5',
                      color: resource.status === 'ACTIVE' ? '#155724' : '#383d41'
                    }}>
                      {resource.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 15px', fontSize: '13px' }}>
                    {formatTime(resource.availableFrom)} - {formatTime(resource.availableTo)}
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => onEdit(resource)}
                      style={{ marginRight: '5px', fontSize: '12px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDelete(resource.id)}
                      style={{ fontSize: '12px' }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ padding: '40px 15px', textAlign: 'center', color: '#6c757d' }}>
                  No resources found. Click "Add Resource" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

      {totalPages > 0 && (
        <Card.Footer style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '15px',
          backgroundColor: '#f8f9fa',
          borderTop: '1px solid #dee2e6',
          padding: '12px 15px'
        }}>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
          >
            ← Previous
          </Button>
          <span style={{ color: '#6c757d', fontSize: '14px', minWidth: '150px', textAlign: 'center' }}>
            Page {currentPage + 1} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
            disabled={currentPage >= totalPages - 1}
          >
            Next →
          </Button>
        </Card.Footer>
      )}
    </Card>
  );
};

export default ResourceList;
