import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getCart, updateQuantity, removeFromCart, clearCart } from "../cartUtils";

export default function Kosar() {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    function onCartUpdated(e) {
      const newCart = (e && e.detail && e.detail.cart) ? e.detail.cart : getCart();
      setCart(newCart);
    }
    window.addEventListener('cartUpdated', onCartUpdated);
    // also listen for storage events in case multiple tabs
    function onStorage(e) {
      if (e.key === 'szakdoga_cart_v1') setCart(getCart());
    }
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('cartUpdated', onCartUpdated);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleQtyChange = (product, qty) => {
    const pid = product.id ?? product._id ?? product.productId ?? product.sku ?? null;
    if (pid === null) return;
    updateQuantity(pid, Number(qty));
  };

  const handleRemove = (product) => {
    const pid = product.id ?? product._id ?? product.productId ?? product.sku ?? null;
    if (pid === null) return;
    removeFromCart(pid);
  };

  const handleClear = () => {
    clearCart();
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

  if (!cart || cart.length === 0) {
    return (
      <div className="kosar-empty">
        <h1>Kosár</h1>
        <p>A kosarad üres.</p>
      </div>
    );
  }

  const total = cart.reduce((sum, it) => {
    const price = it.product && (it.product.price ?? it.product.ar ?? 0);
    return sum + (Number(price) || 0) * (it.quantity || 0);
  }, 0);

  return (
    <div className="kosar-list">
      <h1>Kosár</h1>
      <button onClick={handleClear}>Kosár ürítése</button>
      <ul>
        {cart.map((it, idx) => (
          <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* thumbnail */}
            {(() => {
              const p = it.product || {};
              const imgSrc = p.image ?? p.imageUrl ?? p.photo ?? p.img ?? (p.images && p.images[0]) ?? p.thumbnail ?? null;
              return imgSrc ? (
                <div style={{ width: 72, height: 72, flex: '0 0 72px' }}>
                  <img
                    src={imgSrc}
                    alt={p.name ?? p.title ?? 'termék kép'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                  />
                </div>
              ) : <div style={{ width: 72, height: 72, flex: '0 0 72px' }} />;
            })()}

            <div style={{ flex: 1 }}>
              <strong>{it.product && (it.product.name ?? it.product.title ?? it.product.nev ?? 'Termék')}</strong>
              <div>{it.product && (it.product.description ?? it.product.leiras)}</div>
            </div>
            <div>
              <input type="number" min="0" value={it.quantity} onChange={(e) => handleQtyChange(it.product, e.target.value)} />
            </div>
            <div>
              <button onClick={() => handleRemove(it.product)}>Törlés</button>
            </div>
            <div>
              {(it.product && (it.product.price ?? it.product.ar)) || '-'}
            </div>
          </li>
        ))}
      </ul>
      <div>
        <strong>Összesen: {total} Ft</strong>
      </div>
    </div>
  );
}
