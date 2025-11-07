import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/api"; // API helper
import toast from 'react-hot-toast'; // Toast notifications

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

  const addToCart = async (productId) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Adding item...');

    try {
      const response = await api.post("/cart", {
        productId: productId,
        quantity: 1,
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
      
      toast.success(`${response.data.product.name} added to cart!`, { id: toastId });
      openCart();
    } catch (err) {
      setError(err.message);
      console.error("Failed to add item to cart:", err);
      toast.error('Oops! Could not add item. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Removing item...');

    try {
      await api.delete(`/cart/${cartItemId}`);

      setCartItems(prevItems => 
        prevItems.filter(item => item.id !== cartItemId)
      );
      toast.success('Item removed from cart.', { id: toastId });
    } catch (err) {
      setError(err.message);
      console.error('Failed to remove item from cart:', err);
      toast.error('Failed to remove item. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1)
      return removeFromCart(cartItemId); 
    if (newQuantity > 10) {
      toast.error('Quantity must be between 1 and 10.');
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
      
      toast.success(`Quantity updated.`);

    } catch (err) {
      setError(err.message);
      console.error('Failed to update quantity:', err);
      toast.error('Failed to update quantity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    setError(null);
    const toastId = toast.loading('Placing your order...');

    try {
      await api.post('/orders');
      setCartItems([]);
      
      toast.success('Order placed successfully!', { id: toastId });
      navigate('/success');

    } catch (err) {
      setError(err.message);
      toast.error('Error placing order. Please check your details and try again.', { id: toastId });
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

// hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};