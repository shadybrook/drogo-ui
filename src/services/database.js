import { supabase, useMockData } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// ===== ORDER MANAGEMENT =====

export const createOrder = async (orderData) => {
  if (useMockData) {
    // Mock implementation for development
    const mockOrder = {
      id: uuidv4(),
      ...orderData,
      status: 'confirmed',
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
    };
    
    // Store in localStorage for demo
    const orders = JSON.parse(localStorage.getItem('drogo_orders') || '[]');
    orders.push(mockOrder);
    localStorage.setItem('drogo_orders', JSON.stringify(orders));
    
    return { data: mockOrder, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        user_id: orderData.user_id,
        total_amount: orderData.total_amount,
        delivery_address: orderData.delivery_address,
        delivery_spot: orderData.delivery_spot,
        terrace_accessible: orderData.terrace_accessible,
        items: orderData.items,
        status: 'confirmed',
        estimated_delivery: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      }])
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Create order error:', error);
    return { data: null, error };
  }
};

export const getUserOrders = async (userId) => {
  if (useMockData) {
    const orders = JSON.parse(localStorage.getItem('drogo_orders') || '[]');
    return { data: orders.filter(order => order.user_id === userId), error: null };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Get user orders error:', error);
    return { data: [], error };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  if (useMockData) {
    const orders = JSON.parse(localStorage.getItem('drogo_orders') || '[]');
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = status;
      orders[orderIndex].updated_at = new Date().toISOString();
      localStorage.setItem('drogo_orders', JSON.stringify(orders));
      return { data: orders[orderIndex], error: null };
    }
    return { data: null, error: 'Order not found' };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Update order status error:', error);
    return { data: null, error };
  }
};

// ===== PRODUCT MANAGEMENT =====

export const getProducts = async () => {
  if (useMockData) {
    // Return existing product catalog for demo
    const { productCatalog } = await import('../data/products');
    return { data: productCatalog, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('category');

    return { data, error };
  } catch (error) {
    console.error('Get products error:', error);
    return { data: [], error };
  }
};

export const updateProductStock = async (productId, inStock) => {
  if (useMockData) {
    console.log(`Mock: Updated product ${productId} stock to ${inStock}`);
    return { data: { id: productId, in_stock: inStock }, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .update({ in_stock: inStock })
      .eq('id', productId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Update product stock error:', error);
    return { data: null, error };
  }
};

// ===== REAL-TIME SUBSCRIPTIONS =====

export const subscribeToOrders = (userId, callback) => {
  if (useMockData) {
    // Mock real-time updates with polling
    const interval = setInterval(() => {
      const orders = JSON.parse(localStorage.getItem('drogo_orders') || '[]');
      const userOrders = orders.filter(order => order.user_id === userId);
      callback(userOrders);
    }, 2000);

    return () => clearInterval(interval);
  }

  if (!supabase) return () => {};

  const channel = supabase
    .channel('orders')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'orders',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log('Order update:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToProducts = (callback) => {
  if (useMockData) {
    // Mock real-time product updates
    const interval = setInterval(() => {
      // Simulate occasional stock updates
      if (Math.random() > 0.95) {
        callback({ type: 'stock_update', productId: 'almonds-500g', inStock: Math.random() > 0.5 });
      }
    }, 5000);

    return () => clearInterval(interval);
  }

  if (!supabase) return () => {};

  const channel = supabase
    .channel('products')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'products' },
      (payload) => {
        console.log('Product update:', payload);
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// ===== ADMIN FUNCTIONS =====

export const getAllOrders = async () => {
  if (useMockData) {
    const orders = JSON.parse(localStorage.getItem('drogo_orders') || '[]');
    return { data: orders, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    console.error('Get all orders error:', error);
    return { data: [], error };
  }
};

export const getOrderAnalytics = async () => {
  if (useMockData) {
    const orders = JSON.parse(localStorage.getItem('drogo_orders') || '[]');
    return {
      data: {
        total_orders: orders.length,
        pending_orders: orders.filter(o => o.status === 'confirmed').length,
        completed_orders: orders.filter(o => o.status === 'delivered').length,
        total_revenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)
      },
      error: null
    };
  }

  try {
    const { data, error } = await supabase
      .rpc('get_order_analytics');

    return { data, error };
  } catch (error) {
    console.error('Get order analytics error:', error);
    return { data: null, error };
  }
};
