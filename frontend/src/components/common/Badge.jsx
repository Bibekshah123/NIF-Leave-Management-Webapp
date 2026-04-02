import React from 'react';

const Badge = ({ status }) => {
  let className = 'chip ';
  let label = status;

  switch (status.toLowerCase()) {
    case 'draft':
      className += 'ch-draft';
      label = 'Draft';
      break;
    case 'submitted':
    case 'checking':
    case 'review':
      className += 'ch-checking';
      label = 'Checking';
      break;
    case 'approved':
      className += 'ch-approved';
      label = 'Approved';
      break;
    case 'rejected':
    case 'returned':
      className += 'ch-rejected';
      label = 'Returned';
      break;
    default:
      className += 'ch-pending';
      label = status;
  }

  return <span className={className}>{label}</span>;
};

export default Badge;
