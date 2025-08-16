// Push Notification Service for DroGo

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notifications are blocked by user');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

// Show local notification
export const showNotification = (title, options = {}) => {
  if (Notification.permission !== 'granted') {
    console.warn('Notifications not permitted');
    return;
  }

  const defaultOptions = {
    icon: '/icon-192x192.png', // Add this icon to your public folder
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    tag: 'drogo-notification'
  };

  const notification = new Notification(title, {
    ...defaultOptions,
    ...options
  });

  // Auto-close after 5 seconds if not clicked
  setTimeout(() => {
    notification.close();
  }, 5000);

  return notification;
};

// Order status notifications
export const notifyOrderStatus = (status, orderDetails = {}) => {
  const notifications = {
    'confirmed': {
      title: '✅ Order Confirmed!',
      body: `Your order #${orderDetails.id?.slice(0, 8)} has been confirmed. Estimated delivery: ${orderDetails.eta || '10 minutes'}`,
      icon: '🚁'
    },
    'preparing': {
      title: '📦 Order Being Prepared',
      body: 'Your items are being packed with care. Drone dispatch soon!',
      icon: '📦'
    },
    'dispatched': {
      title: '🚁 Drone Dispatched!',
      body: `Your order is on its way! Track your delivery in the app.`,
      icon: '🚁'
    },
    'in_transit': {
      title: '✈️ Almost There!',
      body: 'Your drone is approaching the delivery location.',
      icon: '✈️'
    },
    'delivered': {
      title: '📦 Order Delivered!',
      body: 'Your order has been delivered successfully. Enjoy your items!',
      icon: '🎉'
    }
  };

  const notification = notifications[status];
  if (notification) {
    showNotification(notification.title, {
      body: notification.body,
      data: { orderId: orderDetails.id, status }
    });
  }
};

// Inventory notifications (for admins)
export const notifyLowStock = (productName, stock) => {
  showNotification('⚠️ Low Stock Alert', {
    body: `${productName} is running low (${stock} left). Consider restocking.`,
    tag: 'stock-alert'
  });
};

// Service worker registration for push notifications
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

// Initialize push notifications
export const initializePushNotifications = async () => {
  const hasPermission = await requestNotificationPermission();
  if (hasPermission) {
    await registerServiceWorker();
    console.log('Push notifications initialized');
    return true;
  }
  return false;
};

// Mock push server (for demo)
export const subscribeToPushNotifications = async (userId) => {
  // In production, this would subscribe to a real push service
  console.log(`Subscribed to push notifications for user: ${userId}`);
  
  // Simulate receiving push notifications
  setTimeout(() => {
    showNotification('🎉 Welcome to DroGo!', {
      body: 'You\'ll receive live updates about your orders here.',
    });
  }, 2000);
};

// Browser notification click handler (only used in service worker context)
// export const handleNotificationClick = (event) => {
//   event.notification.close();
//   
//   const data = event.notification.data;
//   if (data?.orderId) {
//     // Focus the app window and navigate to orders
//     if (typeof clients !== 'undefined' && clients.openWindow) {
//       clients.openWindow('/orders');
//     }
//   }
// };
