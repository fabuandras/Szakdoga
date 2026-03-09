import React, { useEffect, useState } from "react";
import { getItems, getMovements, recordInventory, startInventory, subscribeStore } from "./warehouseStore";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [inputs, setInputs] = useState({});
  const [uzenet, setUzenet] = useState("");

  useEffect(() => {
    const load = () => setItems(getItems());
    load();
    return subscribeStore(load);
  }, []);

  const onInput = (sku, key, value) => {
    setInputs((prev) => ({
      ...prev,
      [sku]: {
        counted: prev[sku]?.counted ?? "",
        damaged: prev[sku]?.damaged ?? "",
        note: prev[sku]?.note ?? "",
        [key]: value,
      },
    }));
  };

  const handleStart = () => {
    startInventory();
    setUzenet("A leltár elindítva. A folyamat bekerült a naplóba.");
  };

  const handleSaveRow = (sku) => {
    const row = inputs[sku] || {};
    try {
      recordInventory(sku, row.counted, row.damaged, row.note);
      setUzenet(`Leltáradat mentve: ${sku}`);
    } catch (error) {
      setUzenet(`Hiba: ${error.message}`);
    }
  };

  const lastInventoryEvents = getMovements().filter((m) => m.tipus === "leltar").slice(0, 6);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Leltár</h2>
        <button className="btn btn-primary warehouse-btn" onClick={handleStart}>
          Új leltár indítása
        </button>
      </div>

      {uzenet && <div className="alert alert-info">{uzenet}</div>}

      <div className="table-responsive mb-4">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Cikkszám</th>
              <th>Termék</th>
              <th>Aktuális készlet</th>
              <th>Elszámolt</th>
              <th>Sérült</th>
              <th>Megjegyzés</th>
              <th>Művelet</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.cikk_szam}>
                <td>{it.cikk_szam}</td>
                <td>{it.elnevezes}</td>
                <td>{it.akt_keszlet}</td>
                <td style={{ minWidth: 120 }}>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    placeholder="Példa: 17"
                    value={inputs[it.cikk_szam]?.counted ?? ""}
                    onChange={(e) => onInput(it.cikk_szam, "counted", e.target.value)}
                  />
                </td>
                <td style={{ minWidth: 120 }}>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    placeholder="Példa: 1"
                    value={inputs[it.cikk_szam]?.damaged ?? ""}
                    onChange={(e) => onInput(it.cikk_szam, "damaged", e.target.value)}
                  />
                </td>
                <td style={{ minWidth: 200 }}>
                  <input
                    className="form-control"
                    placeholder="Példa: sérült csomagolás"
                    value={inputs[it.cikk_szam]?.note ?? ""}
                    onChange={(e) => onInput(it.cikk_szam, "note", e.target.value)}
                  />
                </td>
                <td>
                  <button className="btn btn-outline-primary warehouse-btn" onClick={() => handleSaveRow(it.cikk_szam)}>
                    Rögzítés
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h5>Legutóbbi leltáresemények</h5>
      <ul className="list-group">
        {lastInventoryEvents.map((ev) => (
          <li key={ev.id} className="list-group-item d-flex justify-content-between">
            <span>
              {ev.cikk_szam} - {ev.termeknev} ({ev.megjegyzes || "-"})
            </span>
            <span>{new Date(ev.datum).toLocaleString("hu-HU")}</span>
          </li>
        ))}
        {!lastInventoryEvents.length && <li className="list-group-item text-muted">Nincs leltáresemény.</li>}
      </ul>
    </div>
  );
}
