import React, { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';

const IntentForm = () => {
  const { showIntentForm, setShowIntentForm, submitIntentForm, selectedAddress } = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: selectedAddress || '',
    preferredDeliveryItems: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showIntentForm) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.address) {
      return;
    }

    setIsSubmitting(true);
    const success = await submitIntentForm(formData);
    setIsSubmitting(false);
    
    if (success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        preferredDeliveryItems: ''
      });
    }
  };

  const closeForm = () => {
    setShowIntentForm(false);
  };

  return (
    <div className="cart-drawer open">
      <div className="cart-backdrop" onClick={closeForm}></div>
      <div className="cart-sheet" style={{ maxHeight: '80vh' }}>
        <div className="cart-header">
          <h3 className="cart-title">
            🚁 Coming to Your Area Soon!
          </h3>
          <button className="close-btn" onClick={closeForm}>✕</button>
        </div>
        
        <div style={{ padding: '24px' }}>
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, #e6fff2, #f0f9ff)',
            borderRadius: '16px',
            border: '2px solid var(--brand)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🌟</div>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--ink)' }}>
              Great News!
            </h4>
            <p style={{ 
              margin: '0', 
              color: 'var(--muted)',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              We're expanding rapidly! Join our waitlist to be the first to know when 
              DroGo's 10-minute drone delivery launches in your neighborhood.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 600,
                color: 'var(--ink)'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--brand)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 600,
                color: 'var(--ink)'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--brand)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 600,
                color: 'var(--ink)'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--brand)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 600,
                color: 'var(--ink)'
              }}>
                Your Address *
              </label>
              <input
                type="text"
                name="address"
                placeholder="Enter your complete address"
                value={formData.address}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'var(--transition)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--brand)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontWeight: 600,
                color: 'var(--ink)'
              }}>
                What would you like delivered? (Optional)
              </label>
              <textarea
                name="preferredDeliveryItems"
                placeholder="e.g., Groceries, medicines, electronics..."
                value={formData.preferredDeliveryItems}
                onChange={handleInputChange}
                rows="3"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'var(--transition)',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--brand)'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <button 
              type="submit" 
              className="checkout-btn"
              disabled={isSubmitting || !formData.name || !formData.email || !formData.address}
              style={{ 
                margin: 0,
                background: isSubmitting ? '#d1d5db' : 'var(--brand)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px', marginRight: '8px' }}></div>
                  Submitting...
                </>
              ) : (
                <>
                  🚀 Join Waitlist
                </>
              )}
            </button>
          </form>

          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px',
            padding: '16px',
            background: '#f8fafc',
            borderRadius: '12px'
          }}>
            <p style={{ 
              margin: '0', 
              color: 'var(--muted)', 
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}>
              💝 Early subscribers get <strong>free delivery for the first month</strong> when we launch!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntentForm;
