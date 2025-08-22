import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { toast } from 'react-toastify';
import InteractiveMap from './InteractiveMap';
import AuthHeader from './AuthHeader';
import IntentForm from './IntentForm';


const LandingPage = () => {
  const navigate = useNavigate();
  const { user, setShowAuthModal } = useAuth();
  const {
    terraceAccessible,
    selectedDeliverySpot,
    updateTerraceAccessibility
  } = useLocation();

  // No longer need search box functionality

  const handleContinue = () => {
    // Step 1: Check authentication
    if (!user) {
      setShowAuthModal(true);
      toast.error('Please sign in to continue');
      return;
    }
    
    // Step 2: Check delivery spot selection (only requirement now)
    if (!selectedDeliverySpot) {
      toast.error('Please select a delivery spot from the map below');
      setIsPanelExpanded(true);
      return;
    }
    
    // All requirements met - proceed to home
    navigate('/home');
  };

  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  return (
    <div className="screen active">
      {/* Auth Header */}
      <AuthHeader />

      {/* Hero Section */}
      <div className="landing-hero">
        <div className="hero-content">
          <div className="brand-logo">
            <div className="drone-logo">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'var(--brand)', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'var(--brand-2)', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <rect x="35" y="40" width="30" height="16" rx="8" fill="url(#logoGradient)"/>
                <rect x="20" y="32" width="60" height="6" rx="3" fill="var(--brand-2)"/>
                <circle cx="25" cy="35" r="12" fill="rgba(255,255,255,0.9)" stroke="var(--brand)" strokeWidth="2"/>
                <circle cx="75" cy="35" r="12" fill="rgba(255,255,255,0.9)" stroke="var(--brand)" strokeWidth="2"/>
                <circle cx="25" cy="35" r="3" fill="var(--brand)"/>
                <circle cx="75" cy="35" r="3" fill="var(--brand)"/>
                <rect x="45" y="56" width="10" height="12" rx="2" fill="#374151"/>
                <circle cx="42" cy="48" r="2" fill="#ef4444"/>
                <circle cx="58" cy="48" r="2" fill="#10b981"/>
              </svg>
            </div>
            <h1 className="brand-title">DroGo</h1>
          </div>
          
          <div className="hero-text">
            <h2 className="hero-title">Drone Delivery in Minutes</h2>
            <p className="hero-subtitle">Get groceries, medicines, and daily essentials delivered by smart drones in 10 minutes or less.</p>
          </div>
          
          <div className="service-highlights">
            <div className="highlight-item">
              <div className="highlight-icon">🚁</div>
              <span>10-min delivery</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">📦</div>
              <span>Contactless drop</span>
            </div>
            <div className="highlight-item">
              <div className="highlight-icon">💚</div>
              <span>Zero emissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Location Section */}
      <div className="address-section">
        <div className="address-container">
          <h3 className="address-title">Select Your Delivery Location</h3>
          
          {/* Interactive Map Section - Select from available spots */}
          <InteractiveMap 
            isPanelExpanded={isPanelExpanded}
            setIsPanelExpanded={setIsPanelExpanded}
            showOnLanding={true}
          />

          {/* Terrace Accessibility Section */}
          <div className="terrace-section">
            <div className="terrace-checkbox-container">
              <label className="terrace-checkbox-label">
                <input 
                  type="checkbox" 
                  className="terrace-checkbox"
                  checked={terraceAccessible}
                  onChange={(e) => updateTerraceAccessibility(e.target.checked)}
                />
                <div className="custom-checkbox">
                  <svg className="checkmark" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <div className="checkbox-content">
                  <span className="checkbox-title">My terrace/rooftop is accessible for drone delivery</span>
                  <span className="checkbox-subtitle">This helps us plan the best delivery route for your order</span>
                </div>
              </label>
            </div>
            
            <div className="delivery-info">
              <div className="info-card">
                <div className="info-icon">🏠</div>
                <div className="info-text">
                  <strong>Terrace Access Recommended</strong>
                  <span>For fastest delivery, ensure your terrace is clear and accessible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <button 
            className="continue-btn" 
            onClick={handleContinue}
            disabled={!user || !selectedDeliverySpot}
          >
            <span>
              {!user 
                ? 'Sign In to Continue'
                : !selectedDeliverySpot
                ? 'Select a Delivery Spot on the Map'
                : `Continue with ${selectedDeliverySpot.name}`
              }
            </span>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p className="footer-text">🛡️ Safe, secure, and contactless delivery to your doorstep</p>
      </div>

      {/* Intent Form Modal */}
      <IntentForm />
    </div>
  );
};

export default LandingPage;
