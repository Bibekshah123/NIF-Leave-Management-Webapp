import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <div className="sb-section">
        <div className="sb-hd">Workspace</div>
        <NavLink to="/memos" end className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}>
          <span className="sb-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </span>
          Dashboard
        </NavLink>
        <NavLink to="/memos/all" className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}>
          <span className="sb-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
          </span>
          All Memos
        </NavLink>
        <NavLink to="/memos/drafts" className={({ isActive }) => `sb-item ${isActive ? 'on' : ''}`}>
          <span className="sb-ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </span>
          My Drafts
        </NavLink>
      </div>

      <div className="sb-section">
        <div className="sb-hd">Quick Actions</div>
        <div className="sb-item" style={{ color: 'var(--nepal-blue)', fontWeight: 600 }}>
          <NavLink to="/memos/new" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', width: '100%' }}>
            <span className="sb-ico" style={{ marginRight: '10px' }}>+</span>
            Draft New Memo
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
