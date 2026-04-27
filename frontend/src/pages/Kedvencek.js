import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myAxios } from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";
import { fetchActiveItems } from "../api/items";
import { readFavoriteIds, writeFavoriteIds } from "../utils/favoriteStorage";

export default function Kedvencek() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    myAxios
      .get("/api/shop/favorites")
      .then((response) => {
        const serverItems = response.data || [];
        const ids = serverItems.map((item) => Number(item.cikk_szam ?? item.id));
        writeFavoriteIds(user, ids);
        setItems(serverItems);
      })
      .catch(async () => {
        const localIds = readFavoriteIds(user);
        if (localIds.length === 0) {
          setItems([]);
          return;
        }

        try {
          const allItems = await fetchActiveItems();
          const filtered = (allItems || []).filter((row) =>
            localIds.includes(Number(row.cikk_szam ?? row.id))
          );
          setItems(filtered);
        } catch (_error) {
          setItems([]);
        }
      });
  }, [user]);

  if (!user) {
    return (
      <section className="page">
        <h1>Kedvencek</h1>
        <p>A kedvencek megtekintéséhez jelentkezz be.</p>
        <Link to="/login">Bejelentkezés</Link>
      </section>
    );
  }

  return (
    <section className="page">
      <h1>Kedvencek</h1>
      {items.length === 0 ? (
        <p>Még nincs kedvenc terméked.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.cikk_szam || item.id}>{item.elnevezes || item.name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
