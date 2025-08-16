import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { toast } from 'react-toastify';
import BottomNavigation from './BottomNavigation';

const AccountPage = () => {
  const { user, signOut } = useAuth();
  const { selectedAddress, resetLocation } = useLocation();

  const handleEditAddress = () => {
    toast.info('Address editing coming soon! 📍', {
      autoClose: 3000
    });
  };

  const handleManagePayments = () => {
    toast.info('Payment management coming soon! 💳', {
      autoClose: 3000
    });
  };

  const handleOrderHistory = () => {
    toast.info('Order history coming soon! 📦', {
      autoClose: 3000
    });
  };

  const handleHelp = () => {
    toast.info('Help & Support: Call 1800-DROGO-1 📞', {
      autoClose: 5000
    });
  };

  const handleSignOut = async () => {
    resetLocation();
    await signOut();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const shortAddress = selectedAddress ? selectedAddress.split(',')[0] : 'No address selected';

  return (
    <div className="screen active">
      <div style={{ padding: '24px' }}>
        {/* User Profile Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '32px' 
        }}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '3px solid var(--brand)',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{ 
              width: '64px', 
              height: '64px', 
              background: 'linear-gradient(135deg, var(--brand), var(--brand-2))', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '1.5rem', 
              color: 'white', 
              fontWeight: '700' 
            }}>
              {getInitials(user?.name || 'User')}
            </div>
          )}
          <div>
            <h2 style={{ margin: '0 0 4px 0' }}>
              Hello, {user?.name || 'User'} 👋
            </h2>
            <p style={{ margin: '0', color: 'var(--muted)' }}>
              DroGo Premium Member since 2024
            </p>
          </div>
        </div>

        {/* Account Options */}
        <div style={{ display: 'grid', gap: '16px' }}>
          <div 
            className="product-card" 
            style={{ padding: '20px', cursor: 'pointer' }}
            onClick={handleEditAddress}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>📍 Delivery Address</h4>
                <p style={{ 
                  margin: '0', 
                  color: 'var(--muted)', 
                  fontSize: '0.875rem' 
                }}>
                  {shortAddress}
                  {selectedAddress && selectedAddress.includes(',') && 
                    ` • ${selectedAddress.split(',')[1]?.trim()}`
                  }
                </p>
              </div>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <div 
            className="product-card" 
            style={{ padding: '20px', cursor: 'pointer' }}
            onClick={handleManagePayments}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>💳 Payment Methods</h4>
                <p style={{ 
                  margin: '0', 
                  color: 'var(--muted)', 
                  fontSize: '0.875rem' 
                }}>
                  UPI • ****1234 • Google Pay
                </p>
              </div>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <div 
            className="product-card" 
            style={{ padding: '20px', cursor: 'pointer' }}
            onClick={handleOrderHistory}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>📦 Order History</h4>
                <p style={{ 
                  margin: '0', 
                  color: 'var(--muted)', 
                  fontSize: '0.875rem' 
                }}>
                  View all your past orders
                </p>
              </div>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <div 
            className="product-card" 
            style={{ padding: '20px', cursor: 'pointer' }}
            onClick={handleHelp}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>❓ Help & Support</h4>
                <p style={{ 
                  margin: '0', 
                  color: 'var(--muted)', 
                  fontSize: '0.875rem' 
                }}>
                  Get help with orders and account
                </p>
              </div>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          {/* App Settings */}
          <div className="product-card" style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 16px 0' }}>⚙️ App Settings</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ fontSize: '0.875rem' }}>Push Notifications</span>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ fontSize: '0.875rem' }}>Location Services</span>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <span style={{ fontSize: '0.875rem' }}>Email Updates</span>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  style={{ transform: 'scale(1.2)' }}
                />
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button 
            className="btn btn-secondary"
            onClick={handleSignOut}
            style={{ 
              width: '100%',
              padding: '16px',
              marginTop: '24px',
              background: 'var(--danger)',
              color: 'white',
              border: 'none'
            }}
          >
            🚪 Sign Out
          </button>
        </div>

        {/* App Info */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px', 
          padding: '24px',
          background: '#f8fafc',
          borderRadius: '12px'
        }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            color: 'var(--muted)', 
            fontSize: '0.875rem' 
          }}>
            DroGo Drone Delivery App
          </p>
          <p style={{ 
            margin: '0', 
            color: 'var(--muted)', 
            fontSize: '0.75rem' 
          }}>
            Version 1.0.0 • Made with ❤️ for fast delivery
          </p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="account" />
    </div>
  );
};

export default AccountPage;
