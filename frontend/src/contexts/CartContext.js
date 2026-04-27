import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { myAxios } from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload.items, total: action.payload.total ?? 0 };
    case "ADD_ITEM": {
      // merge by item id if exists
      const exists = state.items.find((i) => i.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [state, dispatch] = useReducer(reducer, initialState);

  // load from localStorage initially
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        // support both old format (array) and new format ({ items, total })
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_CART", payload: { items: parsed, total: 0 } });
        } else {
          dispatch({ type: "SET_CART", payload: parsed });
        }
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify({ items: state.items, total: state.total }));
    } catch (e) {}
  }, [state.items, state.total]);

  const fetchCart = useCallback(async () => {
    if (!user) {
      dispatch({ type: "SET_CART", payload: { items: [], total: 0 } });
      return;
    }
    try {
      const response = await myAxios.get("/api/shop/cart");
      const cartData = response?.data || { items: [], total: 0 };
      dispatch({ type: "SET_CART", payload: { items: cartData.items ?? [], total: cartData.total ?? 0 } });
    } catch {
      dispatch({ type: "SET_CART", payload: { items: [], total: 0 } });
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  async function addToCart(item, quantity = 1) {
    const payload = { ...item, quantity };
    dispatch({ type: "ADD_ITEM", payload });

    try {
      await myAxios.post("/api/cart/add", {
        item_id: item.id || item.cikk_szam,
        quantity,
      });
    } catch (e) {
      console.warn("Cart sync failed", e?.response?.status);
    }
  }

  return (
    <CartContext.Provider value={{
      cart: { items: state.items, total: state.total },
      cartCount: state.items.length,
      fetchCart,
      addToCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

