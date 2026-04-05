import React from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';

const Header = () => {
  const { role, user, logout } = useAuth();

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
