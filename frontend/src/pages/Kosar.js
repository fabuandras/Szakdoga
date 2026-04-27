import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myAxios } from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import "./Kosar.css";


export default function Kosar() {
  const { user } = useContext(AuthContext);
  const { cart, fetchCart } = useCart();

  // Bankkártya adatok állapot
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  const [shippingCountry, setShippingCountry] = useState("Magyarország");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingArea, setShippingArea] = useState("");
  const [shippingPostalCode, setShippingPostalCode] = useState("");
  const [shippingHouseNumber, setShippingHouseNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Készpénz");
  const [couponCode, setCouponCode] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchCart();
  }, [user]);

  const changeQty = async (itemId, qty) => {
    if (qty < 1) return;
    await myAxios.patch("/api/shop/cart/item", { item_id: itemId, qty });
    fetchCart();
  };

  const removeItem = async (itemId) => {
    await myAxios.delete(`/api/shop/cart/item/${itemId}`);
    fetchCart();
  };

  const handleCheckout = async () => {
    setCheckoutMessage(null);
    setCheckoutError(null);

    if (!cart.items.length) {
      setCheckoutError("A kosarad üres, adj hozzá legalább egy terméket.");
      return;
    }

    if (!shippingCity.trim() || !shippingArea.trim() || !shippingPostalCode.trim() || !shippingHouseNumber) {
      setCheckoutError("Töltsd ki a szállítási adatokat.");
      return;
    }


    // Ha bankkártya a fizetési mód, ellenőrizzük a mezőket
    if (paymentMethod === "Bankkártya") {
      if (!cardNumber.trim() || !cardName.trim() || !cardExpiry.trim() || !cardCVC.trim()) {
        setCheckoutError("Töltsd ki a bankkártya adatokat.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        items: cart.items.map((item) => ({ item_id: Number(item.item_id), qty: Number(item.qty) })),
        shipping_country: shippingCountry,
        shipping_city: shippingCity,
        shipping_area: shippingArea,
        shipping_postal_code: shippingPostalCode,
        shipping_house_number: Number(shippingHouseNumber),
        payment_method: paymentMethod,
        coupon_code: couponCode,
        // Bankkártya adatok csak frontend validációhoz, backendnek nem küldjük
        // Ha szükséges, ide lehet tenni: card_number: cardNumber, stb.
      };

      const response = await myAxios.post("/api/shop/checkout", payload);
      setCheckoutMessage(response?.data?.message || "A rendelés sikeresen leadva.");
      setShippingCity("");
      setShippingArea("");
      setShippingPostalCode("");
      setShippingHouseNumber("");
      setCouponCode("");
      fetchCart();
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      setCheckoutError(backendMessage || "A rendelés leadása sikertelen.");
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="kosar-page">
      <div className="container">
        <h1 style={{ color: '#222222', textShadow: 'none' }}>Kosár</h1>

        {checkoutMessage && <div className="message-alert success-alert">{checkoutMessage}</div>}
        {checkoutError && <div className="message-alert error-alert">{checkoutError}</div>}

        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <p style={{ color: '#555555', opacity: 1 }}>A kosarad üres.</p>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {cart.items.map((item) => (
                <div key={item.item_id} className="cart-item-card">
                  <div className="cart-item-header">
                    <strong>{item.elnevezes}</strong>
                    <span>{item.qty} db</span>
                  </div>
                  <div className="cart-item-price">
                    {item.line_total.toLocaleString("hu-HU")} Ft
                  </div>
                  <div className="cart-item-actions">
                    <button type="button" onClick={() => changeQty(item.item_id, item.qty - 1)}>-</button>
                    <button type="button" onClick={() => changeQty(item.item_id, item.qty + 1)}>+</button>
                    <button type="button" onClick={() => removeItem(item.item_id)}>Törlés</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-card">
              <h2>Rendelés leadása</h2>
              <p className="checkout-summary">
                Végösszeg: <strong>{Number(cart.total || 0).toLocaleString("hu-HU")} Ft</strong>
              </p>

              <div className="checkout-section">
                <h3>Szállítási adatok</h3>
                <div className="field-row">
                  <label>Ország</label>
                  <input
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Város</label>
                  <input
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                  />
                </div>
                <div className="field-row">
                  <label>Utca / helység</label>
                  <input
                    value={shippingArea}
                    onChange={(e) => setShippingArea(e.target.value)}
                    placeholder="Utca és házszám például"
                  />
                </div>
                <div className="two-column-row">
                  <div className="field-row">
                    <label>Irányítószám</label>
                    <input
                      value={shippingPostalCode}
                      onChange={(e) => setShippingPostalCode(e.target.value)}
                      maxLength={4}
                    />
                  </div>
                  <div className="field-row">
                    <label>Házszám</label>
                    <input
                      type="number"
                      min="1"
                      value={shippingHouseNumber}
                      onChange={(e) => setShippingHouseNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="checkout-section">
                <h3>Fizetés</h3>
                <div className="field-row">
                  <label>Fizetési mód</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="Készpénz">Készpénz</option>
                    <option value="Bankkártya">Bankkártya</option>
                    <option value="Átutalás">Átutalás</option>
                  </select>
                </div>
                {paymentMethod === "Bankkártya" && (
                  <div className="card-fields">
                    <div className="field-row">
                      <label>Kártyaszám</label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value.replace(/[^0-9 ]/g, ""))}
                      />
                    </div>
                    <div className="field-row">
                      <label>Kártyabirtokos neve</label>
                      <input
                        type="text"
                        placeholder="Név a kártyán"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                      />
                    </div>
                    <div className="field-row" style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <label>Lejárat</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value.replace(/[^0-9/]/g, ""))}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label>CVC</label>
                        <input
                          type="text"
                          maxLength={4}
                          placeholder="CVC"
                          value={cardCVC}
                          onChange={e => setCardCVC(e.target.value.replace(/[^0-9]/g, ""))}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="field-row">
                  <label>Kupónkód (opcionális)</label>
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Kuponkód"
                  />
                </div>
              </div>

              <button
                type="button"
                className="place-order-btn"
                onClick={handleCheckout}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Rendelés leadása..." : "Rendelés leadása"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
