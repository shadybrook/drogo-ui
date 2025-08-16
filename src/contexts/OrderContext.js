import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  createOrder, 
  getUserOrders, 
  subscribeToOrders,
  updateOrderStatus
} from '../services/database';
import { 
  initializePushNotifications, 
  notifyOrderStatus, 
  subscribeToPushNotifications 
} from '../services/notifications';
import { toast } from 'react-toastify';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserOrders = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { data, error } = await getUserOrders(user.id);
      if (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } else {
        setOrders(data || []);
        // Set current order to the most recent pending order
        const pendingOrder = data?.find(order => 
          ['confirmed', 'preparing', 'dispatched'].includes(order.status)
        );
        if (pendingOrder) {
          setCurrentOrder(pendingOrder);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initialize push notifications and fetch orders on login
  useEffect(() => {
    if (user?.id) {
      fetchUserOrders();
      
      // Initialize push notifications for user
      initializePushNotifications().then((success) => {
        if (success) {
          subscribeToPushNotifications(user.id);
        }
      });
    } else {
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [user, fetchUserOrders]);

  // Subscribe to real-time order updates
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToOrders(user.id, (updatedOrders) => {
      if (Array.isArray(updatedOrders)) {
        setOrders(updatedOrders);
        // Update current order if it exists
        if (currentOrder) {
          const updated = updatedOrders.find(o => o.id === currentOrder.id);
          if (updated) {
            setCurrentOrder(updated);
            // Show notification for status changes
            if (updated.status !== currentOrder.status) {
              showStatusNotification(updated.status);
              // Also send push notification
              notifyOrderStatus(updated.status, updated);
            }
          }
        }
      }
    });

    return unsubscribe;
  }, [user, currentOrder, fetchUserOrders]);

  const placeOrder = async (orderData) => {
    if (!user?.id) {
      console.error('🔍 OrderContext: No user ID found:', user);
      toast.error('Please sign in to place an order');
      return { success: false };
    }

    // Validate required order data
    if (!orderData.total || !orderData.address || !orderData.deliverySpot || !orderData.items?.length) {
      console.error('🔍 OrderContext: Missing required order data:', {
        total: !!orderData.total,
        address: !!orderData.address,
        deliverySpot: !!orderData.deliverySpot,
        itemsCount: orderData.items?.length || 0
      });
      toast.error('Missing required order information. Please check your cart and delivery details.');
      return { success: false };
    }

    console.log('🔍 OrderContext: Starting order placement with data:', orderData);
    console.log('🔍 OrderContext: User ID:', user.id);

    setLoading(true);
    try {
      const orderPayload = {
        user_id: user.id,
        total_amount: orderData.total,
        delivery_address: orderData.address,
        delivery_spot: orderData.deliverySpot,
        terrace_accessible: orderData.terraceAccessible,
        items: orderData.items
      };

      console.log('🔍 OrderContext: Sending payload to createOrder:', orderPayload);

      const { data, error } = await createOrder(orderPayload);

      console.log('🔍 OrderContext: createOrder result:', { data, error });

      if (error) {
        console.error('🔍 OrderContext: Error placing order:', error);
        toast.error(`Failed to place order: ${error.message || 'Please try again.'}`);
        return { success: false, error };
      }

      if (!data) {
        console.error('🔍 OrderContext: No data returned from createOrder');
        toast.error('Order placement failed - no data received. Please try again.');
        return { success: false };
      }

      // Update local state
      setOrders(prev => [data, ...prev]);
      setCurrentOrder(data);
      
      console.log('🔍 OrderContext: Order placed successfully:', data);
      toast.success('Order placed successfully! 🚁');
      
      // Start order status simulation for demo
      if (data?.id) {
        setTimeout(() => simulateOrderProgress(data.id), 1000);
      }

      return { success: true, orderId: data.id, data };
    } catch (error) {
      console.error('🔍 OrderContext: Exception placing order:', error);
      toast.error(`Order failed: ${error.message || 'Please try again.'}`);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Simulate order progress for demo purposes
  const simulateOrderProgress = async (orderId) => {
    const statuses = [
      { status: 'preparing', delay: 2000, message: '📦 Order is being prepared' },
      { status: 'dispatched', delay: 5000, message: '🚁 Drone dispatched!' },
      { status: 'in_transit', delay: 8000, message: '✈️ On the way to you' },
      { status: 'delivered', delay: 10000, message: '📦 Order delivered!' }
    ];

    for (const { status, delay, message } of statuses) {
      setTimeout(async () => {
        const { data, error } = await updateOrderStatus(orderId, status);
        if (!error && data) {
          setCurrentOrder(data);
          setOrders(prev => prev.map(order => 
            order.id === orderId ? data : order
          ));
          toast.info(message, { autoClose: 3000 });
        }
      }, delay);
    }
  };

  const showStatusNotification = (status) => {
    const messages = {
      'confirmed': '✅ Order confirmed',
      'preparing': '📦 Preparing your order',
      'dispatched': '🚁 Drone dispatched',
      'in_transit': '✈️ On the way',
      'delivered': '📦 Delivered!',
      'cancelled': '❌ Order cancelled'
    };

    const message = messages[status] || `Order status: ${status}`;
    toast.info(message, { autoClose: 3000 });
  };

  const getOrderStatus = (order) => {
    if (!order) return { text: 'No active order', color: '#64748b' };

    const statusConfig = {
      'confirmed': { text: 'Order Confirmed', color: '#10b981' },
      'preparing': { text: 'Preparing', color: '#f59e0b' },
      'dispatched': { text: 'Drone Dispatched', color: '#3b82f6' },
      'in_transit': { text: 'In Transit', color: '#6366f1' },
      'delivered': { text: 'Delivered', color: '#10b981' },
      'cancelled': { text: 'Cancelled', color: '#ef4444' }
    };

    return statusConfig[order.status] || { text: order.status, color: '#64748b' };
  };

  const getEstimatedDeliveryTime = (order) => {
    if (!order?.estimated_delivery) return null;

    const deliveryTime = new Date(order.estimated_delivery);
    const now = new Date();
    const diffMinutes = Math.ceil((deliveryTime - now) / (1000 * 60));

    if (diffMinutes <= 0) return 'Arriving now!';
    if (diffMinutes === 1) return '1 minute';
    return `${diffMinutes} minutes`;
  };

  const value = {
    orders,
    currentOrder,
    loading,
    placeOrder,
    fetchUserOrders,
    getOrderStatus,
    getEstimatedDeliveryTime,
    updateOrderStatus: async (orderId, status) => {
      const { data, error } = await updateOrderStatus(orderId, status);
      if (!error && data) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? data : order
        ));
        if (currentOrder?.id === orderId) {
          setCurrentOrder(data);
        }
      }
      return { data, error };
    }
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
