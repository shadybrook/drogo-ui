import React, { useState, useEffect } from 'react';
import { getAllOrders, getOrderAnalytics, updateOrderStatus } from '../services/database';
import { formatCurrency } from '../data/products';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersResult, analyticsResult] = await Promise.all([
        getAllOrders(),
        getOrderAnalytics()
      ]);

      if (ordersResult.data) {
        setOrders(ordersResult.data);
      }
      
      if (analyticsResult.data) {
        setAnalytics(analyticsResult.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const { data, error } = await updateOrderStatus(orderId, newStatus);
      
      if (error) {
        toast.error('Failed to update order status');
        return;
      }

      // Update local orders
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus, updated_at: new Date().toISOString() } : order
      ));

      toast.success(`Order status updated to ${newStatus}`);
      
      // Refresh analytics
      const analyticsResult = await getOrderAnalytics();
      if (analyticsResult.data) {
        setAnalytics(analyticsResult.data);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmed': '#10b981',
      'preparing': '#f59e0b',
      'dispatched': '#3b82f6',
      'in_transit': '#6366f1',
      'delivered': '#10b981',
      'cancelled': '#ef4444'
    };
    return colors[status] || '#64748b';
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = ['confirmed', 'preparing', 'dispatched', 'in_transit', 'delivered'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    // Can only move forward or cancel
    const options = statusFlow.slice(currentIndex);
    if (currentStatus !== 'delivered') {
      options.push('cancelled');
    }
    
    return options;
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ margin: 0, color: 'var(--ink)' }}>🚁 DroGo Admin Dashboard</h1>
        <button 
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: '8px 16px',
            background: 'var(--brand)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '32px' 
        }}>
          <div style={{ 
            padding: '20px', 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: 'var(--shadow)',
            border: '2px solid var(--brand-light)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--brand)' }}>Total Orders</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--ink)' }}>
              {analytics.total_orders || 0}
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: 'var(--shadow)',
            border: '2px solid #fef3c7'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#f59e0b' }}>Pending Orders</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--ink)' }}>
              {analytics.pending_orders || 0}
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: 'var(--shadow)',
            border: '2px solid #dcfce7'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#10b981' }}>Completed</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--ink)' }}>
              {analytics.completed_orders || 0}
            </p>
          </div>

          <div style={{ 
            padding: '20px', 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: 'var(--shadow)',
            border: '2px solid #f0f9ff'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Revenue</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: 'var(--ink)' }}>
              {formatCurrency(analytics.total_revenue || 0)}
            </p>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: 'var(--shadow)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '20px', 
          borderBottom: '1px solid #e5e7eb',
          background: '#f8fafc'
        }}>
          <h2 style={{ margin: 0, color: 'var(--ink)' }}>Recent Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: 'var(--muted)' 
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
            <h3>No Orders Yet</h3>
            <p>Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Order ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Items</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px', fontSize: '0.875rem', fontFamily: 'monospace' }}>
                      {order.id.slice(0, 8)}...
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{order.user_email || 'Anonymous'}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
                          {order.delivery_address?.split(',')[0] || 'No address'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {order.items?.length || 0} items
                    </td>
                    <td style={{ padding: '12px', fontWeight: 600 }}>
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status)
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '0.875rem'
                        }}
                      >
                        {getStatusOptions(order.status).map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Real-time indicator */}
      <div style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px',
        background: 'var(--brand)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '20px',
        fontSize: '0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: 'var(--shadow)'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          background: '#10b981',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }}></div>
        Live Updates
      </div>
    </div>
  );
};

export default AdminDashboard;
