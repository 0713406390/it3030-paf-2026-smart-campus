import React from 'react';
import { Card, Table } from 'react-bootstrap';

const ResourceListView = ({ resources }) => {
  const getStatusBadge = (status) => {
    return status === 'ACTIVE'
      ? { bg: '#d4edda', text: '#155724', label: 'ACTIVE', borderColor: '#c3e6cb' }
      : { bg: '#f8d7da', text: '#721c24', label: 'OUT OF SERVICE', borderColor: '#f5c6cb' };
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

  const getTypeIcon = (type) => {
    const icons = {
      LECTURE_HALL: '📚',
      LAB: '🧪',
      MEETING_ROOM: '▭',
      EQUIPMENT: '⚙'
    };
    return icons[type] || '📍';
  };

  return (
    <Card style={{
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: 'none',
      overflow: 'hidden'
    }}>
      <Card.Body style={{ padding: '0' }}>
        <div style={{ overflowX: 'auto' }}>
          <Table hover style={{ marginBottom: '0', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Name</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Type</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Capacity</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Location</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Hours</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px'
                }}>Equipment</th>
                <th style={{ 
                  padding: '16px 18px', 
                  fontWeight: '700', 
                  color: '#1a3a52',
                  textTransform: 'uppercase',
                  fontSize: '12px',
                  letterSpacing: '0.3px',
                  textAlign: 'center'
                }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource, index) => {
                const statusBadge = getStatusBadge(resource.status);
                return (
                  <tr 
                    key={resource.id}
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                      borderBottom: '1px solid #e9ecef',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e7f1ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa'}
                  >
                    <td style={{ padding: '16px 18px', fontWeight: '600', color: '#1a3a52' }}>
                      {resource.name}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057' }}>
                      <span style={{ 
                        fontSize: '13px',
                        backgroundColor: '#e9ecef',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {getTypeLabel(resource.type)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057' }}>
                      {resource.capacity}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057' }}>
                      {resource.location}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057', fontSize: '13px' }}>
                      {resource.availableFrom?.substring(0, 5)} - {resource.availableTo?.substring(0, 5)}
                    </td>
                    <td style={{ padding: '16px 18px', color: '#495057', fontSize: '13px' }}>
                      {resource.equipmentType || '-'}
                    </td>
                    <td style={{ padding: '16px 18px', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          backgroundColor: statusBadge.bg,
                          color: statusBadge.text,
                          border: `1.5px solid ${statusBadge.borderColor}`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px'
                        }}
                      >
                        {statusBadge.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ResourceListView;
