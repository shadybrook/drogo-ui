import React, { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import TopBar from './TopBar';
import ProductGrid from './ProductGrid';
import CartDrawer from './CartDrawer';
import BottomNavigation from './BottomNavigation';
import { productCatalog } from '../data/products';

const HomePage = () => {
  const { selectedAddress, terraceAccessible } = useLocation();
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛒', color: 'var(--brand-light)' },
    { id: 'groceries', name: 'Groceries', icon: '🥬', color: '#e0f2fe' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊', color: '#fef3c7' },
    { id: 'beverages', name: 'Beverages', icon: '🥤', color: '#f3e8ff' },
    { id: 'electronics', name: 'Electronics', icon: '📱', color: '#ecfdf5' },
    { id: 'pet-care', name: 'Pet Care', icon: '🐕', color: '#fef2f2' }
  ];

  const filteredProducts = productCatalog.filter(product => {
    const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    setIsVoiceSearch(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsVoiceSearch(false);
    };
    
    recognition.onerror = () => {
      setIsVoiceSearch(false);
      alert('Voice search not available');
    };
    
    recognition.start();
  };

  const deliveryTime = terraceAccessible ? '5–10 min' : '10–20 min';

  return (
    <div className="screen active">
      <TopBar 
        address={selectedAddress}
        deliveryTime={deliveryTime}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onVoiceSearch={handleVoiceSearch}
        isVoiceSearch={isVoiceSearch}
      />

      {/* Enhanced CTA Banner */}
      <div className="cta-banner fade-in-up">
        <div className="drone-icon">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="droneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'var(--brand)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'var(--brand-2)', stopOpacity:1}} />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="85" rx="35" ry="8" fill="rgba(0,0,0,0.1)"/>
            <rect x="35" y="40" width="30" height="16" rx="8" fill="url(#droneGradient)"/>
            <rect x="20" y="32" width="60" height="6" rx="3" fill="var(--brand-2)"/>
            <circle cx="25" cy="35" r="12" fill="rgba(255,255,255,0.9)" stroke="var(--brand)" strokeWidth="2"/>
            <circle cx="75" cy="35" r="12" fill="rgba(255,255,255,0.9)" stroke="var(--brand)" strokeWidth="2"/>
            <circle cx="25" cy="35" r="3" fill="var(--brand)"/>
            <circle cx="75" cy="35" r="3" fill="var(--brand)"/>
            <rect x="45" y="56" width="10" height="12" rx="2" fill="#374151"/>
            <rect x="46" y="68" width="8" height="6" rx="2" fill="#1f2937"/>
            <circle cx="42" cy="48" r="2" fill="#ef4444"/>
            <circle cx="58" cy="48" r="2" fill="#10b981"/>
          </svg>
        </div>
        <div className="cta-content">
          <h3 className="cta-title">10-Minute Drone Delivery</h3>
          <p className="cta-subtitle">Fresh groceries and daily essentials, delivered by DroGo's smart drones.</p>
        </div>
      </div>

      {/* Category Chips */}
      <div style={{ padding: '0 16px' }}>
        <div className="category-chips">
          {categories.map(category => (
            <div 
              key={category.id}
              className={`category-chip ${currentCategory === category.id ? 'active' : ''}`}
              onClick={() => setCurrentCategory(category.id)}
            >
              <div className="chip-icon" style={{ background: category.color }}>
                {category.icon}
              </div>
              {category.name}
            </div>
          ))}
        </div>
      </div>

      {/* Product Sections */}
      <div className="section-header">
        <h2 className="section-title">
          {currentCategory === 'all' ? 'Top Picks for You' : 
           categories.find(c => c.id === currentCategory)?.name || 'Products'}
        </h2>
        <span className="view-all" onClick={() => setCurrentCategory('all')}>
          View All
        </span>
      </div>

      <ProductGrid products={filteredProducts} />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="home" />
    </div>
  );
};

export default HomePage;
