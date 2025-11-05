import React from 'react';
import { useProducts } from '../hooks/useProducts';

function HomePage() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p>Error fetching products: {error}</p>;
  }

  return (
    <div>
      <h2>Products</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-card" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>
            <button>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;