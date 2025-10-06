import React, { useState } from 'react';

function ActiveVisitors({ activeVisitors, onCheckOut, showAlert, user }) {
  const [search, setSearch] = useState('');

  const filteredActiveVisitors = activeVisitors.filter(visitor => {
    const q = search.toLowerCase();
    return (
      visitor.name.toLowerCase().includes(q) ||
      visitor.visitorId?.toLowerCase().includes(q) ||
      visitor.patientName?.toLowerCase().includes(q) ||
      visitor.patientId?.toLowerCase().includes(q)
    );
  });

  const handleCheckOut = async (visitorId) => {
    try {
      await fetch(`/api/visitors/checkout/${visitorId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ checkedOutBy: user?.username, role: user?.role })
      });
      showAlert('✅ Visitor checked out successfully!');
      onCheckOut();
    } catch (error) {
      showAlert('❌ Error checking out visitor', 'error');
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">👥 Active Visitors - Check Out</h2>
        <input
          type="text"
          className="form-input"
          style={{ maxWidth: 300, marginLeft: 16 }}
          placeholder="Search by name, ID, or patient..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {filteredActiveVisitors.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>👥</div>
          <p>No active visitors to check out</p>
        </div>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Patient</th>
                <th>Visit Type</th>
                <th>Check-in Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredActiveVisitors.map(visitor => (
                <tr key={visitor._id}>
                  <td>
                    <strong>{visitor.name}</strong>
                    <br />
                    <small style={{ color: '#718096' }}>
                      ID: {visitor.visitorId} | {visitor.relationship}
                    </small>
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
                    {new Date(visitor.checkInTime).toLocaleString()}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCheckOut(visitor.visitorId)}
                    >
                      🚪 Check Out
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ActiveVisitors;
