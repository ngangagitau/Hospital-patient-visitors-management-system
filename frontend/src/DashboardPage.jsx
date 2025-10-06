import { useEffect, useState } from 'react';
import axios from 'axios';

import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import CheckInForm from './components/CheckInForm';
import PatientManagement from './components/PatientManagement';
import VisitorHistory from './components/VisitorHistory';
import ActiveVisitors from './components/ActiveVisitors';
import AuditTrail from './components/AuditTrail';
import UserManagement from './components/UserManagement';

const API_BASE = 'http://192.168.0.178:5000/api';


function DashboardPage({ showAlert, user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [navOpen, setNavOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [activeVisitors, setActiveVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [patientsRes, visitorsRes, activeVisitorsRes] = await Promise.all([
        axios.get(`${API_BASE}/patients`),
        axios.get(`${API_BASE}/visitors/history`),
        axios.get(`${API_BASE}/visitors/active`)
      ]);
      setPatients(patientsRes.data);
      setVisitors(visitorsRes.data);
      setActiveVisitors(activeVisitorsRes.data);
    } catch (error) {
      showAlert('Error fetching data. Make sure backend is running on port 5000.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 600000);
    return () => clearInterval(interval);
  }, []);

  // Only show tabs allowed for the user's role
  const isAdmin = user?.role === 'admin';
  const navTabs = [
    { key: 'dashboard', label: '📊 Dashboard' },
    { key: 'checkin', label: '👥 Check In Visitor' },
    ...(isAdmin ? [{ key: 'patients', label: '🛏️ Manage Patients' }] : []),
    { key: 'activeVisitors', label: '👥 Active Visitors - Check Out' },
    { key: 'visitors', label: '📋 Visitor History' },
    ...(isAdmin ? [
      { key: 'users', label: '👤 User Management' },
      { key: 'audit', label: '📝 Audit Trail' }
    ] : []),
  ];

  return (
    <div className="container">
      {/* Header */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px'
        }}>
          🩺 Hospital Patient-Visitor's Management System 💉
        </h1>
        <p style={{ color: '#718096', fontSize: '1.1rem' }}>
          Managing visitor access during lunch and evening visiting hours
        </p>
      </div>

      {/* Navigation */}
      <nav className="nav dashboard-nav">
        <div className="nav-mobile-toggle" onClick={() => setNavOpen(v => !v)}>
          <span style={{ fontSize: 28, cursor: 'pointer' }}>⋯</span>
        </div>
        <ul className={`nav-tabs${navOpen ? ' open' : ''}`}>
          {navTabs.map(tab => (
            <li
              key={tab.key}
              className={`nav-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.key);
                setNavOpen(false);
              }}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </nav>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '10px', color: '#718096' }}>Loading...</p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dashboard-nav {
          position: relative;
        }
        .nav-mobile-toggle {
          display: none;
        }
        @media (max-width: 700px) {
          .nav-tabs {
            display: none;
            position: absolute;
            top: 40px;
            left: 0;
            right: 0;
            background: #fff;
            box-shadow: 0 4px 12px rgba(102,126,234,0.08);
            border-radius: 0 0 12px 12px;
            z-index: 100;
            flex-direction: column;
            gap: 0;
          }
          .nav-tabs.open {
            display: flex;
          }
          .nav-mobile-toggle {
            display: block;
            text-align: right;
            margin-bottom: 8px;
          }
          .nav-tab {
            padding: 16px 24px;
            border-bottom: 1px solid #eee;
            font-size: 1.1rem;
          }
        }
      `}</style>

      {/* Tab Content */}
      <div className="tab-content">
        {!loading && activeTab === 'dashboard' && (
          isAdmin ? (
            <AdminDashboard
              patients={patients}
              visitors={visitors}
              activeVisitors={activeVisitors}
              onRefresh={fetchData}
            />
          ) : (
            <Dashboard
              patients={patients}
              activeVisitors={activeVisitors}
              onRefresh={fetchData}
            />
          )
        )}
        {!loading && activeTab === 'checkin' && (
          <CheckInForm
            patients={patients}
            onCheckIn={fetchData}
            showAlert={showAlert}
            user={user}
          />
        )}
        {isAdmin && !loading && activeTab === 'patients' && (
          <PatientManagement
            patients={patients}
            onUpdate={fetchData}
            showAlert={showAlert}
            user={user}
          />
        )}
        {!loading && activeTab === 'activeVisitors' && (
          <ActiveVisitors
            activeVisitors={activeVisitors}
            onCheckOut={fetchData}
            showAlert={showAlert}
            user={user}
          />
        )}
        {!loading && activeTab === 'visitors' && (
          <VisitorHistory
            visitors={visitors}
            onCheckOut={fetchData}
            showAlert={showAlert}
            user={user}
          />
        )}
        {isAdmin && !loading && activeTab === 'users' && (
          <UserManagement user={user} showAlert={showAlert} />
        )}

        {isAdmin && !loading && activeTab === 'audit' && (
          <AuditTrail user={user} />
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
