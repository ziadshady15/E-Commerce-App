import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [cartCount, setCartCount] = useState(0);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
      setCartCount(0);
    }
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data);
      setCartCount(data.items ? data.items.length : 0);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      setCart(data);
      setCartCount(data.items ? data.items.length : 0);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.cart || { items: [], totalPrice: 0 });
      setCartCount(data.cart?.items ? data.cart.items.length : 0);
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const clearCart = async () => {
    try {
      await fetch(`${API_URL}/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({ items: [], totalPrice: 0 });
      setCartCount(0);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}

export { CartProvider, useCart };
