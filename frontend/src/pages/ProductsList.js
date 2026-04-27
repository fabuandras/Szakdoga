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
  const [success, setSuccess] = useState("");
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
      setSuccess("");
      const list = await fetchActiveItems();
      setItems(list);
    } catch (e) {
      if (e?.response?.status === 401) {
        setError("A terméklista megtekintéséhez be kell jelentkezni.");
      } else {
        const backendMessage = e?.response?.data?.message;
        setError(backendMessage || "A terméklista betöltése sikertelen.");
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const requiredCategories = ["Fonalak", "Eszközök", "Kiegészítők", "Plüssök", "Horgolóminták", "Egyéb"];

    const getCat = (it) => {
      if (!it) return '';
      return it.kategoria ?? it.category ?? it.kategori ?? it.cat ?? it.category_name ?? '';
    };

    const set = new Set();
    set.add('mind');
    requiredCategories.forEach((c) => set.add(c));
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
      setError("");
      setSuccess("");
      await myAxios.delete(`/api/items/${sku}`);
      // frissítsük a helyi listát
      setItems((prev) => prev.filter((item) => item.cikk_szam !== sku));
      const msg = `A(z) ${sku} cikkszámú tétel sikeresen törölve.`;
      setSuccess(msg);
      alert(msg);
    } catch (e) {
      const backendMessage = e?.response?.data?.message;
      setError(backendMessage || "A törlés sikertelen.");
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

  // attach a persistent magnifier icon to the left of the product search input
  useEffect(() => {
    try {
      const input = document.querySelector('input[placeholder*="Példa"]');
      if (!input) return;

      // avoid double-wrapping
      if (input.closest('.search-input-wrapper')) return;

      // create wrapper and insert before the input
      const wrapper = document.createElement('div');
      wrapper.className = 'search-input-wrapper';
      // keep it block-level and full width so the input keeps its original size
      wrapper.style.display = 'block';
      wrapper.style.width = '100%';
      wrapper.style.position = 'relative';

      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      // ensure the input keeps full width inside the wrapper
      try { input.style.width = '100%'; input.style.boxSizing = 'border-box'; } catch (e) {}
      
      // create left-positioned icon
      const icon = document.createElement('span');
      icon.className = 'search-icon search-icon-left';
      icon.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM4 9.5A5.5 5.5 0 119.5 15 5.5 5.5 0 014 9.5z"/></svg>`;
      icon.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(icon);

      // ensure icon persists if input is replaced by reactive code
      const obs = new MutationObserver(() => {
        if (!wrapper.contains(icon)) wrapper.appendChild(icon);
        // if input gets re-rendered elsewhere, move it back into wrapper
        const newInput = document.querySelector('input[placeholder*="Példa"]');
        if (newInput && newInput !== input && !newInput.closest('.search-input-wrapper')) {
          wrapper.appendChild(newInput);
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });

      // cleanup on unmount
      return () => obs.disconnect();
    } catch (e) {
      console.error('search icon attach failed', e);
    }
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Terméklista</h2>
        <Link className="btn btn-primary warehouse-btn" to="/warehouse/intake">
          Új tétel felvétele
        </Link>
      </div>

      <div className="alert alert-secondary mb-3" role="note">
        <strong>Raktárhely kód magyarázat:</strong> egy raktárat használunk, a helyek
        <span> </span><code>R{"{sor}"}-O{"{oszlop}"}-P{"{polc}"}</code><span> </span>
        formátumban jelennek meg (példa: <code>R2-O03-P01</code>).<span> </span>
        A rendszer minden termékhez automatikusan kioszt egy logikus helyet, ha hiányzik.
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
        {success && <div className="alert alert-success">{success}</div>}
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
