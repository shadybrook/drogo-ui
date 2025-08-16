import React, { useState, useEffect } from 'react';
import { useOrders } from '../contexts/OrderContext';
import { formatCurrency } from '../data/products';
import BottomNavigation from './BottomNavigation';

const OrdersPage = () => {
  const { currentOrder, getOrderStatus, getEstimatedDeliveryTime } = useOrders();
  const [etaMinutes, setEtaMinutes] = useState(8);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Update ETA based on real order data
  useEffect(() => {
    if (currentOrder) {
      const eta = getEstimatedDeliveryTime(currentOrder);
      if (eta && eta.includes('minute')) {
        const minutes = parseInt(eta.split(' ')[0]);
        setEtaMinutes(minutes || 0);
      }
    }
  }, [currentOrder, getEstimatedDeliveryTime]);

  // Get current order status and timeline
  const orderStatusInfo = getOrderStatus(currentOrder);
  
  const getStatusSteps = () => {
    if (!currentOrder) {
      return [
        { id: 'confirmed', label: 'Order Confirmed', completed: false },
        { id: 'preparing', label: 'Preparing', completed: false },
        { id: 'dispatched', label: 'Drone Dispatched', completed: false },
        { id: 'delivered', label: 'Delivered', completed: false }
      ];
    }

    const status = currentOrder.status;
    const statusOrder = ['confirmed', 'preparing', 'dispatched', 'in_transit', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    return [
      { id: 'confirmed', label: 'Order Confirmed', completed: currentIndex >= 0 },
      { id: 'preparing', label: 'Preparing', completed: currentIndex >= 1 },
      { id: 'dispatched', label: 'Drone Dispatched', completed: currentIndex >= 2 },
      { id: 'delivered', label: 'Delivered', completed: currentIndex >= 4 }
    ];
  };

  const statusSteps = getStatusSteps();

  return (
    <div className="screen active">
      {/* Tracking Header */}
      <div className="tracking-header">
        <p className="eta-label">Your order is arriving in</p>
        <h1 className="eta-display">
          <span>{etaMinutes}</span> min
        </h1>
        <div className="status-indicator">🛩️ Live Tracking</div>
      </div>

      {/* Status Timeline */}
      <div className="status-timeline">
        {statusSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`status-step ${step.completed ? 'completed' : ''}`}
          >
            <div className="step-indicator">
              {step.completed ? '✓' : index + 1}
            </div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {/* Enhanced Map */}
      <div className="tracking-map">
        <div className="delivery-route">
          <div className="route-waypoint start"></div>
          <div className="route-waypoint end"></div>
        </div>
        
        {/* Animated Drone */}
        <div className="animated-drone">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <g>
              <rect x="30" y="35" width="40" height="20" rx="10" fill="var(--brand)"/>
              <rect x="20" y="25" width="60" height="8" rx="4" fill="var(--brand-2)"/>
              <circle cx="20" cy="29" r="15" fill="rgba(255,255,255,0.8)" stroke="var(--brand-2)" strokeWidth="2"/>
              <circle cx="80" cy="29" r="15" fill="rgba(255,255,255,0.8)" stroke="var(--brand-2)" strokeWidth="2"/>
              <rect x="45" y="55" width="10" height="12" rx="2" fill="#374151"/>
            </g>
          </svg>
        </div>
      </div>

      {/* Pilot Information */}
      <div className="pilot-card">
        <div className="pilot-avatar">👨‍✈️</div>
        <div className="pilot-info">
          <h4>Pilot: Samir Kumar (DG-47)</h4>
          <p className="pilot-details">1.2 km away • Contactless delivery • 4.9★ rating</p>
        </div>
        <button className="contact-btn">📞 Call</button>
      </div>

      {/* Order Summary */}
      {currentOrder && (
        <div className="bill-summary">
          <h3 style={{ margin: '0 0 16px 0' }}>Order Summary</h3>
          <div className="bill-row">
            <span>Items ({currentOrder.items?.length || 0})</span>
            <span>{formatCurrency(currentOrder.total_amount - 19 - Math.round((currentOrder.total_amount - 19) * 0.05))}</span>
          </div>
          <div className="bill-row">
            <span>Drone convenience fee</span>
            <span>{formatCurrency(19)}</span>
          </div>
          <div className="bill-row">
            <span>Taxes & fees</span>
            <span>{formatCurrency(Math.round((currentOrder.total_amount - 19) * 0.05))}</span>
          </div>
          <div className="bill-row" style={{ color: 'var(--success)' }}>
            <span>Delivery</span>
            <strong>FREE</strong>
          </div>
          <div className="bill-row bill-total">
            <span>Total Paid</span>
            <span>{formatCurrency(currentOrder.total_amount)}</span>
          </div>

          {/* Order Items */}
          {currentOrder.items && currentOrder.items.length > 0 && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '12px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: 'var(--muted)' }}>Items Ordered:</h4>
              {currentOrder.items.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '4px 0',
                  fontSize: '0.875rem'
                }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Order State */}
      {!currentOrder && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 24px',
          color: 'var(--muted)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
          <h3>No Active Orders</h3>
          <p>You don't have any orders in progress right now.</p>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="orders" />
    </div>
  );
};

export default OrdersPage;
