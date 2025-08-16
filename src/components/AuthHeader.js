import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthHeader = () => {
  const { user, signOut, setShowAuthModal } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleSignOut = async () => {
    setShowUserDropdown(false);
    await signOut();
  };

  if (!user) {
    return (
      <div className="auth-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--brand)' }}>
            DroGo
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="auth-btn outline"
            onClick={() => setShowAuthModal(true)}
          >
            Sign In
          </button>
          <button 
            className="auth-btn"
            onClick={() => setShowAuthModal(true)}
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--brand)' }}>
          DroGo
        </div>
      </div>
      
      <div className="user-menu">
        <img
          src={user.photoURL}
          alt={user.name}
          className="user-avatar"
          onClick={() => setShowUserDropdown(!showUserDropdown)}
        />
        
        <div className={`user-dropdown ${showUserDropdown ? 'show' : ''}`}>
          <div className="dropdown-item" style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '8px', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--ink)' }}>{user.name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{user.email}</div>
            </div>
          </div>
          
          <div className="dropdown-item">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            Profile Settings
          </div>
          
          <div className="dropdown-item">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Order History
          </div>
          
          <div className="dropdown-item">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Help & Support
          </div>
          
          <div 
            className="dropdown-item" 
            onClick={handleSignOut}
            style={{ color: 'var(--danger)', borderTop: '1px solid #f1f5f9', marginTop: '8px', paddingTop: '12px' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Sign Out
          </div>
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div 
          style={{ 
            position: 'fixed', 
            inset: 0, 
            zIndex: 50 
          }}
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </div>
  );
};

export default AuthHeader;
