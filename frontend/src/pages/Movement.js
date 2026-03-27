import React, { useEffect, useMemo, useState } from "react";
import { getMovements, moveItem, subscribeStore } from "./warehouseStore";
import { fetchActiveItems } from "../api/items";

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
  const [form, setForm] = useState({ cikk_szam: "", mennyiseg: "", from: "", to: "", megjegyzes: "" });
  const [uzenet, setUzenet] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const list = await fetchActiveItems();
        if (!mounted) return;
        setItems(list || []);
      } catch (e) {
        console.error("Error loading items for movement", e);
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

  function handleSubmit(e) {
    e.preventDefault();
    try {
      moveItem(form);
      setUzenet("A raktármozgás rögzítve.");
      setForm({ cikk_szam: "", mennyiseg: "", from: "", to: "", megjegyzes: "" });
    } catch (error) {
      setUzenet(`Hiba: ${error.message}`);
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
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Példa: válassz terméket</option>
            {items.map(it => (
              <option key={it.cikk_szam} value={it.cikk_szam}>{it.elnevezes}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Mennyiség</label>
          <input
            className="form-control"
            type="number"
            min="1"
            placeholder="Példa: 10"
            value={form.mennyiseg}
            onChange={(e) => setForm((prev) => ({ ...prev, mennyiseg: e.target.value }))}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Honnan</label>
          <input
            className="form-control"
            value={form.from}
            onChange={(e) => setForm((prev) => ({ ...prev, from: e.target.value }))}
            placeholder="Példa: A-01-03"
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Hova</label>
          <input
            className="form-control"
            value={form.to}
            onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value }))}
            placeholder="Példa: B-02-01"
            required
          />
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

      {uzenet && <div className="alert alert-info">{uzenet}</div>}

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
              <th>Mennyiség</th>
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
                <td>{r.mennyiseg}</td>
                <td>{r.from}</td>
                <td>{r.to}</td>
                <td>{r.user}</td>
                <td>{r.megjegyzes || "-"}</td>
              </tr>
            ))}
            {!filteredRows.length && (
              <tr>
                <td colSpan={9} className="text-center text-muted">
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
