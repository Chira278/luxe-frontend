import React, { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={imageError ? 'https://via.placeholder.com/300?text=Product+Image' : product.image} 
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-price">${product.price}</div>
        <button className="add-to-cart" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
