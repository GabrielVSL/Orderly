import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import toast from 'react-hot-toast';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/cart");
        setCartItems(response.data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = async (productId, quantity = 1, openDrawer = true) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Adicionando à sacola...');

    try {
      const response = await api.post("/cart", {
        productId: productId,
        quantity: quantity,
      });

      setCartItems((prevItems) => {
        const newItem = response.data;
        const existingItemIndex = prevItems.findIndex(
          (item) => item.id === newItem.id
        );
        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = newItem;
          return updatedItems;
        } else {
          return [...prevItems, newItem];
        }
      });
      
      toast.success(`${response.data.product.name} adicionado!`, { id: toastId });
      if (openDrawer) {
        openCart();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Não foi possível adicionar o item. Tente novamente.';
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Removendo...');

    try {
      await api.delete(`/cart/${cartItemId}`);

      setCartItems(prevItems => 
        prevItems.filter(item => item.id !== cartItemId)
      );
      toast.success('Item removido da sacola.', { id: toastId });
    } catch (err) {
      setError(err.message);
      toast.error('Erro ao remover item.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(cartItemId); 
    if (newQuantity > 10) {
      toast.error('O limite é de 10 unidades por item.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/cart/${cartItemId}`, {
        quantity: newQuantity
      });

      const updatedItem = response.data;
      setCartItems(prevItems => (
        prevItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      ));
      
      toast.success(`Quantidade atualizada.`);

    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao atualizar quantidade.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (orderPayload) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Finalizando seu pedido...');

    try {
      const response = await api.post('/orders', orderPayload);
      const createdOrder = response.data.order;
      setCartItems([]);
      
      toast.success('Pedido realizado com sucesso!', { id: toastId });
      navigate('/success', { state: { order: createdOrder } });
      return createdOrder;

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erro ao processar pedido. Verifique os dados.';
      setError(msg);
      toast.error(msg, { id: toastId });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkout = () => {
    closeCart();
    navigate('/checkout');
  };

  const value = { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    checkout, 
    isLoading: loading, 
    error,
    isCartOpen,
    openCart,
    closeCart,
    placeOrder
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
