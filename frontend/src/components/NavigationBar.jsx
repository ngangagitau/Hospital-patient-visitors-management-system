import React, { useState, useRef } from 'react';

function ProfileDropdown({ user, onLogout, onClose, anchorRef }) {
  if (!user || !anchorRef?.current) return null;
  // Position dropdown below the anchor
  const rect = anchorRef.current.getBoundingClientRect();
  return (
    <div
      style={{
        position: 'absolute',
        top: rect.height + 8,
        right: 0,
        minWidth: 260,
        background: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        borderRadius: 8,
        zIndex: 2000,
        padding: 20,
      }}
      tabIndex={-1}
      onBlur={onClose}
    >
      <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 18 }}>👤 Profile</div>
      <div style={{ marginBottom: 8 }}><strong>Username:</strong> {user.username}</div>
      <div style={{ marginBottom: 8 }}><strong>First Name:</strong> {user.firstName || '-'}</div>
      <div style={{ marginBottom: 8 }}><strong>Last Name:</strong> {user.lastName || '-'}</div>
      <div style={{ marginBottom: 8 }}><strong>Phone:</strong> {user.phone || '-'}</div>
      <div style={{ marginBottom: 8 }}><strong>Privileges:</strong> {user.role === 'admin' ? 'Admin (Full Access)' : 'User (Limited Access)'}</div>
      <button className="btn btn-danger" onClick={onLogout} style={{ marginTop: 12, width: '100%' }}>Logout</button>
    </div>
  );
}

function NavigationBar({ user, onLogout, welcome }) {
  const [showProfile, setShowProfile] = useState(false);
  const profileBtnRef = useRef();

  // Close dropdown on Escape or click outside
  React.useEffect(() => {
    if (!showProfile) return;
    const handler = e => {
      if (e.key === 'Escape') setShowProfile(false);
      if (e.type === 'mousedown' && profileBtnRef.current) {
        if (!profileBtnRef.current.contains(e.target)) setShowProfile(false);
      }
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('mousedown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('mousedown', handler);
    };
  }, [showProfile]);

  return (
    <nav className="main-navbar">
      <ul className="main-navbar-list">
        {welcome && (
          <li
            style={{
              color: '#234e52',
              fontWeight: 600,
              fontSize: 18,
              marginRight: 24,
              background: '#e6fffa',
              borderRadius: 8,
              padding: '6px 18px',
              opacity: welcome.show ? 1 : 0,
              transition: 'opacity 2s',
            }}
          >
            Welcome back, <span role="img" aria-label="wave">👋</span> {welcome.name}
          </li>
        )}
        <li style={{ marginLeft: 'auto', position: 'relative' }} ref={profileBtnRef}>
          <button
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              textDecoration: 'none',
              color: '#333',
              background: 'none',
              border: 'none',
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.textDecoration = 'underline';
              e.target.style.color = '#4f46e5';
            }}
            onMouseLeave={e => {
              e.target.style.textDecoration = 'none';
              e.target.style.color = '#333';
            }}
            onClick={() => setShowProfile(v => !v)}
          >
            Profile
          </button>
          {showProfile && (
            <ProfileDropdown user={user} onLogout={onLogout} onClose={() => setShowProfile(false)} anchorRef={profileBtnRef} />
          )}
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;
