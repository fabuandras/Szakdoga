import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { myAxios } from "../api/axios";
import { fetchActiveItems } from "../api/items";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError("");
      const list = await fetchActiveItems();
      setItems(list);
    } catch (e) {
      if (e?.response?.status === 401) {
        setError("A terméklista megtekintéséhez be kell jelentkezni.");
      } else {
        setError("A terméklista betöltése sikertelen.");
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const getCat = (it) => {
      if (!it) return '';
      return it.kategoria ?? it.category ?? it.kategori ?? it.cat ?? it.category_name ?? '';
    };

    const set = new Set();
    set.add('mind');
    items.forEach((it) => {
      const c = getCat(it) || 'Egyéb';
      set.add(c);
    });

    // keep 'mind' first, sort the rest
    const arr = Array.from(set);
    const rest = arr.filter(a => a !== 'mind').sort((a,b) => String(a).localeCompare(String(b), undefined, {sensitivity: 'base'}));
    return ['mind', ...rest];
  }, [items]);

  // helper: safely stringify values for search/comparison
  const safeString = (v) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "object") {
      try {
        return JSON.stringify(v);
      } catch (e) {
        return String(v);
      }
    }
    return String(v);
  };

  // Filter based on local items state, search q, category and status
  const filtered = useMemo(() => {
    const query = safeString(q).trim().toLowerCase();
    return items.filter((it) => {
      // category filter
      if (category !== "mind" && (it.kategoria || "Egyéb") !== category) return false;

      // status filter
      if (status !== "mind" && stockState(it) !== status) return false;

      if (!query) return true;

      const fields = [it.elnevezes, it.name, it.cikk_szam, it.cikkszam, it.cikksz, it.egyseg_ar, it.kategoria];
      return fields.some((f) => safeString(f).toLowerCase().includes(query));
    });
  }, [items, q, category, status]);

  // Sorting
  const sorted = useMemo(() => {
    const list = Array.isArray(filtered) ? [...filtered] : [];

    const compareStrings = (a, b) => safeString(a).localeCompare(safeString(b), undefined, { numeric: true, sensitivity: 'base' });

    try {
      if (sortBy === 'nev_asc') {
        list.sort((a, b) => compareStrings(a.elnevezes ?? a.name, b.elnevezes ?? b.name));
      } else if (sortBy === 'nev_desc') {
        list.sort((a, b) => compareStrings(b.elnevezes ?? b.name, a.elnevezes ?? a.name));
      } else if (sortBy === 'keszlet_desc') {
        list.sort((a, b) => Number(b.akt_keszlet || 0) - Number(a.akt_keszlet || 0));
      } else if (sortBy === 'keszlet_asc') {
        list.sort((a, b) => Number(a.akt_keszlet || 0) - Number(b.akt_keszlet || 0));
      }
    } catch (e) {
      console.warn('ProductsList sort error', e);
    }

    return list;
  }, [filtered, sortBy]);

  const handleDelete = async (sku) => {
    if (!window.confirm(`Biztosan törölni szeretnéd a ${sku} cikkszámú tételt?`))
      return;
    try {
      await myAxios.delete(`/api/items/${sku}`);
      // frissítsük a helyi listát
      setItems((prev) => prev.filter((item) => item.cikk_szam !== sku));
    } catch (e) {
      setError("A törlés sikertelen.");
    }
  };

  const handleAdd = async (newItem) => {
    try {
      const resp = await myAxios.post("/api/items", newItem);
      // hozzáadjuk a visszakapott tételt
      setItems((prev) => [resp.data, ...prev]);
    } catch (e) {
      console.error("Hozzáadás sikertelen", e);
      alert("A hozzáadás sikertelen volt. Ellenőrizd a backend elérhetőségét.");
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
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "mind" ? "Összes kategória" : cat}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="mind">Minden készletállapot</option>
            <option value="Rendben">Rendben</option>
            <option value="Alacsony">Alacsony</option>
            <option value="Nincs készleten">Nincs készleten</option>
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="nev_asc">Rendezés: Név (A-Z)</option>
            <option value="nev_desc">Rendezés: Név (Z-A)</option>
            <option value="keszlet_desc">Rendezés: Készlet csökkenő</option>
            <option value="keszlet_asc">Rendezés: Készlet növekvő</option>
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
            {sorted.map((it, idx) => (
              <tr key={it.cikk_szam || idx}>
                <td>{idx + 1}</td>
                <td>{it.elnevezes}</td>
                <td>{it.cikk_szam}</td>
                <td>{it.kategoria || "-"}</td>
                <td>{it.akt_keszlet}</td>
                <td>{it.min_keszlet || 0}</td>
                <td>
                  {stockState(it) === "Rendben" && (
                    <span className="badge text-bg-success">Rendben</span>
                  )}
                  {stockState(it) === "Alacsony" && (
                    <span className="badge text-bg-warning">Alacsony</span>
                  )}
                  {stockState(it) === "Nincs készleten" && (
                    <span className="badge text-bg-danger">Nincs</span>
                  )}
                </td>
                <td>{it.raktarhely || "-"}</td>
                <td>
                  <button
                    className="btn btn-outline-danger warehouse-btn"
                    onClick={() => handleDelete(it.cikk_szam)}
                  >
                    Törlés
                  </button>
                </td>
              </tr>
            ))}
            {!sorted.length && (
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
