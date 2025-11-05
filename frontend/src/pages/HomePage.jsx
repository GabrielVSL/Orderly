import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import Cart from '../components/Cart';

function HomePage() {
  const { products, isLoading, error } = useProducts();
  const { addToCart, isLoading: isCartLoading } = useCart(); // addToCart function

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error fetching products: {error}</p>;
  }

  return (
    <div>
      <Cart />
      <h2>Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>

            <button 
              onClick={() => addToCart(product.id)}
              disabled={isCartLoading}> {isCartLoading ? 'Adding...' : 'Add to Cart'}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;