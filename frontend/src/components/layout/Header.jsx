import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const Header = () => {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLeaveModule = location.pathname.startsWith('/leave');

  return (
    <header className="header">
      <div className="hd-brand">
        <div className="hd-logo">
          <img src="/NIF.png" alt="NIF Logo" style={{ height: '42px', objectFit: 'contain' }} />
        </div>
        <div className="hd-sep"></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '1px' }}>PORTAL SYSTEM</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>B.S. 2082-12-18</span>
        </div>
      </div>
      <div className="hd-right">
        <div className="module-switcher">
          <button className={`ms-btn ${isLeaveModule ? 'on' : ''}`} onClick={() => navigate('/leave')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            Leave Management
          </button>
          <button className={`ms-btn ${!isLeaveModule ? 'on' : ''}`} onClick={() => navigate('/memos')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
            Memo Approval
          </button>
        </div>
        <div className="hd-user">
          <div className="hd-av" style={{ background: user?.initials ? user.color : '#999' }}>{user?.initials || 'U'}</div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{user?.full_name || user?.username || 'User'}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{user?.email || ''} · {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest'}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => logout()} style={{ marginLeft: '18px' }}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
