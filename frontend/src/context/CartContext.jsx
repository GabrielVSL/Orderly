import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/api"; // API helper

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const addToCart = async (productId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/cart", {
        productId: productId,
        quantity: 1, // For now, just add it as quantity 1
      });

      setCartItems((prevItems) => {
        const newItem = response.data;

        const existingItemIndex = prevItems.findIndex(
          (item) => item.id === newItem.id
        ); // verify
        // If it exists, update it
        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = newItem;
          return updatedItems;
          // otherwise, add it
        } else {
          return [...prevItems, newItem];
        }
      });
    } catch (err) {
      setError(err.message);
      console.error("Failed to add item to cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/cart/${cartItemId}`);

      setCartItems(prevItems => 
        prevItems.filter(item => item.id !== cartItemId)
      );

    } catch (err) {
      setError(err.message);
      console.error('Failed to remove item from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 10) {
      console.error("Invalid quantity.");
      return; 
    }

    setLoading(true);
    setError(null);
    try {
      // call API
      const response = await api.put(`/cart/${cartItemId}`, {
        quantity: newQuantity
      });

      setCartItems(prevItems => {
        const updatedItem = response.data;
        const existingItemIndex = prevItems.findIndex(item => item.id === updatedItem.id);

        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = updatedItem;
          return updatedItems;
        }
        return prevItems;
      });

    } catch (err) {
      setError(err.message);
      console.error('Failed to update quantity:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/orders');
      
      // Clear cart
      setCartItems([]);
      // Redirect to success page
      navigate('/success');

    } catch (err) {
      setError(err.message);
      console.error('Failed to checkout:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = { cartItems, addToCart, isLoading: loading, error, removeFromCart, updateQuantity, checkout };

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
