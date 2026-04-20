import React from 'react';
import { Card, Table } from 'react-bootstrap';

const ResourceListView = ({ resources }) => {
  const getStatusBadge = (status) => {
    return status === 'ACTIVE'
      ? { bg: '#d4edda', text: '#155724', label: '🟢 ACTIVE' }
      : { bg: '#f8d7da', text: '#721c24', label: '🔴 OUT OF SERVICE' };
  };

  return (
    <Card style={{
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: 'none'
    }}>
      <Card.Body style={{ padding: '0' }}>
        <Table striped hover style={{ marginBottom: '0' }}>
          <thead style={{ backgroundColor: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Name</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Type</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Capacity</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Location</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Hours</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Equipment</th>
              <th style={{ padding: '12px 15px', fontWeight: '600', color: '#1a3a52' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => {
              const statusBadge = getStatusBadge(resource.status);
              return (
                <tr key={resource.id}>
                  <td style={{ padding: '12px 15px' }}>{resource.name}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{ fontSize: '13px' }}>
                      {resource.type.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px 15px' }}>{resource.capacity}</td>
                  <td style={{ padding: '12px 15px' }}>{resource.location}</td>
                  <td style={{ padding: '12px 15px', fontSize: '13px' }}>
                    {resource.availableFrom?.substring(0, 5)} - {resource.availableTo?.substring(0, 5)}
                  </td>
                  <td style={{ padding: '12px 15px', fontSize: '13px' }}>
                    {resource.equipmentType || '-'}
                  </td>
                  <td style={{ padding: '12px 15px' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: statusBadge.bg,
                        color: statusBadge.text
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
      </Card.Body>
    </Card>
  );
};

export default ResourceListView;
