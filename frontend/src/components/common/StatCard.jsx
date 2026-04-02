import React from 'react';

const StatCard = ({ title, value, subtitle, colorClass = '' }) => {
  return (
    <div className={`stat-card ${colorClass}`}>
      <div className="s-lbl">{title}</div>
      <div className="s-num">{value}</div>
      <div className="s-sub">{subtitle}</div>
    </div>
  );
};

export default StatCard;
