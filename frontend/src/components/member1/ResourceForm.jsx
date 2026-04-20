import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ResourceForm = ({ onSubmit, onCancel, initialData = null, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'LECTURE_HALL',
    equipmentType: '',
    capacity: '',
    location: '',
    availableFrom: '08:00',
    availableTo: '17:00',
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && isEditMode) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        equipmentType: initialData.equipmentType || '',
        capacity: initialData.capacity,
        location: initialData.location,
        availableFrom: initialData.availableFrom || '08:00',
        availableTo: initialData.availableTo || '17:00',
        status: initialData.status,
      });
    }
  }, [initialData, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Resource name is required';
    }
    if (!formData.type) {
      newErrors.type = 'Resource type is required';
    }
    if (formData.type === 'EQUIPMENT' && !formData.equipmentType.trim()) {
      newErrors.equipmentType = 'Equipment type is required when type is Equipment';
    }
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.availableFrom) {
      newErrors.availableFrom = 'Available from time is required';
    }
    if (!formData.availableTo) {
      newErrors.availableTo = 'Available to time is required';
    }
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3 style={{ marginBottom: '25px', color: '#1a3a52', fontWeight: '600' }}>
        {isEditMode ? 'Edit Resource' : 'Add New Resource'}
      </h3>

      <Form.Group className="mb-3">
        <Form.Label style={{ fontWeight: '500', color: '#1a3a52' }}>Resource Name *</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter resource name"
          disabled={loading}
          isInvalid={!!errors.name}
          style={{ borderColor: errors.name ? '#dc3545' : '#dee2e6' }}
        />
        {errors.name && (
          <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '5px' }}>
            {errors.name}
          </div>
        )}
      </Form.Group>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontWeight: '500', color: '#1a3a52' }}>Type *</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              disabled={loading}
              isInvalid={!!errors.type}
            >
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </Form.Select>
            {errors.type && (
              <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '5px' }}>
                {errors.type}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          {formData.type === 'EQUIPMENT' && (
            <Form.Group>
              <Form.Label style={{ fontWeight: '500', color: '#1a3a52' }}>Equipment Type *</Form.Label>
              <Form.Control
                type="text"
                name="equipmentType"
                value={formData.equipmentType}
                onChange={handleInputChange}
                placeholder="e.g., Projector, Camera"
                disabled={loading}
                isInvalid={!!errors.equipmentType}
              />
              {errors.equipmentType && (
                <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '5px' }}>
                  {errors.equipmentType}
                </div>
              )}
            </Form.Group>
          )}
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontWeight: '500', color: '#1a3a52' }}>Capacity *</Form.Label>
            <Form.Control
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              placeholder="Enter capacity"
              min="1"
              disabled={loading}
              isInvalid={!!errors.capacity}
            />
            {errors.capacity && (
              <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '5px' }}>
                {errors.capacity}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontWeight: '500', color: '#1a3a52' }}>Location *</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter location"
              disabled={loading}
              isInvalid={!!errors.location}
            />
            {errors.location && (
              <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '5px' }}>
                {errors.location}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontWeight: '500', color: '#1a3a52' }}>Available From *</Form.Label>
            <Form.Control
              type="time"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleInputChange}
              disabled={loading}
              isInvalid={!!errors.availableFrom}
            />
            {errors.availableFrom && (
              <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '5px' }}>
                {errors.availableFrom}
              </div>
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label style={{ fontWeight: '500', color: '#1a3a52' }}>Available To *</Form.Label>
            <Form.Control
              type="time"
              name="availableTo"
              value={formData.availableTo}
              onChange={handleInputChange}
              disabled={loading}
              isInvalid={!!errors.availableTo}
            />
            {errors.availableTo && (
              <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '5px' }}>
                {errors.availableTo}
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-4">
        <Form.Label style={{ fontWeight: '500', color: '#1a3a52', marginBottom: '10px', display: 'block' }}>
          Status *
        </Form.Label>
        <div style={{ display: 'flex', gap: '25px' }}>
          <Form.Check
            type="radio"
            label="Active"
            name="status"
            value="ACTIVE"
            checked={formData.status === 'ACTIVE'}
            onChange={handleInputChange}
            disabled={loading}
          />
          <Form.Check
            type="radio"
            label="Out of Service"
            name="status"
            value="OUT_OF_SERVICE"
            checked={formData.status === 'OUT_OF_SERVICE'}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
        {errors.status && (
          <div style={{ fontSize: '13px', color: '#dc3545', marginTop: '8px' }}>
            {errors.status}
          </div>
        )}
      </Form.Group>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-start' }}>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : isEditMode ? 'Update Resource' : 'Save Resource'}
        </Button>
      </div>
    </Form>
  );
};

export default ResourceForm;
