import React, { useState } from 'react';
import axios from 'axios';
import { exportVisitorsToPDF } from './exportVisitorsToPDF';

const API_BASE = 'http://192.168.0.178:5000/api';


const filterOptions = [
  { value: 'visitor', label: 'Visitor' },
  { value: 'patient', label: 'Patient' },
  { value: 'visitType', label: 'Visit Type' },
  { value: 'checkIn', label: 'Check-in' },
  { value: 'checkOut', label: 'Check-out' },
  { value: 'status', label: 'Status' },
];

const visitTypeOptions = [
  { value: '', label: 'All' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'evening', label: 'Evening' },
];
const statusOptions = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'checkedout', label: 'Checked Out' },
  { value: 'inactive', label: 'Inactive' },
];

function VisitorHistory({ visitors, onCheckOut, showAlert }) {
  const [dateFilter, setDateFilter] = useState('');
  const [filterBy, setFilterBy] = useState('visitor');
  const [filterValue, setFilterValue] = useState('');

  // Filtering logic
  const filteredVisitors = visitors.filter(visitor => {
    // Date filter (legacy, keep for PDF export)
    if (dateFilter) {
      const date = new Date(visitor.checkInTime).toISOString().slice(0, 10);
      if (date !== dateFilter) return false;
    }
    // New filter
    if (!filterValue) return true;
    if (filterBy === 'visitor') {
      return (
        visitor.name.toLowerCase().includes(filterValue.toLowerCase()) ||
        visitor.visitorId?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (filterBy === 'patient') {
      return (
        visitor.patientName?.toLowerCase().includes(filterValue.toLowerCase()) ||
        visitor.patientId?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (filterBy === 'visitType') {
      return visitor.visitType === filterValue;
    }
    if (filterBy === 'status') {
      if (filterValue === 'checkedout') {
        return visitor.status !== 'active';
      }
      return visitor.status === filterValue;
    }
    if (filterBy === 'checkIn') {
      const date = new Date(visitor.checkInTime).toISOString().slice(0, 10);
      return date === filterValue;
    }
    if (filterBy === 'checkOut') {
      if (!visitor.checkOutTime) return false;
      const date = new Date(visitor.checkOutTime).toISOString().slice(0, 10);
      return date === filterValue;
    }
    return true;
  });

  return (
    <div className="card">
      <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <h2 className="card-title">📋 Visitor History</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginLeft: 'auto', flexWrap: 'wrap' }}>
          {/* Filter dropdown */}
          <select
            className="form-select"
            value={filterBy}
            onChange={e => { setFilterBy(e.target.value); setFilterValue(''); }}
            style={{ minWidth: 120 }}
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Filter value field */}
          {['visitor', 'patient'].includes(filterBy) && (
            <input
              type="text"
              className="form-input"
              placeholder={`Search ${filterBy === 'visitor' ? 'Visitor' : 'Patient'}...`}
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              style={{ minWidth: 180 }}
            />
          )}
          {filterBy === 'visitType' && (
            <select
              className="form-select"
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              style={{ minWidth: 120 }}
            >
              {visitTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
          {filterBy === 'status' && (
            <select
              className="form-select"
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              style={{ minWidth: 120 }}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}
          {['checkIn', 'checkOut'].includes(filterBy) && (
            <input
              type="date"
              className="form-input"
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              style={{ minWidth: 140 }}
            />
          )}
          {/* PDF Export uses legacy date filter for now */}
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="form-input"
            style={{ maxWidth: 140 }}
          />
          <button className="btn btn-primary" onClick={() => exportVisitorsToPDF(filteredVisitors)}>
            Export to PDF
          </button>
        </div>
      </div>
      {filteredVisitors.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📋</div>
          <p>No visitor history available</p>
        </div>
      ) : (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Patient</th>
                <th>Visit Type</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisitors.map(visitor => (
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
                    {visitor.checkOutTime 
                      ? new Date(visitor.checkOutTime).toLocaleString()
                      : '-'
                    }
                  </td>
                  <td>
                    <span className={`badge ${
                      visitor.status === 'active' ? 'badge-success' : 'badge-secondary'
                    }`}>
                      {visitor.status}
                    </span>
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

export default VisitorHistory;
