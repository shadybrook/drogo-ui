import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { useLocation } from '../contexts/LocationContext';
import { productCatalog, formatCurrency } from '../data/products';
import { toast } from 'react-toastify';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { placeOrder } = useOrders();
  const { selectedAddress, selectedDeliverySpot, terraceAccessible } = useLocation();
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    openCart,
    increaseQuantity, 
    decreaseQuantity, 
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalItems 
  } = useCart();

  const cartTotal = getCartTotal(productCatalog);
  const totalItems = getTotalItems();

  const handleCheckout = async () => {
    if (totalItems === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    // Debug logging to help identify the issue
    console.log('Checkout validation:', {
      selectedAddress,
      selectedDeliverySpot,
      totalItems,
      cartTotal: cartTotal.total
    });

    if (!selectedAddress || !selectedDeliverySpot) {
      console.error('Checkout failed - missing:', {
        address: !!selectedAddress,
        deliverySpot: !!selectedDeliverySpot
      });
      
      if (!selectedAddress) {
        toast.error('Please select a delivery address first! Go to the landing page to set your address.');
      } else if (!selectedDeliverySpot) {
        toast.error('Please select a delivery spot from the map! Go to the landing page to choose a spot.');
      } else {
        toast.error('Please select delivery address and spot first!');
      }
      
      closeCart();
      navigate('/');
      return;
    }

    // Prepare order data
    const orderData = {
      total: cartTotal.total,
      address: selectedAddress,
      deliverySpot: selectedDeliverySpot,
      terraceAccessible: terraceAccessible,
      items: Object.entries(cartItems).map(([productId, quantity]) => {
        const product = productCatalog.find(p => p.id === productId);
        return {
          product_id: productId,
          name: product?.name || 'Unknown Product',
          quantity: quantity,
          price: product?.price || 0,
          total: (product?.price || 0) * quantity
        };
      })
    };

    // Place order through OrderContext
    const result = await placeOrder(orderData);
    
    if (result.success) {
      // Clear cart and navigate to orders
      clearCart();
      closeCart();
      navigate('/orders');
    }
  };

  const handleDecreaseQuantity = (productId) => {
    // Removed notification - visual feedback of item disappearing is sufficient
    // const currentQty = cartItems[productId] || 0;
    // if (currentQty <= 1) {
    //   toast.info('Item removed from cart', { autoClose: 2000 });
    // }
    decreaseQuantity(productId);
  };

  const handleExplicitRemove = (productId) => {
    removeFromCart(productId);
    // Removed notification - visual feedback of item disappearing is sufficient
    // toast.info('Item removed from cart', { autoClose: 2000 });
  };

  const renderCartItems = () => {
    const cartEntries = Object.entries(cartItems);
    
    if (cartEntries.length === 0) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: 'var(--muted)' 
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some items to get started</p>
        </div>
      );
    }

    return cartEntries.map(([productId, quantity]) => {
      const product = productCatalog.find(p => p.id === productId);
      if (!product) return null;
      
      return (
        <div key={productId} className="cart-item">
          <img 
            src={product.image} 
            alt={product.name} 
            className="item-image" 
          />
          <div className="item-details">
            <h4>{product.name}</h4>
            <p className="item-price">{formatCurrency(product.price)} each</p>
            <div style={{ 
              fontSize: '0.75rem', 
              color: 'var(--muted)', 
              marginTop: '4px' 
            }}>
              Total: {formatCurrency(product.price * quantity)}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="quantity-controls">
              <button 
                className="qty-btn" 
                onClick={() => handleDecreaseQuantity(productId)}
              >
                −
              </button>
              <span className="qty-display">{quantity}</span>
              <button 
                className="qty-btn" 
                onClick={() => increaseQuantity(productId)}
              >
                +
              </button>
            </div>
            <button
              style={{
                background: 'var(--danger)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
              onClick={() => handleExplicitRemove(productId)}
              title="Remove item"
            >
              🗑️ Remove
            </button>
          </div>
        </div>
      );
    }).filter(Boolean);
  };

  // Floating Cart Pill
  const CartPill = () => {
    if (totalItems === 0) return null;

    return (
      <div className="cart-pill show" onClick={() => !isCartOpen && openCart()}>
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H4m2 8a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"/>
        </svg>
        <span>{totalItems} items • ₹{cartTotal.total}</span>
      </div>
    );
  };

  if (!isCartOpen) {
    return <CartPill />;
  }

  return (
    <>
      <CartPill />
      <div className="cart-drawer open">
        <div className="cart-backdrop" onClick={closeCart}></div>
        <div className="cart-sheet">
          <div className="cart-header">
            <h3 className="cart-title">Your Cart</h3>
            <button className="close-btn" onClick={closeCart}>✕</button>
          </div>
          
          <div className="cart-items">
            {renderCartItems()}
          </div>

          {totalItems > 0 && (
            <div className="bill-summary">
              <div className="bill-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formatCurrency(cartTotal.subtotal)}</span>
              </div>
              <div className="bill-row">
                <span>Drone convenience fee</span>
                <span>{formatCurrency(cartTotal.convenienceFee)}</span>
              </div>
              <div className="bill-row">
                <span>Taxes</span>
                <span>{formatCurrency(cartTotal.tax)}</span>
              </div>
              <div className="bill-row" style={{ color: 'var(--success)' }}>
                <span>Delivery</span>
                <strong>FREE</strong>
              </div>
              <div className="bill-row bill-total">
                <span>Total</span>
                <span>{formatCurrency(cartTotal.total)}</span>
              </div>
              
              <button className="checkout-btn" onClick={handleCheckout}>
                🚁 Place Order • {formatCurrency(cartTotal.total)}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
