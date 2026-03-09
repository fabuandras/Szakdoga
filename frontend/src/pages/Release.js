import React, { useEffect, useMemo, useState } from "react";
import { getItems, releaseItem, subscribeStore } from "./warehouseStore";

export default function Release() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ cikk_szam: "", mennyiseg: "", kiadasi_ok: "Rendelés", megjegyzes: "" });
  const [uzenet, setUzenet] = useState("");

  useEffect(() => {
    const load = () => setItems(getItems());
    load();
    return subscribeStore(load);
  }, []);

  const selectedItem = useMemo(() => items.find((it) => it.cikk_szam === form.cikk_szam), [items, form.cikk_szam]);

  function handleSubmit(e) {
    e.preventDefault();
    try {
      releaseItem(form);
      setUzenet("A kiadás rögzítve. A készlet és a mozgásnapló frissült.");
      setForm((prev) => ({ ...prev, mennyiseg: "", megjegyzes: "" }));
    } catch (error) {
      setUzenet(`Hiba: ${error.message}`);
    }
  }

  return (
    <div>
      <h2>Kiadás</h2>
      <form className="row g-3 warehouse-form" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label">Termék (cikkszám)</label>
          <select
            className="form-select"
            value={form.cikk_szam}
            onChange={(e) => setForm((prev) => ({ ...prev, cikk_szam: e.target.value }))}
            required
          >
            <option value="">Példa: válassz terméket</option>
            {items.map((it) => (
              <option key={it.cikk_szam} value={it.cikk_szam}>
                {it.cikk_szam} - {it.elnevezes}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Mennyiség</label>
          <input
            className="form-control"
            type="number"
            min="1"
            placeholder="Példa: 3"
            value={form.mennyiseg}
            onChange={(e) => setForm((prev) => ({ ...prev, mennyiseg: e.target.value }))}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Kiadási ok</label>
          <select
            className="form-select"
            value={form.kiadasi_ok}
            onChange={(e) => setForm((prev) => ({ ...prev, kiadasi_ok: e.target.value }))}
          >
            <option value="Rendelés">Rendelés</option>
            <option value="Selejtezés">Selejtezés</option>
            <option value="Mintacsomag">Mintacsomag</option>
            <option value="Kiszerelés">Kiszerelés</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Megjegyzés</label>
          <input
            className="form-control"
            placeholder="Példa: Rendelés #2026-187 kiszolgálása"
            value={form.megjegyzes}
            onChange={(e) => setForm((prev) => ({ ...prev, megjegyzes: e.target.value }))}
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary warehouse-btn" type="submit">
            Kiadás rögzítése
          </button>
        </div>
      </form>

      {selectedItem && (
        <div className="alert alert-secondary mt-3 warehouse-info">
          Aktuális készlet: <strong>{selectedItem.akt_keszlet}</strong> | Minimum: <strong>{selectedItem.min_keszlet || 0}</strong> | Raktárhely: <strong>{selectedItem.raktarhely || "-"}</strong>
        </div>
      )}

      {uzenet && <div className="alert alert-info mt-3">{uzenet}</div>}
    </div>
  );
}
