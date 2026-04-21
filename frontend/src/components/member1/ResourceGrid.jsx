import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const ResourceGrid = ({ resources }) => {
  const getStatusColor = (status) => {
    return status === 'ACTIVE'
      ? { bg: '#d4edda', text: '#155724', label: 'ACTIVE', borderColor: '#c3e6cb' }
      : { bg: '#f8d7da', text: '#721c24', label: 'OUT OF SERVICE', borderColor: '#f5c6cb' };
  };

  const getTypeIcon = (type) => {
    const icons = {
      LECTURE_HALL: '📚',
      LAB: '🧪',
      MEETING_ROOM: '▭',
      EQUIPMENT: '⚙'
    };
    return icons[type] || '📍';
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

  return (
    <Row className="g-4">
      {resources.map((resource) => {
        const statusColor = getStatusColor(resource.status);
        return (
          <Col key={resource.id} md={6} lg={4} xl={3}>
            <Card
              style={{
                height: '100%',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e9ecef',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              {/* Card Header with Type Badge */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '16px 20px',
                borderBottom: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '24px' }}>
                  {getTypeIcon(resource.type)}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: '#6c757d',
                  backgroundColor: '#e9ecef',
                  padding: '4px 10px',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  {getTypeLabel(resource.type)}
                </span>
              </div>

              <Card.Body style={{ padding: '20px' }}>
                <h5 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#1a3a52',
                  marginBottom: '16px',
                  lineHeight: '1.4'
                }}>
                  {resource.name}
                </h5>

                {/* Resource Details */}
                <div style={{
                  fontSize: '13px',
                  color: '#495057',
                  lineHeight: '1.8',
                  marginBottom: '16px'
                }}>
                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '600', minWidth: '70px' }}>Capacity:</span>
                    <span>{resource.capacity}</span>
                  </div>
                  <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '600', minWidth: '70px' }}>Location:</span>
                    <span>{resource.location}</span>
                  </div>
                  {resource.equipmentType && (
                    <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'flex-start' }}>
                      <span style={{ fontWeight: '600', minWidth: '70px' }}>Equipment:</span>
                      <span>{resource.equipmentType}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '600', minWidth: '70px' }}>Hours:</span>
                    <span>{resource.availableFrom?.substring(0, 5)} - {resource.availableTo?.substring(0, 5)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: `1.5px solid ${statusColor.borderColor}`,
                  textAlign: 'center'
                }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: statusColor.bg,
                      color: statusColor.text,
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      border: `1.5px solid ${statusColor.borderColor}`
                    }}
                  >
                    {statusColor.label}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ResourceGrid;
