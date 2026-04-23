import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LeaveSidebar = () => {
  const { role } = useAuth();
  const canApply = role === 'maker' || role === 'admin';
  const canReview = ['approver', 'admin'].includes(role);
  const canViewOwnApplications = role === 'maker' || role === 'admin';

  return (
    <nav className="sidebar">
      <div className="sb-section">
        <div className="sb-hd">Overview</div>
        <NavLink to="/leave" end className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}>
          <span className="sb-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </span>
          Dashboard
        </NavLink>
      </div>

      <div className="sb-section">
        <div className="sb-hd">Leave Management</div>
        {canApply && (
          <NavLink to="/leave/apply" className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}>
            <span className="sb-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            </span>
            Apply for Leave
          </NavLink>
        )}
        {canViewOwnApplications && (
          <NavLink to="/leave/my-applications" className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}>
            <span className="sb-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>
            </span>
            My Applications
          </NavLink>
        )}
        {canReview && (
          <NavLink to="/leave/pending" className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}>
            <span className="sb-ico">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </span>
            Pending Requests
          </NavLink>
        )}
      </div>

      <div className="sb-section">
        <div className="sb-hd">Team</div>
        <NavLink to="/leave/calendar" className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}>
          <span className="sb-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </span>
          Team Calendar
        </NavLink>
      </div>
    </nav>
  );
};

export default LeaveSidebar;
