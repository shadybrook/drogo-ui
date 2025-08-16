import React from 'react';
import { useCart } from '../contexts/CartContext';
import { formatCurrency, calculateSavings } from '../data/products';
import { toast } from 'react-toastify';

const ProductGrid = ({ products }) => {
  const { 
    addToCart, 
    increaseQuantity, 
    decreaseQuantity, 
    getItemQuantity, 
    isItemInCart 
  } = useCart();

  const handleAddToCart = (productId) => {
    addToCart(productId);
  };

  const handleIncreaseQuantity = (productId) => {
    increaseQuantity(productId);
  };

  const handleDecreaseQuantity = (productId) => {
    decreaseQuantity(productId);
  };

  const showProductDetails = (product) => {
    toast.info(`${product.name}: ${product.description}`, {
      autoClose: 4000
    });
  };

  if (products.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 16px',
        color: 'var(--muted)'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔍</div>
        <h3>No products found</h3>
        <p>Try adjusting your search or browse other categories</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => {
        const savings = calculateSavings(product.originalPrice, product.price);
        const quantity = getItemQuantity(product.id);
        const inCart = isItemInCart(product.id);
        
        return (
          <div key={product.id} className="product-card fade-in-up">
            <div className="product-image">
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div className="product-tag">{product.tag}</div>
            </div>
            
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <p className="body-sm" style={{ color: 'var(--muted)', margin: '0 0 8px 0' }}>
                {product.description}
              </p>
              
              <div className="price-container">
                <span className="current-price">{formatCurrency(product.price)}</span>
                <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                <span className="savings">Save {formatCurrency(savings)}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '12px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ color: '#f59e0b' }}>⭐</span>
                  <span className="caption" style={{ color: 'var(--muted)' }}>
                    {product.rating}
                  </span>
                </div>
                <div className="caption" style={{ color: 'var(--muted)' }}>
                  🚁 {product.deliveryTime}
                </div>
              </div>
              
              <div className="product-actions">
                {inCart ? (
                  <div className="quantity-controls" style={{ flex: 1 }}>
                    <button 
                      className="qty-btn" 
                      onClick={() => handleDecreaseQuantity(product.id)}
                    >
                      −
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button 
                      className="qty-btn" 
                      onClick={() => handleIncreaseQuantity(product.id)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                )}
                
                <button 
                  className="btn btn-secondary" 
                  onClick={() => showProductDetails(product)}
                  style={{ width: '40px', padding: '12px' }}
                  title="Product Details"
                >
                  ℹ️
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
