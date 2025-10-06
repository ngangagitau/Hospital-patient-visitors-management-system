import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import Login from './Login';
import Profile from './components/Profile';

function AppRoutes({ user, onLogin, showAlert }) {
  // Logout handler: clear user from localStorage and reload
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={onLogin} showAlert={showAlert} />} />
      <Route path="/dashboard" element={user ? <DashboardPage showAlert={showAlert} user={user} /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  );
}

export default AppRoutes;
