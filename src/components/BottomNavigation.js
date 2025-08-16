import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const BottomNavigation = ({ activeScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems, openCart } = useCart();
  
  const totalItems = getTotalItems();

  const navItems = [
    {
      id: 'home',
      route: '/home',
      icon: (
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 15V9a4 4 0 118 0v6"/>
        </svg>
      ),
      label: 'Explore'
    },
    {
      id: 'cart',
      route: null, // Special handling for cart
      icon: (
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H4m2 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"/>
        </svg>
      ),
      label: 'Cart',
      badge: totalItems
    },
    {
      id: 'orders',
      route: '/orders',
      icon: (
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      ),
      label: 'Orders'
    },
    {
      id: 'account',
      route: '/account',
      icon: (
        <svg className="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
      ),
      label: 'Account'
    }
  ];

  const getCurrentRoute = () => {
    return location.pathname;
  };

  const handleNavClick = (item) => {
    if (item.id === 'cart') {
      openCart();
    } else if (item.route) {
      navigate(item.route);
    }
  };

  const isActive = (item) => {
    if (activeScreen) {
      return activeScreen === item.id;
    }
    
    const currentRoute = getCurrentRoute();
    return currentRoute === item.route;
  };

  return (
    <div className="bottom-nav">
      {navItems.map(item => (
        <div
          key={item.id}
          className={`nav-item ${isActive(item) ? 'active' : ''}`}
          onClick={() => handleNavClick(item)}
        >
          <div style={{ position: 'relative' }}>
            {item.icon}
            {item.badge > 0 && (
              <div className="nav-badge show">
                {item.badge > 99 ? '99+' : item.badge}
              </div>
            )}
          </div>
          <span className="nav-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BottomNavigation;
