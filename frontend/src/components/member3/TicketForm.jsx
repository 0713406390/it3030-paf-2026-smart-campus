import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { createTicket, updateTicket, uploadAttachments } from '../../services/member3/ticketService';

const FACULTY_OPTIONS = [
  { value: 'FACULTY_OF_COMPUTING', label: 'Faculty of Computing' },
  { value: 'SCHOOL_OF_BUSINESS', label: 'School of Business' },
  { value: 'FACULTY_OF_ENGINEERING', label: 'Faculty of Engineering' },
  { value: 'FACULTY_OF_HUMANITIES_AND_SCIENCE', label: 'Faculty of Humanities & Science' },
  { value: 'SCHOOL_OF_ARCHITECTURE', label: 'School of Architecture' },
  { value: 'FACULTY_OF_GRADUATE_STUDIES_AND_RESEARCH', label: 'Faculty of Graduate Studies & Research' },
];

const REQUEST_TYPE_OPTIONS = [
  { value: 'REQUEST_OFFICIAL_DOCUMENT', label: 'Request an Official Document' },
  { value: 'QUESTION_ABOUT_REGISTRATION', label: 'Question about Registration' },
  { value: 'INFORM_EQUIPMENT_FAILURE', label: 'Inform Equipment Failure' },
  { value: 'INFORM_FACILITY_ISSUE', label: 'Inform Facility Issue' },
  { value: 'INFORM_SOFTWARE_PROBLEM', label: 'Inform Software Problem' },
  { value: 'INFORM_NETWORK_ISSUE', label: 'Inform Network Issue' },
  { value: 'OTHER', label: 'Other' },
];

const TicketForm = ({ ticket, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: ticket?.title || 'Service Request',
    description: ticket?.description || '',
    category: ticket?.category || 'OTHER',
    priority: ticket?.priority || 'MEDIUM',
    location: ticket?.location || 'N/A',
    contactInfo: ticket?.contactInfo || 'N/A',
    requesterName: ticket?.requesterName || '',
    requesterEmail: ticket?.requesterEmail || '',
    registrationNumber: ticket?.registrationNumber || '',
    requesterType: ticket?.requesterType || 'STUDENT',
    contactNumber: ticket?.contactNumber || '',
    facultyOrSchool: ticket?.facultyOrSchool || 'FACULTY_OF_COMPUTING',
    requestType: ticket?.requestType || 'REQUEST_OFFICIAL_DOCUMENT',
    officialDocumentType: ticket?.officialDocumentType || '',
    academicYear: ticket?.academicYear || '',
    academicSemester: ticket?.academicSemester || '',
    programme: ticket?.programme || '',
    registrationType: ticket?.registrationType || '',
    buildingNumber: ticket?.buildingNumber || '',
    roomNumber: ticket?.roomNumber || '',
    itemNumber: ticket?.itemNumber || '',
    incidentDescription: ticket?.incidentDescription || '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.requesterName.trim()) {
      newErrors.requesterName = 'Name is required';
    }
    
    if (!formData.requesterEmail.trim()) {
      newErrors.requesterEmail = 'Email is required';
    }
    
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = 'Registration number is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }

    if (formData.requestType === 'REQUEST_OFFICIAL_DOCUMENT' && !formData.officialDocumentType) {
      newErrors.officialDocumentType = 'Please select the requested document type';
    }

    if (formData.requestType === 'QUESTION_ABOUT_REGISTRATION') {
      if (!formData.academicYear.trim()) newErrors.academicYear = 'Academic year is required';
      if (!formData.academicSemester.trim()) newErrors.academicSemester = 'Academic semester is required';
      if (!formData.programme.trim()) newErrors.programme = 'Programme is required';
      if (!formData.registrationType) newErrors.registrationType = 'Registration type is required';
    }

    const incidentTypes = ['INFORM_EQUIPMENT_FAILURE', 'INFORM_FACILITY_ISSUE', 'INFORM_SOFTWARE_PROBLEM', 'INFORM_NETWORK_ISSUE'];
    if (incidentTypes.includes(formData.requestType)) {
      if (!formData.buildingNumber.trim()) newErrors.buildingNumber = 'Building number is required';
      if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room number is required';
      if (!formData.itemNumber.trim()) newErrors.itemNumber = 'Item number is required';
      if (!formData.incidentDescription.trim()) newErrors.incidentDescription = 'Incident description is required';
    }

    if (selectedFiles.length > 3) {
      newErrors.attachments = 'Only up to 3 image attachments are allowed';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const deduped = [...selectedFiles];

    for (const file of newFiles) {
      const exists = deduped.some(
        (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
      );
      if (!exists) {
        deduped.push(file);
      }
    }

    if (deduped.length > 3) {
      setErrors(prev => ({ ...prev, attachments: 'Only up to 3 image attachments are allowed' }));
      setSelectedFiles(deduped.slice(0, 3));
      return;
    }

    setSelectedFiles(deduped);
    if (errors.attachments) {
      setErrors(prev => ({ ...prev, attachments: null }));
    }
  };

  const deriveCategory = (requestType) => {
    if (requestType === 'INFORM_EQUIPMENT_FAILURE') return 'EQUIPMENT_FAILURE';
    if (requestType === 'INFORM_FACILITY_ISSUE') return 'FACILITY_ISSUE';
    if (requestType === 'INFORM_SOFTWARE_PROBLEM') return 'SOFTWARE_PROBLEM';
    if (requestType === 'INFORM_NETWORK_ISSUE') return 'NETWORK_ISSUE';
    return 'OTHER';
  };

  const normalizeOptional = (value) => {
    if (typeof value === 'string' && value.trim() === '') {
      return null;
    }
    return value;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      let createdTicketData = null;
      let uploadWarning = null;

      const payload = {
        ...formData,
        category: deriveCategory(formData.requestType),
        location: [formData.buildingNumber, formData.roomNumber].filter(Boolean).join(' / ') || 'N/A',
        contactInfo: `${formData.requesterEmail} / ${formData.contactNumber}`,
        title: formData.title?.trim() || 'Service Request',
        description: formData.description?.trim() || formData.incidentDescription || formData.requestType,
        officialDocumentType: normalizeOptional(formData.officialDocumentType),
        registrationType: normalizeOptional(formData.registrationType),
        academicYear: normalizeOptional(formData.academicYear),
        academicSemester: normalizeOptional(formData.academicSemester),
        programme: normalizeOptional(formData.programme),
        buildingNumber: normalizeOptional(formData.buildingNumber),
        roomNumber: normalizeOptional(formData.roomNumber),
        itemNumber: normalizeOptional(formData.itemNumber),
        incidentDescription: normalizeOptional(formData.incidentDescription),
      };

      if (ticket) {
        await updateTicket(ticket.id, payload);
      } else {
        createdTicketData = await createTicket(payload);
        if (selectedFiles.length > 0) {
          try {
            await uploadAttachments(createdTicketData.id, selectedFiles);
          } catch (uploadError) {
            console.error('Ticket created but attachment upload failed:', uploadError);
            uploadWarning = 'Ticket created successfully, but attachment upload failed. You can re-upload from ticket details.';
          }
        }
      }

      onSuccess({
        isCreate: !ticket,
        ticket: createdTicketData,
        warning: uploadWarning,
      });
    } catch (error) {
      console.error('Error saving ticket:', error);
      const responseData = error.response?.data;
      const detailedMessage =
        responseData?.message ||
        responseData?.error ||
        (typeof responseData === 'string' ? responseData : null);
      setSubmitError(
        detailedMessage ||
        'An error occurred while saving the ticket. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {submitError && <Alert variant="danger">{submitError}</Alert>}
      
      <Form.Group className="mb-3">
        <Form.Label>Ticket Subject</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          isInvalid={!!errors.title}
          placeholder="Short subject for this request"
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>
      
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
              isInvalid={!!errors.requesterName}
            />
            <Form.Control.Feedback type="invalid">{errors.requesterName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="requesterEmail"
              value={formData.requesterEmail}
              onChange={handleChange}
              isInvalid={!!errors.requesterEmail}
            />
            <Form.Control.Feedback type="invalid">{errors.requesterEmail}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Registration Number</Form.Label>
            <Form.Control
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              isInvalid={!!errors.registrationNumber}
            />
            <Form.Control.Feedback type="invalid">{errors.registrationNumber}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              isInvalid={!!errors.contactNumber}
            />
            <Form.Control.Feedback type="invalid">{errors.contactNumber}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Select name="requesterType" value={formData.requesterType} onChange={handleChange}>
              <option value="STUDENT">Student</option>
              <option value="LECTURER">Lecturer</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8}>
          <Form.Group>
            <Form.Label>Faculty / School</Form.Label>
            <Form.Select name="facultyOrSchool" value={formData.facultyOrSchool} onChange={handleChange}>
              {FACULTY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Request Type</Form.Label>
            <Form.Select name="requestType" value={formData.requestType} onChange={handleChange}>
              {REQUEST_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Priority</Form.Label>
            <Form.Select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {formData.requestType === 'REQUEST_OFFICIAL_DOCUMENT' && (
        <Form.Group className="mb-3">
          <Form.Label>Official Document Type</Form.Label>
          <Form.Select
            name="officialDocumentType"
            value={formData.officialDocumentType}
            onChange={handleChange}
            isInvalid={!!errors.officialDocumentType}
          >
            <option value="">Select</option>
            <option value="LETTER">Letters</option>
            <option value="CERTIFICATE">Certificate</option>
            <option value="TRANSCRIPT">Transcript</option>
            <option value="RESULT_SHEET">Result Sheets</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">{errors.officialDocumentType}</Form.Control.Feedback>
        </Form.Group>
      )}

      {formData.requestType === 'QUESTION_ABOUT_REGISTRATION' && (
        <>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Academic Year</Form.Label>
                <Form.Control name="academicYear" value={formData.academicYear} onChange={handleChange} isInvalid={!!errors.academicYear} />
                <Form.Control.Feedback type="invalid">{errors.academicYear}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Academic Semester</Form.Label>
                <Form.Control name="academicSemester" value={formData.academicSemester} onChange={handleChange} isInvalid={!!errors.academicSemester} />
                <Form.Control.Feedback type="invalid">{errors.academicSemester}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Programme</Form.Label>
                <Form.Control name="programme" value={formData.programme} onChange={handleChange} isInvalid={!!errors.programme} />
                <Form.Control.Feedback type="invalid">{errors.programme}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Registration Type</Form.Label>
                <Form.Select name="registrationType" value={formData.registrationType} onChange={handleChange} isInvalid={!!errors.registrationType}>
                  <option value="">Select</option>
                  <option value="SEMESTER_REGISTRATION">Semester Registration</option>
                  <option value="PRORATA_REGISTRATION">Prorata Registration</option>
                  <option value="REPEAT_REGISTRATION">Repeat Registration</option>
                  <option value="OTHER">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.registrationType}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </>
      )}

      {['INFORM_EQUIPMENT_FAILURE', 'INFORM_FACILITY_ISSUE', 'INFORM_SOFTWARE_PROBLEM', 'INFORM_NETWORK_ISSUE'].includes(formData.requestType) && (
        <>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Building Number</Form.Label>
                <Form.Control name="buildingNumber" value={formData.buildingNumber} onChange={handleChange} isInvalid={!!errors.buildingNumber} />
                <Form.Control.Feedback type="invalid">{errors.buildingNumber}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Room Number</Form.Label>
                <Form.Control name="roomNumber" value={formData.roomNumber} onChange={handleChange} isInvalid={!!errors.roomNumber} />
                <Form.Control.Feedback type="invalid">{errors.roomNumber}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Item No</Form.Label>
                <Form.Control name="itemNumber" value={formData.itemNumber} onChange={handleChange} isInvalid={!!errors.itemNumber} />
                <Form.Control.Feedback type="invalid">{errors.itemNumber}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Incident Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="incidentDescription"
              value={formData.incidentDescription}
              onChange={handleChange}
              isInvalid={!!errors.incidentDescription}
              placeholder="Describe the incident"
            />
            <Form.Control.Feedback type="invalid">{errors.incidentDescription}</Form.Control.Feedback>
          </Form.Group>
        </>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Additional Details</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
          placeholder="Any extra details you want to include"
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      {!ticket && (
        <Form.Group className="mb-4">
          <Form.Label>Image Attachments (up to 3)</Form.Label>
          <Form.Control type="file" accept="image/*" multiple onChange={handleFileChange} isInvalid={!!errors.attachments} />
          <Form.Control.Feedback type="invalid">{errors.attachments}</Form.Control.Feedback>
          <Form.Text>Attach evidence such as damaged equipment photos or error screens.</Form.Text>
          {selectedFiles.length > 0 && (
            <div className="mt-2 small text-muted">
              Selected: {selectedFiles.map((file) => file.name).join(', ')}
            </div>
          )}
        </Form.Group>
      )}
      
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : (ticket ? 'Update' : 'Create')}
        </Button>
      </div>
    </Form>
  );
};

export default TicketForm;