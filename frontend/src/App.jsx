import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import NavigationBar from './components/NavigationBar';
import './index.css';

function App() {
  const [user, setUser] = useState(() => {
    // Try to load user from localStorage
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [welcome, setWelcome] = useState({ show: false, name: '' });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    // Add smooth fade-in on page load
    document.body.classList.add('page-loaded');
    return () => {
      document.body.classList.remove('page-loaded');
    };
  }, []);

  const handleLogin = (userData) => {
    setLoginLoading(true);
    setWelcome({ show: true, name: userData.username });
    setTimeout(() => {
      setUser(userData);
      setLoginLoading(false);
      // Hide welcome after 20 seconds
      setTimeout(() => setWelcome({ show: false, name: '' }), 20000);
    }, 1000);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000);
  };

  if (loginLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid #f3f3f3',
          borderTop: '6px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  return (
    <BrowserRouter>
      <NavigationBar user={user} onLogout={handleLogout} welcome={welcome} />
      {/* Welcome message now only in NavigationBar */}
      {alert.show && (
        <div className={`alert alert-${alert.type}`} style={{ position: 'fixed', top: 10, left: 0, right: 0, zIndex: 1000, textAlign: 'center' }}>
          {alert.message}
        </div>
      )}
      <AppRoutes user={user} onLogin={handleLogin} showAlert={showAlert} />
      <footer style={{
        marginTop: 40,
        padding: '18px 0',
        background: '#222',
        color: '#fff',
        textAlign: 'center',
        fontSize: 16
      }}>
        <div>
          Developed by <strong>Shon Networking &amp; Technologies</strong><br />
          <span title="Website" style={{ marginRight: 6 }}>🌐</span>
          <a href="https://www.shonnetworking.co.ke" target="_blank" rel="noopener noreferrer" style={{ color: '#90cdf4', marginRight: 16 }}>www.shonnetworking.co.ke</a>
          <span title="Email" style={{ marginRight: 6 }}>✉️</span>
          <a href="mailto:info@shonnetworking.co.ke" style={{ color: '#90cdf4', marginRight: 16 }}>info@shonnetworking.co.ke</a>
          <span title="Phone" style={{ marginRight: 6 }}>📞</span>
          <a href="tel:+1234567890" style={{ color: '#90cdf4' }}>+254 794 521 982</a>
        </div>
      </footer>
    </BrowserRouter>
  );
}

export default App;
