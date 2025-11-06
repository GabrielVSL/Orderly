import React from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { Hero } from '../components/Hero'; 

function HomePage() {
  const { products, isLoading, error } = useProducts();
  if (isLoading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">Error fetching products: {error}</p>;
  }

  return (
    <div className="container mx-auto">
      
      <Hero />

      <section id="products" className="py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-gray-900">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-pink">Menu</span>
          </h2>
          <p className="text-xl text-brand-gray">
            Choose from our delicious selection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;