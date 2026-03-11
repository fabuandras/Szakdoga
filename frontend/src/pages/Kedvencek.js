import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { myAxios } from "../api/axios";
import { AuthContext } from "../contexts/AuthContext";

export default function Kedvencek() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    myAxios
      .get("/api/shop/favorites")
      .then((response) => setItems(response.data || []))
      .catch(() => setItems([]));
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
            <li key={item.cikk_szam}>{item.elnevezes}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
