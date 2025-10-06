import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://192.168.0.178:5000/api';

function PatientManagement({ patients, onUpdate, showAlert, user }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: `P${(patients.length + 1).toString().padStart(3, '0')}`,
    name: '',
    ward: '',
    room: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/patients`, {
        ...formData,
        createdBy: user?.username,
        role: user?.role
      });
      showAlert('✅ Patient added successfully!');
      setFormData({
        patientId: `P${(patients.length + 2).toString().padStart(3, '0')}`,
        name: '',
        ward: '',
        room: ''
      });
      setShowForm(false);
      onUpdate();
    } catch (error) {
      showAlert(error.response?.data?.message || '❌ Error adding patient', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Discharge patient handler
  const handleDischarge = async (patientId) => {
    if (!window.confirm('Are you sure you want to discharge this patient?')) return;
    try {
      await axios.delete(`${API_BASE}/patients/${patientId}`, {
        data: { deletedBy: user?.username, role: user?.role }
      });
      showAlert('✅ Patient discharged successfully!');
      onUpdate();
    } catch (error) {
      showAlert(error.response?.data?.message || '❌ Error discharging patient', 'error');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🛏️ Patient Management</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Cancel' : '➕ Add New Patient'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginBottom: '24px', padding: '20px', border: '2px solid #e2e8f0', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '20px', color: '#4a5568' }}>Add New Patient</h3>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Patient ID *</label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter patient ID"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter patient's full name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ward *</label>
                <select
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Ward</option>
                  <option value="Male Medical">Male Medical</option>
                  <option value="Male Surgical ">Male Surgical</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="HDU">HDU</option>
                  <option value="ICU">ICU</option>
                  <option value="Female Medical">Female Medical</option>
                  <option value="Female Surgical">Female Surgical</option>
                  <option value="Private Ward ">Private Ward</option>
                  <option value="Maternity">Maternity</option>
                  <option value="HDU">New Born Unit</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Room/Bed *</label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter room number"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-success">
              💾 Save Patient
            </button>
          </form>
        )}

        {patients.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🛏️</div>
            <p>No patients registered. Add your first patient above.</p>
          </div>
        ) : (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Ward</th>
                  <th>Room</th>
                  <th>Current Visitors</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(patient => (
                  <tr key={patient._id}>
                    <td><strong>{patient.patientId}</strong></td>
                    <td>{patient.name}</td>
                    <td>
                      <span className="badge badge-info">
                        {patient.ward}
                      </span>
                    </td>
                    <td>{patient.room}</td>
                    <td>
                      <span className={`badge ${
                        patient.currentVisitors === 0 ? 'badge-success' :
                        patient.currentVisitors === 2 ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {patient.currentVisitors}/2
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        {patient.status}
                      </span>
                      <button
                        className="btn btn-danger"
                        style={{ marginLeft: 12 }}
                        onClick={() => handleDischarge(patient._id)}
                      >
                        🏥 Discharge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientManagement;
