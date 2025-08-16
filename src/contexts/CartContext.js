import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useOrders } from './OrderContext'; // Unused import removed
// import { toast } from 'react-toastify'; // Removed - not used after removing notifications

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('drogo_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setCartItems(cartData);
      } catch (error) {
        console.error('Error parsing saved cart data:', error);
        localStorage.removeItem('drogo_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('drogo_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (productId, quantity = 1) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity
    }));
    
    // Removed notification - not critical for user experience
    // toast.success('Item added to cart! 🛒', {
    //   autoClose: 2000
    // });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const increaseQuantity = (productId) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const decreaseQuantity = (productId) => {
    setCartItems(prev => {
      const currentQty = prev[productId] || 0;
      if (currentQty <= 1) {
        const { [productId]: removed, ...rest } = prev;
        // Don't show notification here since removeFromCart will be called
        return rest;
      }
      return {
        ...prev,
        [productId]: currentQty - 1
      };
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const { [productId]: removed, ...rest } = prev;
      // Only show notification for explicit removals, not automatic ones
      return rest;
    });
  };

  const clearCart = () => {
    setCartItems({});
    // Removed notification - not critical, order success is more important
    // toast.info('Cart cleared', { autoClose: 2000 });
  };

  const getCartTotal = (productCatalog) => {
    let subtotal = 0;
    let totalItems = 0;
    
    Object.entries(cartItems).forEach(([productId, quantity]) => {
      const product = productCatalog.find(p => p.id === productId);
      if (product) {
        subtotal += product.price * quantity;
        totalItems += quantity;
      }
    });
    
    const convenienceFee = subtotal > 0 ? 19 : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + convenienceFee + tax;
    
    return {
      subtotal,
      convenienceFee,
      tax,
      total,
      totalItems
    };
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const isItemInCart = (productId) => {
    return cartItems[productId] > 0;
  };

  const getItemQuantity = (productId) => {
    return cartItems[productId] || 0;
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = {
    cartItems,
    isCartOpen,
    addToCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalItems,
    isItemInCart,
    getItemQuantity,
    openCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
