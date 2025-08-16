import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LandingPage from './components/LandingPage';
import HomePage from './components/HomePage';
import OrdersPage from './components/OrdersPage';
import AccountPage from './components/AccountPage';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';

import { useAuth } from './contexts/AuthContext';
import { useLocation } from './contexts/LocationContext';

function App() {
  const { user, loading } = useAuth();
  const { selectedAddress } = useLocation();

  if (loading) {
    return (
      <div className="app">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          gap: '16px'
        }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
          <p style={{ color: 'var(--muted)' }}>Loading DroGo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Routes>
        {/* Landing Page - Always accessible */}
        <Route 
          path="/" 
          element={
            selectedAddress && user ? 
            <Navigate to="/home" replace /> : 
            <LandingPage />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            user && selectedAddress ? 
            <HomePage /> : 
            <Navigate to="/" replace />
          } 
        />
        
        <Route 
          path="/orders" 
          element={
            user && selectedAddress ? 
            <OrdersPage /> : 
            <Navigate to="/" replace />
          } 
        />
        
        <Route 
          path="/account" 
          element={
            user ? 
            <AccountPage /> : 
            <Navigate to="/" replace />
          } 
        />

        {/* Admin Dashboard - accessible via /admin */}
        <Route 
          path="/admin" 
          element={<AdminDashboard />} 
        />
        
        {/* Catch all - redirect to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif'
        }}
      />
    </div>
  );
}

export default App;
