import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { myAxios } from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartCount, setCartCount] = useState(0);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [], total: 0 });
      setCartCount(0);
      return;
    }
    try {
      const response = await myAxios.get("/api/shop/cart");
      const cartData = response?.data || { items: [], total: 0 };
      setCart(cartData);
      const totalQty = cartData.items.reduce((sum, item) => sum + (item.qty || 0), 0);
      setCartCount(totalQty);
    } catch {
      setCart({ items: [], total: 0 });
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
