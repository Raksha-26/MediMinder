import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LoadingSpinner from './components/LoadingSpinner';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={`/${user.role}`} />} />
        <Route path="/patient" element={user?.role === 'patient' ? <PatientDashboard /> : <Navigate to="/login" />} />
        <Route path="/doctor" element={user?.role === 'doctor' ? <DoctorDashboard /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? `/${user.role}` : '/login'} />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <AppContent />
          </div>
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;