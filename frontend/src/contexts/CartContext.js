import React, { createContext, useContext, useEffect, useReducer } from "react";
import { myAxios } from "../api/axios";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const initialState = {
  items: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload };
    case "ADD_ITEM":
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
        dispatch({ type: "SET_CART", payload: JSON.parse(raw) });
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state.items));
    } catch (e) {}
  }, [state.items]);

  const fetchCart = async () => {
    if (!user) {
      dispatch({ type: "SET_CART", payload: [] });
      return;
    }
    try {
      const response = await myAxios.get("/api/shop/cart");
      const cartData = response?.data || { items: [], total: 0 };
      dispatch({ type: "SET_CART", payload: cartData.items });
    } catch {
      dispatch({ type: "SET_CART", payload: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart, user]);

  async function addToCart(item, quantity = 1) {
    // item should have id (or cikk_szam) and price
    const payload = { ...item, quantity };

    // optimistic local update
    dispatch({ type: "ADD_ITEM", payload });

    // attempt to sync with backend cart endpoint
    try {
      await myAxios.post("/api/cart/add", {
        item_id: item.id || item.cikk_szam,
        quantity,
      });
    } catch (e) {
      // silent fail — keep local cart
      console.warn("Cart sync failed", e?.response?.status);
    }
  }

  return (
    <CartContext.Provider value={{ cart: state.items, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
