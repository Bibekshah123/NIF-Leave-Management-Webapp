import React from 'react';
import Badge from './Badge';

const LeaveCard = ({ leave }) => {
  // Extract initials
  const initials = leave.employee
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="leave-card">
      <div className="lc-av">{initials}</div>
      <div className="lc-info">
        <div className="lc-name">{leave.employee}</div>
        <div className="lc-type">{leave.type}</div>
        <div className="lc-dates">
          {leave.start} to {leave.end} ({leave.days} days)
        </div>
      </div>
      <div className="lc-status">
        <Badge status={leave.status} />
      </div>
    </div>
  );
};

export default LeaveCard;
