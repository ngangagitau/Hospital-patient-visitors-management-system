

import { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function AuditTrail({ user }) {
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get('http://192.168.0.178:5000/api/audit', {
      headers: {
        'x-user-role': user?.role || ''
      }
    })
      .then(res => setAudit(res.data))
      .catch(() => setAudit([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Export to Excel handler
  const handleExportExcel = () => {
    if (!audit.length) return;
    const data = audit.map(entry => ({
      Timestamp: new Date(entry.timestamp).toLocaleString(),
      User: entry.user || '-',
      Action: entry.action,
      Details: typeof entry.details === 'object' ? JSON.stringify(entry.details) : entry.details
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AuditTrail');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `audit_trail_${Date.now()}.xlsx`);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="card-title">📝 Audit Trail</h2>
        <button
          className="btn btn-success"
          style={{ marginLeft: 'auto', minWidth: 140 }}
          onClick={handleExportExcel}
          disabled={loading || audit.length === 0}
        >
          Export to Excel
        </button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>Loading...</div>
      ) : audit.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#718096', padding: '40px' }}>No audit records found.</div>
      ) : (
        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((entry, idx) => (
                <tr key={idx}>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>{entry.user || '-'}</td>
                  <td>{entry.action}</td>
                  <td>{typeof entry.details === 'object' ? JSON.stringify(entry.details) : entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuditTrail;
