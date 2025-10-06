import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://192.168.0.178:5000/api';

function CheckInForm({ patients, onCheckIn, showAlert, user }) {
  const [formData, setFormData] = useState({
    visitorId: `V${Date.now().toString().slice(-6)}`,
    name: '',
    patientId: '',
    visitType: 'lunch',
    contactNumber: '',
    relationship: 'Family'
  });
  const [visitorSuggestions, setVisitorSuggestions] = useState([]);

  // Fetch matching visitors as user types name or contact
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (formData.name.length < 2 && formData.contactNumber.length < 3) {
        setVisitorSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/visitors/search`, {
          params: {
            name: formData.name,
            contactNumber: formData.contactNumber
          }
        });
        setVisitorSuggestions(res.data);
      } catch (err) {
        setVisitorSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [formData.name, formData.contactNumber]);

  const handleSuggestionClick = (visitor) => {
    setFormData({
      ...formData,
      name: visitor.name,
      contactNumber: visitor.contactNumber,
      relationship: visitor.relationship
    });
    setVisitorSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/visitors/checkin`, {
        ...formData,
        checkedInBy: user?.username,
        role: user?.role
      });
      showAlert('✅ Visitor checked in successfully!');
      setFormData({
        visitorId: `V${Date.now().toString().slice(-6)}`,
        name: '',
        patientId: '',
        visitType: 'lunch',
        contactNumber: '',
        relationship: 'Family'
      });
      onCheckIn();
    } catch (error) {
      showAlert(error.response?.data?.message || '❌ Error checking in visitor', 'error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">👥 Check In New Visitor</h2>
      </div>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="grid grid-cols-2">
          <div className="form-group">
            <label className="form-label">Visitor ID *</label>
            <input
              type="text"
              name="visitorId"
              value={formData.visitorId}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter visitor ID"
              required
            />
            <small style={{ color: '#718096', fontSize: '0.875rem' }}>
              Auto-generated ID
            </small>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter visitor's full name"
              required
              autoComplete="off"
            />
            {/* Suggestions dropdown */}
            {visitorSuggestions.length > 0 && (
              <ul style={{
                position: 'absolute',
                zIndex: 10,
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                width: '100%',
                maxHeight: 150,
                overflowY: 'auto',
                marginTop: 2,
                padding: 0,
                listStyle: 'none'
              }}>
                {visitorSuggestions.map(v => (
                  <li
                    key={v.visitorId}
                    style={{ padding: 8, cursor: 'pointer' }}
                    onClick={() => handleSuggestionClick(v)}
                  >
                    {v.name} ({v.contactNumber})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select Patient</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient.patientId}>
                  {patient.name} (ID: {patient.patientId}) - {patient.ward} - Current: {patient.currentVisitors}/2
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Visit Type *</label>
            <select
              name="visitType"
              value={formData.visitType}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="lunch">🍽️ Lunch Time Visit (13:00 - 14:00)</option>
              <option value="evening">🌆 Evening Visit (16:00 - 17:00)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter contact number"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Relationship *</label>
            <select
              name="relationship"
              value={formData.relationship}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Family">👨‍👩‍👧‍👦 Family</option>
              <option value="Friend">👫 Friend</option>
              <option value="Relative">🧓 Relative</option>
              <option value="Other">❓ Other</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          ✅ Check In Visitor
        </button>
      </form>
    </div>
  );
}

// In your main component (e.g., DashboardPage), render <NavigationBar /> at the top

export default CheckInForm;
