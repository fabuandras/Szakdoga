import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myAxios } from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Kosar() {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], total: 0 });

  const loadCart = () => {
    myAxios
      .get("/api/shop/cart")
      .then((response) => setCart(response.data || { items: [], total: 0 }))
      .catch(() => setCart({ items: [], total: 0 }));
  };

  useEffect(() => {
    if (!user) return;
    loadCart();
  }, [user]);

  const changeQty = async (itemId, qty) => {
    if (qty < 1) return;
    await myAxios.patch("/api/shop/cart/item", { item_id: itemId, qty });
    loadCart();
  };

  const removeItem = async (itemId) => {
    await myAxios.delete(`/api/shop/cart/item/${itemId}`);
    loadCart();
  };

  if (!user) {
    return (
      <section className="page">
        <h1>Kosar</h1>
        <p>A kosar megtekintesehez jelentkezz be.</p>
        <Link to="/login">Bejelentkezes</Link>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Kosar</h1>
      {cart.items.length === 0 ? (
        <p>A kosarad ures.</p>
      ) : (
        <div>
          {cart.items.map((item) => (
            <div key={item.item_id} style={{ marginBottom: "0.8rem" }}>
              <strong>{item.elnevezes}</strong> - {item.qty} db - {item.line_total.toLocaleString("hu-HU")} Ft
              <div>
                <button type="button" onClick={() => changeQty(item.item_id, item.qty - 1)}>-</button>
                <button type="button" onClick={() => changeQty(item.item_id, item.qty + 1)}>+</button>
                <button type="button" onClick={() => removeItem(item.item_id)}>Torles</button>
              </div>
            </div>
          ))}
          <p>
            <strong>Vegosszeg: {Number(cart.total || 0).toLocaleString("hu-HU")} Ft</strong>
          </p>
        </div>
      )}
    </section>
  );
}
