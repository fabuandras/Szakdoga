import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myAxios } from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function Kosar() {
  const { user } = useContext(AuthContext);
  const { cart, fetchCart } = useCart();

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user, fetchCart]);

  const changeQty = async (itemId, qty) => {
    if (qty < 1) return;
    await myAxios.patch("/api/shop/cart/item", { item_id: itemId, qty });
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await myAxios.delete(`/api/shop/cart/item/${itemId}`);
    fetchCart();
  };

  if (!user) {
    return (
      <section className="page">
        <h1>Kosár</h1>
        <p>A kosár megtekintéséhez jelentkezz be.</p>
        <Link to="/login">Bejelentkezés</Link>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Kosár</h1>
      {cart.items.length === 0 ? (
        <p>A kosarad üres.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.item_id} style={{ marginBottom: "0.8rem" }}>
              <strong>{item.elnevezes}</strong> - {item.qty} db - {item.line_total.toLocaleString("hu-HU")} Ft
              <div>
                <button type="button" onClick={() => changeQty(item.item_id, item.qty - 1)}>-</button>
                <button type="button" onClick={() => changeQty(item.item_id, item.qty + 1)}>+</button>
                <button type="button" onClick={() => removeItem(item.item_id)}>Törlés</button>
              </div>
            </div>
          ))}
          <p>
            <strong>Végösszeg: {Number(cart.total || 0).toLocaleString("hu-HU")} Ft</strong>
          </p>
        </div>
      )}
    </section>
  );
}
