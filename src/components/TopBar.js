import React from 'react';

const TopBar = ({ 
  address, 
  deliveryTime, 
  searchQuery, 
  onSearch, 
  onVoiceSearch, 
  isVoiceSearch 
}) => {
  const shortAddress = address ? address.split(',')[0] : 'Your Location';

  return (
    <div className="top-bar">
      <div className="location-header">
        <div className="location-pin"></div>
        <div>
          <div className="body-sm" style={{ color: 'var(--muted)', marginBottom: '2px' }}>
            Deliver to
          </div>
          <div className="body" style={{ fontWeight: 700 }}>
            {shortAddress}
          </div>
        </div>
        <div 
          className="delivery-badge" 
          style={{ 
            background: deliveryTime.includes('5–10') ? 'var(--success)' : 'var(--brand-light)',
            color: deliveryTime.includes('5–10') ? 'white' : 'var(--brand-2)'
          }}
        >
          {deliveryTime}
        </div>
      </div>

      <div className="search-container">
        <div className="search-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input 
          className="search-input" 
          placeholder="Search groceries, medicines, electronics..." 
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
        <button className="voice-btn" onClick={onVoiceSearch} disabled={isVoiceSearch}>
          {isVoiceSearch ? (
            <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
          ) : (
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default TopBar;
