import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { myAxios } from "../api/axios";

function stockState(item) {
  const qty = Number(item.akt_keszlet || 0);
  const min = Number(item.min_keszlet || 0);
  if (qty <= 0) return "Nincs készleten";
  if (qty <= min) return "Alacsony";
  return "Rendben";
}

export default function ProductsList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("mind");
  const [status, setStatus] = useState("mind");
  const [sortBy, setSortBy] = useState("nev_asc");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setError("");
      const response = await myAxios.get("/api/items");
      const mapped = (response.data || []).map((it) => ({
        cikk_szam: String(it.cikk_szam),
        elnevezes: it.elnevezes,
        kategoria: it.kategoria || "-",
        akt_keszlet: Number(it.akt_keszlet || 0),
        min_keszlet: Number(it.min_keszlet || 0),
        raktarhely: it.raktarhely || "-",
        kep_url: it.kep_url || "",
        egyseg_ar: Number(it.egyseg_ar || 0),
      }));
      setItems(mapped);
    } catch (e) {
      if (e?.response?.status === 401) {
        setError("A terméklista megtekintéséhez be kell jelentkezni.");
      } else {
        setError("A terméklista betöltése sikertelen.");
      }
      setItems([]);
    }
  };

  const categories = useMemo(() => {
    return ["mind", ...new Set(items.map((it) => it.kategoria || "Egyéb"))];
  }, [items]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const out = items.filter((it) => {
      const textMatch =
        !query ||
        (it.elnevezes || "").toLowerCase().includes(query) ||
        (it.cikk_szam || "").toLowerCase().includes(query);

      const categoryMatch = category === "mind" || (it.kategoria || "Egyéb") === category;

      const state = stockState(it);
      const statusMatch = status === "mind" || state === status;
      return textMatch && categoryMatch && statusMatch;
    });

    out.sort((a, b) => {
      if (sortBy === "nev_asc") return (a.elnevezes || "").localeCompare(b.elnevezes || "");
      if (sortBy === "nev_desc") return (b.elnevezes || "").localeCompare(a.elnevezes || "");
      if (sortBy === "keszlet_asc") return Number(a.akt_keszlet || 0) - Number(b.akt_keszlet || 0);
      if (sortBy === "keszlet_desc") return Number(b.akt_keszlet || 0) - Number(a.akt_keszlet || 0);
      return (a.cikk_szam || "").localeCompare(b.cikk_szam || "");
    });

    return out;
  }, [items, q, category, status, sortBy]);

  const handleDelete = async (sku) => {
    if (!window.confirm(`Biztosan törölni szeretnéd a ${sku} cikkszámú tételt?`)) return;
    try {
      await myAxios.delete(`/api/items/${sku}`);
      await loadItems();
    } catch (e) {
      setError("A törlés sikertelen.");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Terméklista</h2>
        <Link className="btn btn-primary warehouse-btn" to="/warehouse/intake">
          Új tétel felvétele
        </Link>
      </div>

      <div className="row g-2 mb-3 warehouse-filter">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Példa: menta fonal vagy FON-001"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "mind" ? "Összes kategória" : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="mind">Minden készletállapot</option>
            <option value="Rendben">Rendben</option>
            <option value="Alacsony">Alacsony</option>
            <option value="Nincs készleten">Nincs készleten</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="nev_asc">Rendezés: Név (A-Z)</option>
            <option value="nev_desc">Rendezés: Név (Z-A)</option>
            <option value="keszlet_desc">Rendezés: Készlet csökkenő</option>
            <option value="keszlet_asc">Rendezés: Készlet növekvő</option>
            <option value="cikk">Rendezés: Cikkszám</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Terméknév</th>
              <th>Cikkszám</th>
              <th>Kategória</th>
              <th>Készlet</th>
              <th>Min.</th>
              <th>Állapot</th>
              <th>Raktárhely</th>
              <th>Művelet</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((it, idx) => (
              <tr key={it.cikk_szam || idx}>
                <td>{idx + 1}</td>
                <td>{it.elnevezes}</td>
                <td>{it.cikk_szam}</td>
                <td>{it.kategoria || "-"}</td>
                <td>{it.akt_keszlet}</td>
                <td>{it.min_keszlet || 0}</td>
                <td>
                  {stockState(it) === "Rendben" && <span className="badge text-bg-success">Rendben</span>}
                  {stockState(it) === "Alacsony" && <span className="badge text-bg-warning">Alacsony</span>}
                  {stockState(it) === "Nincs készleten" && <span className="badge text-bg-danger">Nincs</span>}
                </td>
                <td>{it.raktarhely || "-"}</td>
                <td>
                  <button className="btn btn-outline-danger warehouse-btn" onClick={() => handleDelete(it.cikk_szam)}>
                    Törlés
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={9} className="text-center text-muted">
                  Nincs találat a megadott feltételekre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
