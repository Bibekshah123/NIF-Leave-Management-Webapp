import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';

const Header = () => {
  const navigate = useNavigate();
  const { role, user, logout } = useAuth();
  const [showLogoutToast, setShowLogoutToast] = useState(false);

  const handleLogout = () => {
    setShowLogoutToast(true);
    setTimeout(() => {
      logout();
      navigate('/login');
    }, 1000);
  };

  return (
    <header className="header">
      {showLogoutToast && (
        <div className="toast-notification" style={{ position: 'absolute', top: '80px', right: '24px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <span>Logged out successfully!</span>
        </div>
      )}

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
        <div className="hd-user" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
          <div className="hd-av" style={{ background: user?.initials ? user.color : '#999' }}>{user?.initials || 'U'}</div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>{user?.full_name || user?.username || 'User'}</div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{user?.email || ''} · {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest'}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ marginLeft: '18px' }}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
