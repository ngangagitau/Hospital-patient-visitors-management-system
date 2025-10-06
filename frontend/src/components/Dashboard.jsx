import React, { useState } from 'react';

function Dashboard({ patients, activeVisitors, onRefresh }) {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const stats = {
    totalPatients: patients.length,
    activeVisitors: activeVisitors.length,
    availableSlots: patients.reduce((acc, patient) => acc + (2 - patient.currentVisitors), 0),
    wards: [...new Set(patients.map(p => p.ward))].length
  };

  // Filter active visitors if a patient is selected
  const filteredActiveVisitors = selectedPatientId
    ? activeVisitors.filter(v => v.patientId === selectedPatientId)
    : activeVisitors;

  // Filter patients by search
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.patientId?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.ward?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.room?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  // Get selected patient name for display
  const selectedPatient = patients.find(p => p.patientId === selectedPatientId);

  // Smooth loading on refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.resolve(onRefresh && onRefresh());
    setTimeout(() => setRefreshing(false), 600); // keep spinner for a bit
  };

  return (
    <div>
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activeVisitors}</div>
          <div className="stat-label">Active Visitors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.availableSlots}</div>
          <div className="stat-label">Available Slots</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.wards}</div>
          <div className="stat-label">Wards</div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        {/* Active Visitors */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">👥 Active Visitors</h2>
            <button className="btn btn-secondary" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span className="spinner" style={{
                    width: 18, height: 18, border: '3px solid #f3f3f3', borderTop: '3px solid #667eea', borderRadius: '50%', marginRight: 8,
                    animation: 'spin 1s linear infinite', display: 'inline-block'
                  }}></span>
                  Refreshing...
                </span>
              ) : (
                <>
                  🔄 Refresh
                </>
              )}
            </button>
            {selectedPatientId && (
              <button
                className="btn btn-info"
                style={{ marginLeft: 12 }}
                onClick={() => setSelectedPatientId(null)}
              >
                Show All
              </button>
            )}
          </div>
          {filteredActiveVisitors.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
              <p>No {selectedPatientId ? `active visitors for ${selectedPatient?.name}` : 'active visitors at the moment'}</p>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Patient</th>
                    <th>Visit Type</th>
                    <th>Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActiveVisitors.map(visitor => (
                    <tr key={visitor._id}>
                      <td>
                        <strong>{visitor.name}</strong>
                        <br />
                        <small style={{ color: '#718096' }}>{visitor.relationship}</small>
                      </td>
                      <td>
                        {visitor.patientName}
                        <br />
                        <small style={{ color: '#718096' }}>ID: {visitor.patientId}</small>
                      </td>
                      <td>
                        <span className={`badge ${
                          visitor.visitType === 'lunch' ? 'badge-warning' : 'badge-info'
                        }`}>
                          {visitor.visitType === 'lunch' ? '🍽️ Lunch' : '🌆 Evening'}
                        </span>
                      </td>
                      <td>
                        {new Date(visitor.checkInTime).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Patient Status */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <h2 className="card-title">🛏️ Patient Status</h2>
            <input
              type="text"
              className="form-input"
              placeholder="Search patient by name, ID, ward, or room..."
              value={patientSearch}
              onChange={e => setPatientSearch(e.target.value)}
              style={{ maxWidth: 260 }}
            />
          </div>
          {filteredPatients.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛏️</div>
              <p>No patients registered yet</p>
            </div>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Patient ID</th>
                    <th>Name</th>
                    <th>Ward/Room</th>
                    <th>Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(patient => (
                    <tr key={patient._id}>
                      <td>
                        <strong>{patient.patientId}</strong>
                      </td>
                      <td>
                        <button
                          className="btn btn-link"
                          style={{ color: '#4f46e5', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                          onClick={() => setSelectedPatientId(patient.patientId)}
                        >
                          {patient.name}
                        </button>
                      </td>
                      <td>
                        {patient.ward} - {patient.room}
                      </td>
                      <td>
                        <span className={`badge ${
                          patient.currentVisitors === 0 ? 'badge-success' :
                          patient.currentVisitors === 2 ? 'badge-danger' : 'badge-warning'
                        }`}>
                          {patient.currentVisitors}/2
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
