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
      // Prepare data for submission - remove capacity if it's null (for EQUIPMENT)
      const submissionData = { ...formData };
      if (submissionData.capacity === null || submissionData.capacity === '') {
        delete submissionData.capacity;
      }

      if (isEditMode) {
        await resourceService.updateResource(selectedResource.id, submissionData);
        setSuccessMessage('Resource updated successfully!');
      } else {
        await resourceService.createResource(submissionData);
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
    <Container fluid style={{ marginTop: '0px', marginBottom: '40px', paddingTop: '40px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Professional Header Section */}
      <div style={{ 
        marginBottom: '40px', 
        backgroundColor: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
        padding: '40px 0',
        marginLeft: '-12px',
        marginRight: '-12px',
        marginTop: '-40px',
        backgroundImage: 'linear-gradient(135deg, #1a3a52 0%, #2d5a7b 100%)',
        paddingLeft: '12px',
        paddingRight: '12px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingLeft: '20px', paddingRight: '20px' }}>
          <h1 style={{ fontWeight: '700', color: '#ffffff', marginBottom: '8px', fontSize: '32px' }}>
            Facilities & Resources Management
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '15px', marginBottom: '0px' }}>
            Create, edit, and manage your campus facilities and resources
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Card style={{ 
          marginBottom: '20px', 
          border: 'none',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <Card.Body style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500' }}>
            <span style={{ marginRight: '10px', fontWeight: '700' }}>✓</span>
            {successMessage}
          </Card.Body>
        </Card>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Card style={{ 
          marginBottom: '20px',
          border: 'none',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <Card.Body style={{ padding: '16px 20px', fontSize: '14px', fontWeight: '500' }}>
            <span style={{ marginRight: '10px', fontWeight: '700' }}>✕</span>
            {errorMessage}
          </Card.Body>
        </Card>
      )}

      {view === 'list' ? (
        <div>
          {/* Add Button */}
          <div style={{ marginBottom: '30px' }}>
            <button
              onClick={handleAddResource}
              style={{
                backgroundColor: '#0d6efd',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(13, 110, 253, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0a58ca';
                e.target.style.boxShadow = '0 4px 12px rgba(13, 110, 253, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#0d6efd';
                e.target.style.boxShadow = '0 2px 8px rgba(13, 110, 253, 0.25)';
              }}
            >
              + Add New Resource
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
        <Card style={{ marginBottom: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: 'none' }}>
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
