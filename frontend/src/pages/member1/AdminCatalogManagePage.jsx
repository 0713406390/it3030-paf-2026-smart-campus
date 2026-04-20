import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import ResourceList from '../../components/member1/ResourceList';
import ResourceForm from '../../components/member1/ResourceForm';
import resourceService from '../../services/member1/resourceService';

const AdminCatalogManagePage = () => {
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  const handleAddResource = () => {
    setIsEditMode(false);
    setSelectedResource(null);
    setView('form');
  };

  const handleEditResource = (resource) => {
    setIsEditMode(true);
    setSelectedResource(resource);
    setView('form');
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await resourceService.updateResource(selectedResource.id, formData);
        setSuccessMessage('Resource updated successfully!');
      } else {
        await resourceService.createResource(formData);
        setSuccessMessage('Resource created successfully!');
      }
      setView('list');
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'An error occurred while saving the resource.'
      );
      console.error('Error saving resource:', error);
    }
  };

  const handleFormCancel = () => {
    setView('list');
    setSelectedResource(null);
    setIsEditMode(false);
  };

  const handleDeleteResource = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Container style={{ marginTop: '30px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontWeight: '600', color: '#1a3a52', marginBottom: '10px' }}>
          Facilities & Resources Management
        </h2>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          Manage your campus facilities and resources
        </p>
      </div>

      {successMessage && (
        <Card style={{ 
          marginBottom: '20px', 
          border: 'none',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '6px'
        }}>
          <Card.Body style={{ padding: '12px 20px' }}>
            <span style={{ marginRight: '10px' }}>✓</span>
            {successMessage}
          </Card.Body>
        </Card>
      )}

      {errorMessage && (
        <Card style={{ 
          marginBottom: '20px',
          border: 'none',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '6px'
        }}>
          <Card.Body style={{ padding: '12px 20px' }}>
            <span style={{ marginRight: '10px' }}>✕</span>
            {errorMessage}
          </Card.Body>
        </Card>
      )}

      {view === 'list' ? (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleAddResource}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              + Add Resource
            </button>
          </div>

          <ResourceList
            key={refreshTrigger}
            onEdit={handleEditResource}
            onDelete={handleDeleteResource}
            onAddNew={handleAddResource}
          />
        </div>
      ) : (
        <Card style={{ marginBottom: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Card.Body style={{ padding: '40px' }}>
            <ResourceForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              initialData={selectedResource}
              isEditMode={isEditMode}
            />
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminCatalogManagePage;
