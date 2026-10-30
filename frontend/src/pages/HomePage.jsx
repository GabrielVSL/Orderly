import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import ProductCard from '../components/ProductCard';
import { Hero } from '../components/Hero';
import CategoryTabs from '../components/common/CategoryTabs';
import SearchBar from '../components/common/SearchBar';
import ProductSkeleton from '../components/common/ProductSkeleton';
import { FireIcon } from '@heroicons/react/24/solid';

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 350);

  const { products, isLoading, error } = useProducts({
    category: selectedCategory,
    search: debouncedSearch
  });

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen">
      <Hero />

      <section id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-brand-red text-xs font-black uppercase tracking-wider mb-2">
            <FireIcon className="w-4 h-4 text-brand-red" />
            Cardápio Oficial
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-brand-dark tracking-tight mb-2">
            Escolha seu <span className="text-brand-red">Smash & Combos</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto">
            Carne prensada com crostinha crocante, batata fininha sequinha e milkshakes batidos na hora.
          </p>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClearSearch}
        />

        {/* Category Tabs */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Error Feedback */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 p-6 rounded-2xl text-center my-8">
            <p className="font-bold text-lg mb-1">Ops! Erro ao carregar o cardápio.</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Products Grid / Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : products.length > 0 ? (
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full text-center py-16 bg-white/60 rounded-3xl border-2 border-dashed border-yellow-300 p-8">
              <span className="text-5xl mb-3 block">🍔🔍</span>
              <h3 className="text-xl font-bold text-brand-dark mb-1">
                Nenhum item encontrado
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Não encontramos produtos correspondentes ao filtro ou termo de busca.
              </p>
              <button
                onClick={() => { setSelectedCategory('todos'); setSearchTerm(''); }}
                className="px-5 py-2.5 bg-brand-yellow hover:bg-yellow-400 text-brand-dark font-bold text-sm rounded-full transition-colors cursor-pointer"
              >
                Limpar Filtros e Ver Cardápio Completo
              </button>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}

export default HomePage;
