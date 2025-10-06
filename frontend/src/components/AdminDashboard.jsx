import React from 'react';

function AdminDashboard({ patients, visitors, activeVisitors, onRefresh }) {
  // Two-column layout: patients left, visitors right
  return (
    <div>
      <h2 style={{ fontSize: '2rem', marginBottom: 16 }}>👑 Admin Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{patients.length}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeVisitors.length}</div>
          <div className="stat-label">Active Visitors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{visitors.length}</div>
          <div className="stat-label">Total Visits</div>
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <button className="btn btn-secondary" onClick={onRefresh}>🔄 Refresh Data</button>
      </div>
      <div style={{
        display: 'flex',
        gap: '32px',
        marginTop: '32px',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        {/* Patients List - Left */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <h3>All Patients</h3>
          <ul style={{ paddingLeft: 20 }}>
            {patients.map(p => (
              <li key={p._id} style={{ marginBottom: 8 }}>{p.name} (ID: {p.patientId}, Ward: {p.ward}, Room: {p.room})</li>
            ))}
          </ul>
        </div>
        {/* Visitors List - Right */}
        <div style={{ flex: 1, minWidth: 320 }}>
          <h3>All Visitors</h3>
          <ul style={{ paddingLeft: 20 }}>
            {visitors.map(v => (
              <li key={v._id} style={{ marginBottom: 8 }}>{v.name} visiting {v.patientName} ({v.visitType})</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
