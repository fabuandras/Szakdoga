import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios, publicAxios } from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import "./Termekek.css";

function mapBackendProduct(row) {
  return {
    id: row.id ?? row.cikk_szam,
    name: row.name ?? row.elnevezes,
    price: Number(row.price ?? row.egyseg_ar ?? 0),
    image: row.image ?? row.kep_url ?? "",
    cardBackground: row.cardBackground ?? row.kartya_hatterszin ?? "#f7f7f7",
    cardStyle: row.cardStyle ?? row.kartya_stilus ?? "clean",
  };
}

export default function Termekek() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await publicAxios.get("/api/products");
      const mapped = (response?.data || []).map(mapBackendProduct);
      setProducts(mapped);
      return;
    } catch (publicError) {
      try {
        const webFallback = await publicAxios.get("/products-public");
        const mapped = (webFallback?.data || []).map(mapBackendProduct);
        setProducts(mapped);
        return;
      } catch (webFallbackError) {
        setProducts([]);
        setMessage("A termékek most nem érhetőek el. Próbáld újra pár másodperc múlva.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      const response = await myAxios.get("/api/shop/favorites");
      const ids = (response?.data || []).map((item) => Number(item.cikk_szam ?? item.id));
      setFavorites(ids);
    } catch (error) {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = async (itemId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await myAxios.post("/api/shop/favorites/toggle", { item_id: itemId });
      const ids = (response?.data?.favorites || []).map((id) => Number(id));
      setFavorites(ids);
    } catch (error) {
      setMessage("A kedvencek frissítése sikertelen.");
    }
  };

  const addToCart = async (itemId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await myAxios.post("/api/shop/cart/add", { item_id: itemId, qty: 1 });
      setMessage("A termék a kosárba került.");
    } catch (error) {
      setMessage("A kosár frissítése sikertelen.");
    }
  };

  return (
    <section className="page products-page">
      <div className="products-page-header">
        <h1>Termékek</h1>
        <p>Válassz a kézműves horgolós alapanyagokból és készletekből.</p>
      </div>

      {loading && <p>Termékek betöltése...</p>}
      {!loading && message && <p className="products-message">{message}</p>}

      {!loading && (
        <div className="products-grid">
          {products.map((product) => (
            <article
              key={product.id}
              className={`product-card product-style-${product.cardStyle}`}
              style={{ background: product.cardBackground || "#f8f8f8" }}
            >
              <button
                type="button"
                className={`favorite-btn ${favoriteSet.has(Number(product.id)) ? "active" : ""}`}
                onClick={() => toggleFavorite(Number(product.id))}
                aria-label="Kedvenc termék"
              >
                <i className="bi bi-heart-fill"></i>
              </button>

              <div className="product-image-wrap">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="product-image" />
                ) : (
                  <div className="product-image-fallback">Nincs kép</div>
                )}
              </div>

              <h3>{product.name}</h3>
              <p className="product-price">{product.price.toLocaleString("hu-HU")} Ft</p>

              <button
                type="button"
                className="product-cart-btn"
                onClick={() => addToCart(Number(product.id))}
              >
                Kosárba
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
