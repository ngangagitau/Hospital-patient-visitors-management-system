import React from 'react';
import { useNavigate } from 'react-router-dom';

function Profile({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  if (!user) return <div style={{ padding: 32 }}>No user info available.</div>;

  return (
    <div className="card" style={{ maxWidth: 400, margin: '40px auto', padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>👤 Profile</h2>
      <div style={{ marginBottom: 16 }}>
        <strong>Username:</strong> {user.username}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>First Name:</strong> {user.firstName || '-'}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Last Name:</strong> {user.lastName || '-'}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Phone:</strong> {user.phone || '-'}
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Privileges:</strong> {user.role === 'admin' ? 'Admin (Full Access)' : 'User (Limited Access)'}
      </div>
      <button className="btn btn-danger" onClick={handleLogout} style={{ marginTop: 24, width: '100%' }}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
