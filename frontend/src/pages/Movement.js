import React, { useEffect, useMemo, useState } from "react";
import { getMovements, moveItem, subscribeStore, syncItemsFromApi } from "./warehouseStore";
import { fetchActiveItems } from "../api/items";
import api from "../api/axios";

const STATIC_LOCATIONS = ["Átvétel", "Komissiózó", "Csomagolás"];
const RACK_ROWS = ["A", "B", "C", "D"];
const RACK_COLUMNS = 4;
const RACK_LEVELS = 8;

function createAllRackLocations() {
  const all = [];
  for (const row of RACK_ROWS) {
    for (let column = 1; column <= RACK_COLUMNS; column += 1) {
      for (let level = 1; level <= RACK_LEVELS; level += 1) {
        all.push(`${row}-${String(column).padStart(2, "0")}-${String(level).padStart(2, "0")}`);
      }
    }
  }
  return all;
}

const ALL_RACK_LOCATIONS = createAllRackLocations();

function formatDate(iso) {
  return new Date(iso).toLocaleString("hu-HU");
}

function tipusCimke(tipus) {
  if (tipus === "bevetelezes") return "Bevételezés";
  if (tipus === "kiadas") return "Kiadás";
  if (tipus === "mozgas") return "Raktármozgás";
  if (tipus === "leltar") return "Leltár";
  return tipus;
}

export default function Movement() {
  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([]);
  const [typeFilter, setTypeFilter] = useState("mind");
  const [form, setForm] = useState({ cikk_szam: "", from: "", to: "", megjegyzes: "" });
  const [uzenet, setUzenet] = useState("");
  const [uzenetTipus, setUzenetTipus] = useState("info");
  const [selectedProduct, setSelectedProduct] = useState("");

  const getItemKey = (it) => String(it?.cikk_szam ?? it?.id ?? "");

  const selectedItem = useMemo(() => {
    return items.find((it) => getItemKey(it) === String(selectedProduct)) || null;
  }, [items, selectedProduct]);

  const locationOptions = useMemo(() => {
    const selectedCurrent = String(selectedItem?.raktarhely || "").trim();
    const occupied = new Set();
    const knownLocations = new Set(STATIC_LOCATIONS);

    items.forEach((it) => {
      const loc = String(it?.raktarhely || "").trim();
      if (!loc) return;
      if (loc !== selectedCurrent) {
        occupied.add(loc);
      } else {
        knownLocations.add(loc);
      }
    });

    ALL_RACK_LOCATIONS.forEach((loc) => {
      if (!occupied.has(loc) || loc === selectedCurrent) {
        knownLocations.add(loc);
      }
    });

    return Array.from(knownLocations);
  }, [items, selectedItem]);

  const destinationOptions = useMemo(() => {
    const currentFrom = form.from || selectedItem?.raktarhely || "";
    return locationOptions.filter((loc) => loc !== currentFrom);
  }, [locationOptions, form.from, selectedItem]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const list = await fetchActiveItems();
        if (!mounted) return;
        setItems(list || []);
        syncItemsFromApi(list || []);
      } catch (e) {
        console.error("Error loading items for movement", e);
        if (!mounted) return;
        setUzenetTipus("error");
        setUzenet("Hiba: a terméklista betöltése sikertelen.");
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const load = () => {
      setRows(getMovements());
    };
    load();
    return subscribeStore(load);
  }, []);

  const filteredRows = useMemo(() => {
    if (typeFilter === "mind") return rows;
    return rows.filter((r) => r.tipus === typeFilter);
  }, [rows, typeFilter]);

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      cikk_szam: selectedProduct || form.cikk_szam,
      from: form.from || selectedItem?.raktarhely || "",
      to: form.to,
      megjegyzes: form.megjegyzes,
    };

    if (!payload.cikk_szam) {
      setUzenetTipus("error");
      setUzenet("Hiba: válassz terméket a mozgatáshoz.");
      return;
    }

    if (payload.from === payload.to) {
      setUzenetTipus("error");
      setUzenet("Hiba: a Honnan és Hova érték nem lehet azonos.");
      return;
    }

    try {
      await api.post(`/api/items/${payload.cikk_szam}/move`, {
        from: payload.from,
        to: payload.to,
        note: payload.megjegyzes,
      });

      const rawUser = localStorage.getItem("auth_user");
      const user = rawUser ? JSON.parse(rawUser) : null;
      const actor = user?.felhasznalonev || user?.name || user?.email || "raktaros";

      // Keep local demo movement table in sync when possible, but do not fail UI if local store differs.
      try {
        moveItem({
          ...payload,
          mennyiseg: Number(selectedItem?.akt_keszlet || 0),
          user: actor,
        });
      } catch (localError) {
        // Ignore local mirror mismatches: the backend move already succeeded.
      }

      setUzenetTipus("success");
      setUzenet("A raktármozgás rögzítve.");
      alert("A raktármozgás sikeres.");
      setForm({ cikk_szam: "", from: "", to: "", megjegyzes: "" });
      setSelectedProduct("");
    } catch (error) {
      setUzenetTipus("error");
      setUzenet(`Hiba: ${error?.response?.data?.message || error.message}`);
      alert(`A raktármozgás sikertelen: ${error?.response?.data?.message || error.message}`);
    }
  }

  return (
    <div className="movement-page">
      <h2>Raktármozgás</h2>

      <form className="row g-3 mb-4 warehouse-form" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label">Termék</label>
          <select
            className="form-select"
            value={selectedProduct}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedProduct(value);
              const selected = items.find((it) => getItemKey(it) === String(value));
              setForm((prev) => ({
                ...prev,
                cikk_szam: value,
                from: selected?.raktarhely || "",
                to: "",
              }));
            }}
          >
            <option value="">Példa: válassz terméket</option>
            {items.map(it => (
              <option key={getItemKey(it)} value={getItemKey(it)}>{it.elnevezes}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Honnan</label>
          <input
            className="form-control"
            value={form.from || selectedItem?.raktarhely || ""}
            readOnly
            placeholder="A termék aktuális raktárhelye"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hova</label>
          <select
            className="form-select"
            value={form.to}
            onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))}
            required
          >
            <option value="">Válassz cél helyet</option>
            {destinationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div className="col-md-8">
          <label className="form-label">Megjegyzés</label>
          <input
            className="form-control"
            placeholder="Példa: Komissiózási zónába áthelyezve"
            value={form.megjegyzes}
            onChange={(e) => setForm((prev) => ({ ...prev, megjegyzes: e.target.value }))}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary w-100 warehouse-btn" type="submit">
            Mozgás rögzítése
          </button>
        </div>
      </form>

      {uzenet && (
        <div className={`alert ${uzenetTipus === "error" ? "alert-danger" : uzenetTipus === "success" ? "alert-success" : "alert-info"}`}>
          {uzenet}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Raktári műveleti napló</h5>
        <select className="form-select warehouse-filter" style={{ maxWidth: 280 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="mind">Minden művelet</option>
          <option value="bevetelezes">Bevételezés</option>
          <option value="kiadas">Kiadás</option>
          <option value="mozgas">Raktármozgás</option>
          <option value="leltar">Leltár</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Dátum</th>
              <th>Típus</th>
              <th>Cikkszám</th>
              <th>Termék</th>
              <th>Honnan</th>
              <th>Hova</th>
              <th>Felhasználó</th>
              <th>Megjegyzés</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((r) => (
              <tr key={r.id}>
                <td>{formatDate(r.datum)}</td>
                <td>{tipusCimke(r.tipus)}</td>
                <td>{r.cikk_szam}</td>
                <td>{r.termeknev}</td>
                <td>{r.from}</td>
                <td>{r.to}</td>
                <td>{r.user}</td>
                <td>{r.megjegyzes || "-"}</td>
              </tr>
            ))}
            {!filteredRows.length && (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  Nincs megjeleníthető raktári művelet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
