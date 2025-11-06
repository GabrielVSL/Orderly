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
      toast.success(`${response.data.product.name} added to cart!`);
      openCart();
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
      toast.success('Item removed from cart.');
    } catch (err) {
      setError(err.message);
      console.error('Failed to remove item from cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1)
      return removeFromCart(cartItemId); // If quantity is less than 1, remove the item
    if (newQuantity > 10) {
      toast.error('Quantity must be between 1 and 10.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // call API
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
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call the backend endpoint
      await api.post('/orders');
      
      // Clear the local cart
      setCartItems([]);
      toast.success('Order placed successfully!');
      
      // Navigate to the SUCCESS page
      navigate('/success');

    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
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
