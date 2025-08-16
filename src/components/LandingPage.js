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
    selectedAddress,
    terraceAccessible,
    selectedDeliverySpot,
    isSearching,
    searchResults,
    updateAddress,
    updateTerraceAccessibility,
    searchAddresses
  } = useLocation();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    // Only update the local display, don't trigger updateAddress yet
    setSelectedAddressLocal(value);
    
    if (value.length > 2) {
      try {
        await searchAddresses(value);
        setShowSuggestions(searchResults && searchResults.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  // Local state for address input to prevent auto-navigation
  const [selectedAddressLocal, setSelectedAddressLocal] = useState(selectedAddress || '');

  // Update suggestions when search results change
  useEffect(() => {
    setShowSuggestions(searchResults && searchResults.length > 0);
  }, [searchResults]);

  // Sync local state with context when selectedAddress changes externally
  useEffect(() => {
    if (selectedAddress && selectedAddress !== selectedAddressLocal) {
      setSelectedAddressLocal(selectedAddress);
    }
  }, [selectedAddress, selectedAddressLocal]);

  const handleAddressBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const selectAddress = (result) => {
    if (!result) return;
    const address = typeof result === 'string' ? result : (result.formatted_address || '');
    if (address) {
      setSelectedAddressLocal(address);
      // Don't call updateAddress here to prevent automatic navigation
      // Just update the local state for display
    }
    setShowSuggestions(false);
  };

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingLocation(true);
    try {
      // Mock current location detection without automatic navigation
      const mockAddress = 'Andheri Metro Station, Andheri West, Mumbai, Maharashtra';
      setSelectedAddressLocal(mockAddress);
      // Removed notification - visual feedback of address appearing is sufficient
      // toast.success('Location detected successfully! Please select a delivery spot on the map. 📍');
    } catch (error) {
      console.error('Location error:', error);
      toast.error('Unable to get location. Please enter manually.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleContinue = () => {
    // Step 1: Check authentication
    if (!user) {
      setShowAuthModal(true);
      toast.error('Please sign in to continue');
      return;
    }
    
    // Step 2: Check address input
    if (!selectedAddressLocal || selectedAddressLocal.trim().length < 5) {
      toast.error('Please enter a valid delivery address');
      return;
    }
    
    // Step 3: Check delivery spot selection
    if (!selectedDeliverySpot) {
      toast.error('Please select a delivery spot from the map below');
      setIsPanelExpanded(true);
      return;
    }
    
    // Step 4: Validate that the address is serviceable
    const isServiceable = selectedAddressLocal.toLowerCase().includes('andheri') || 
                         selectedAddressLocal.toLowerCase().includes('lokhandwala') ||
                         selectedAddressLocal.toLowerCase().includes('oshiwara') ||
                         selectedAddressLocal.toLowerCase().includes('versova') ||
                         selectedAddressLocal.toLowerCase().includes('infiniti') ||
                         selectedAddressLocal.toLowerCase().includes('midc');
    
    if (!isServiceable) {
      toast.error('Please select an address in our service area (Andheri West)');
      return;
    }
    
    // All requirements met - now update context and proceed
    // Preserve the delivery spot selection when updating address
    updateAddress(selectedAddressLocal, true);
    // Removed notification - navigation to home page is sufficient feedback
    // toast.success('Welcome to DroGo! 🚁');
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

      {/* Address Input Section */}
      <div className="address-section">
        <div className="address-container">
          <h3 className="address-title">Where should we deliver?</h3>
          
          <div className="location-input-group">
            <div className="input-with-icon">
              <div className="input-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <input 
                type="text" 
                value={selectedAddressLocal}
                onChange={handleAddressChange}
                onBlur={handleAddressBlur}
                className="address-input" 
                placeholder="Enter your delivery address"
                autoComplete="street-address"
              />
              <button 
                className="location-btn" 
                onClick={handleUseCurrentLocation}
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <div className="spinner" style={{ width: '18px', height: '18px' }}></div>
                ) : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                )}
              </button>
            </div>
            
            <div className={`address-suggestions ${showSuggestions ? 'show' : ''}`}>
              {isSearching && (
                <div className="suggestion-item" style={{ justifyContent: 'center', opacity: 0.7 }}>
                  <div className="spinner" style={{ width: '16px', height: '16px', marginRight: '8px' }}></div>
                  <span>Searching addresses...</span>
                </div>
              )}
              {!isSearching && searchResults && searchResults.map((result, index) => (
                <div 
                  key={result.place_id || index}
                  className="suggestion-item" 
                  onClick={() => selectAddress(result)}
                >
                  <div className="suggestion-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ink)' }}>
                      {result.formatted_address ? result.formatted_address.split(',')[0] : 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                      {result.formatted_address || 'No address available'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Map Section - Always show for address selection */}
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
            disabled={!user || !selectedAddressLocal || selectedAddressLocal.trim().length < 5 || !selectedDeliverySpot}
          >
            <span>
              {!user 
                ? 'Sign In to Continue'
                : !selectedAddressLocal || selectedAddressLocal.trim().length < 5
                ? 'Enter Your Address'
                : !selectedDeliverySpot
                ? 'Select a Spot on the Map'
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
