import React from 'react';
import { Badge } from 'react-bootstrap';

const STATUS_VARIANT_MAP = {
  OPEN: 'secondary',
  IN_PROGRESS: 'primary',
  RESOLVED: 'success',
  CLOSED: 'dark',
  REJECTED: 'danger',
};

const formatStatus = (status) => {
  if (!status) {
    return 'UNKNOWN';
  }

  return status.replaceAll('_', ' ');
};

const TicketStatusBadge = ({ status }) => {
  const variant = STATUS_VARIANT_MAP[status] || 'secondary';

  return <Badge bg={variant}>{formatStatus(status)}</Badge>;
};

export default TicketStatusBadge;
