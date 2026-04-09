import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

const TicketFilters = ({ filters, onChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <Row className="g-3">
      <Col md={4}>
        <Form.Group>
          <Form.Label>Status</Form.Label>
          <Form.Select name="status" value={filters.status} onChange={handleChange}>
            <option value="">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Select name="category" value={filters.category} onChange={handleChange}>
            <option value="">All categories</option>
            <option value="EQUIPMENT_FAILURE">Equipment Failure</option>
            <option value="FACILITY_ISSUE">Facility Issue</option>
            <option value="SOFTWARE_PROBLEM">Software Problem</option>
            <option value="NETWORK_ISSUE">Network Issue</option>
            <option value="OTHER">Other</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col md={4}>
        <Form.Group>
          <Form.Label>Priority</Form.Label>
          <Form.Select name="priority" value={filters.priority} onChange={handleChange}>
            <option value="">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </Form.Select>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default TicketFilters;
