import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const ResourceGrid = ({ resources }) => {
  const getStatusColor = (status) => {
    return status === 'ACTIVE'
      ? { bg: '#d4edda', text: '#155724', label: '🟢 ACTIVE' }
      : { bg: '#f8d7da', text: '#721c24', label: '🔴 OUT OF SERVICE' };
  };

  const getTypeIcon = (type) => {
    const icons = {
      LECTURE_HALL: '🎓',
      LAB: '🔬',
      MEETING_ROOM: '💼',
      EQUIPMENT: '📱'
    };
    return icons[type] || '📍';
  };

  return (
    <Row className="g-3">
      {resources.map((resource) => {
        const statusColor = getStatusColor(resource.status);
        return (
          <Col key={resource.id} md={6} lg={4} xl={3}>
            <Card
              style={{
                height: '100%',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body style={{ padding: '20px' }}>
                <div style={{ marginBottom: '15px' }}>
                  <div style={{
                    fontSize: '28px',
                    marginBottom: '8px'
                  }}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <h5 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a3a52',
                    marginBottom: '5px',
                    wordBreak: 'break-word'
                  }}>
                    {resource.name}
                  </h5>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: '#6c757d',
                  marginBottom: '12px',
                  lineHeight: '1.6'
                }}>
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Type:</strong> {resource.type.replace(/_/g, ' ')}
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Capacity:</strong> {resource.capacity} people
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Location:</strong> {resource.location}
                  </div>
                  {resource.equipmentType && (
                    <div style={{ marginBottom: '6px' }}>
                      <strong>Equipment:</strong> {resource.equipmentType}
                    </div>
                  )}
                  <div>
                    <strong>Hours:</strong> {resource.availableFrom?.substring(0, 5)} - {resource.availableTo?.substring(0, 5)}
                  </div>
                </div>

                <div style={{
                  marginTop: '15px',
                  paddingTop: '15px',
                  borderTop: '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: statusColor.bg,
                      color: statusColor.text
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
