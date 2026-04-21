import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ResourceFilterBar = ({ onFilterChange, filters }) => {
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    onFilterChange({
      type: '',
      capacity: '',
      location: '',
      status: ''
    });
  };

  const inputStyle = {
    borderRadius: '8px',
    borderColor: '#dee2e6',
    fontSize: '14px',
    border: '1.5px solid #dee2e6',
    transition: 'border-color 0.3s',
    padding: '10px 12px'
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a3a52',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px'
  };

  return (
    <div>
      <Row className="g-3" style={{ marginBottom: '15px' }}>
        <Col md={3}>
          <Form.Group>
            <Form.Label style={labelStyle}>Type</Form.Label>
            <Form.Select
              size="sm"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              style={{ ...inputStyle, padding: '8px 12px' }}
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label style={labelStyle}>Capacity</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              placeholder="Minimum capacity"
              value={filters.capacity}
              onChange={(e) => handleFilterChange('capacity', e.target.value)}
              min="1"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#0d6efd'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label style={labelStyle}>Location</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              placeholder="Filter by location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#0d6efd'}
              onBlur={(e) => e.target.style.borderColor = '#dee2e6'}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label style={labelStyle}>Status</Form.Label>
            <Form.Select
              size="sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{ ...inputStyle, padding: '8px 12px' }}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={handleReset}
          style={{
            fontWeight: '600',
            fontSize: '14px',
            padding: '8px 18px',
            borderRadius: '8px',
            border: '1.5px solid #dee2e6'
          }}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ResourceFilterBar;
