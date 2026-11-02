import { useState, useEffect } from 'react';
import api from '../services/api';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category, search } = filters;

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {};
        if (category && category !== 'todos' && category !== 'all') {
          params.category = category;
        }
        if (search && search.trim()) {
          params.search = search.trim();
        }

        const response = await api.get('/products', { params });
        if (isMounted) {
          setProducts(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || 'Erro ao carregar cardápio.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [category, search]);

  return { products, isLoading, error };
};

export default useProducts;
