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

  return (
    <div>
      <Row className="g-3" style={{ marginBottom: '15px' }}>
        <Col md={3}>
          <Form.Group>
            <Form.Label style={{ fontSize: '13px', fontWeight: '500', color: '#1a3a52' }}>Type</Form.Label>
            <Form.Select
              size="sm"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
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
            <Form.Label style={{ fontSize: '13px', fontWeight: '500', color: '#1a3a52' }}>Capacity</Form.Label>
            <Form.Control
              type="number"
              size="sm"
              placeholder="Minimum capacity required"
              value={filters.capacity}
              onChange={(e) => handleFilterChange('capacity', e.target.value)}
              min="1"
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label style={{ fontSize: '13px', fontWeight: '500', color: '#1a3a52' }}>Location</Form.Label>
            <Form.Control
              type="text"
              size="sm"
              placeholder="Filter by location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </Form.Group>
        </Col>

        <Col md={3}>
          <Form.Group>
            <Form.Label style={{ fontSize: '13px', fontWeight: '500', color: '#1a3a52' }}>Status</Form.Label>
            <Form.Select
              size="sm"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outline-secondary" size="sm" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ResourceFilterBar;
