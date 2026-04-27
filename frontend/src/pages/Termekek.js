import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { fetchActiveItems } from '../api/items';
import { readFavoriteIds, toggleFavoriteId, writeFavoriteIds } from "../utils/favoriteStorage";
import "./Termekek.css";

function mapBackendProduct(row) {
  const itemId = Number(row.cikk_szam ?? row.id ?? 0);
  return {
    id: itemId,
    cikk_szam: itemId,
    name: row.name ?? row.elnevezes,
    price: Number(row.price ?? row.egyseg_ar ?? 0),
    image: row.image ?? row.kep_url ?? "",
    cardBackground: row.cardBackground ?? row.kartya_hatterszin ?? "#f7f7f7",
    cardStyle: row.cardStyle ?? row.kartya_stilus ?? "clean",
  };
}

export default function Termekek() {
    // Szűrés/rendezés állapotok
    const [sortBy, setSortBy] = useState('name_asc');
    const [filterText, setFilterText] = useState('');
  const { user } = useContext(AuthContext);
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [addingItemId, setAddingItemId] = useState(null);
  const [addedItemId, setAddedItemId] = useState(null);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setMessage(null);

    try {
      const list = await fetchActiveItems();
      setProducts((list || []).map(mapBackendProduct));
    } catch (error) {
      setProducts([]);
      setMessage("A termékek most nem érhetőek el. Próbáld újra pár másodperc múlva.");
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
      writeFavoriteIds(user, ids);
    } catch (error) {
      setFavorites(readFavoriteIds(user));
      if (error?.response?.status === 401) {
        setMessage(null);
      }
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
      return false;
    }

    // Optimistic local persistence so favorites always work for the user.
    const optimistic = toggleFavoriteId(user, itemId);
    setFavorites(optimistic);

    try {
      const response = await myAxios.post("/api/shop/favorites/toggle", { item_id: itemId });
      const ids = (response?.data?.favorites || []).map((id) => Number(id));
      setFavorites(ids);
      writeFavoriteIds(user, ids);
      return true;
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login");
        return false;
      }
      setMessage("A kedvencek helyileg frissítve lettek.");
      return true;
    }
  };

  const addToCart = async (itemId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const product = products.find((p) => Number(p.id) === Number(itemId));
    const item_id = product?.cikk_szam ?? itemId;

    setAddingItemId(itemId);
    setMessage(null);

    try {
      await myAxios.post("/api/shop/cart/add", { item_id, qty: 1 });
      setAddedItemId(itemId);
      setMessage("A termék a kosárba került.");
      fetchCart();
      setTimeout(() => setAddedItemId(null), 700);
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate("/login");
        return;
      }
      const backendMessage = error?.response?.data?.message;
      setMessage(
        backendMessage || "A kosár frissítése sikertelen."
      );
    } finally {
      setAddingItemId(null);
    }
  };

  return (
    <section className="page products-page">
      <div className="products-page-header">
        <h1>Termékek</h1>
        <p>Válassz a kézműves horgolós alapanyagokból és készletekből.</p>
        <div className="products-filter-sort">
          <input
            type="text"
            placeholder="Szűrés név alapján..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="products-filter-input"
          />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="products-sort-select">
            <option value="name_asc">Név szerint (A-Z)</option>
            <option value="name_desc">Név szerint (Z-A)</option>
            <option value="price_asc">Ár szerint növekvő</option>
            <option value="price_desc">Ár szerint csökkenő</option>
          </select>
        </div>
      </div>

      {loading && <p>Termékek betöltése...</p>}
      {!loading && message && <p className="products-message">{message}</p>}

      {!loading && (
        <div className="products-grid">
          {products
            .filter(product =>
              product.name?.toLowerCase().includes(filterText.toLowerCase())
            )
            .sort((a, b) => {
              if (sortBy === 'name_asc') return a.name.localeCompare(b.name, 'hu');
              if (sortBy === 'name_desc') return b.name.localeCompare(a.name, 'hu');
              if (sortBy === 'price_asc') return a.price - b.price;
              if (sortBy === 'price_desc') return b.price - a.price;
              return 0;
            })
            // csak egyedi név alapján jelenjenek meg a termékek
            .filter((product, index, self) =>
              index === self.findIndex((p) => p.name === product.name)
            )
            .map((product) => (
              <article
                key={product.id}
                className={`product-card product-style-${product.cardStyle}`}
              >


                <div className="product-image-wrap">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="product-image" />
                  ) : (
                    <div className="product-image-fallback">Nincs kép</div>
                  )}
                </div>

                <h3>{product.name}</h3>
                <p className="product-price">{Math.round(product.price).toLocaleString("hu-HU")} Ft</p>

                <button
                  type="button"
                  className={`product-cart-btn ${addedItemId === Number(product.id) ? "added" : ""}`}
                  onClick={() => addToCart(Number(product.id))}
                  disabled={addingItemId === Number(product.id)}
                >
                  {addingItemId === Number(product.id) ? "Hozzáadás..." : addedItemId === Number(product.id) ? "Hozzáadva!" : "Kosárba"}
                </button>

                <button
                  type="button"
                  className="product-fav-btn"
                  onClick={async () => {
                    const ok = await toggleFavorite(Number(product.id));
                    if (ok) {
                      navigate('/kedvencek');
                    }
                  }}
                  disabled={favoriteSet.has(Number(product.id))}
                >
                  {favoriteSet.has(Number(product.id)) ? "Már a kedvencek között" : "Hozzáadás a kedvencekhez"}
                </button>
              </article>
            ))}
        </div>
      )}
    </section>
  );
}
