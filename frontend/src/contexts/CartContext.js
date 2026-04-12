import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { myAxios } from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const response = await myAxios.get("/api/shop/cart");
      const items = response?.data?.items || [];
      const totalQty = items.reduce((sum, item) => sum + (item.qty || 0), 0);
      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  }, [user]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
