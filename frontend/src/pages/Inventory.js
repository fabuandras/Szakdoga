import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  closeInventory,
  createInventory,
  fetchInventoryDetail,
  fetchInventories,
  saveInventoryLine,
} from "../api/inventories";

const STATUS_LABELS = {
  open: "Megkezdett",
  closed: "Lezárt",
};

function formatDateTime(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("hu-HU");
}

function diffBadgeClass(diff) {
  if (diff > 0) return "text-bg-warning";
  if (diff < 0) return "text-bg-danger";
  return "text-bg-success";
}

export default function Inventory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [detail, setDetail] = useState({ inventory: null, lines: [] });
  const [inputs, setInputs] = useState({});
  const [uzenet, setUzenet] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingItemId, setSavingItemId] = useState(null);
  const [closing, setClosing] = useState(false);

  const loadSessions = useCallback(async (preferredId = null) => {
    setLoading(true);
    try {
      const list = await fetchInventories();
      setSessions(list);

      const open = list.find((it) => it.status === "open");
      const fallback = list[0] || null;
      const targetId = preferredId || selectedSessionId || open?.id || fallback?.id || null;
      setSelectedSessionId(targetId);
    } catch (error) {
      setUzenet("Hiba: a leltárfolyamatok betöltése sikertelen.");
      setSessions([]);
      setSelectedSessionId(null);
    } finally {
      setLoading(false);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (!selectedSessionId) {
      setDetail({ inventory: null, lines: [] });
      setInputs({});
      return;
    }

    let mounted = true;

    const loadDetail = async () => {
      try {
        const data = await fetchInventoryDetail(selectedSessionId);
        if (!mounted) return;
        const lines = Array.isArray(data?.lines) ? data.lines : [];
        setDetail({
          inventory: data?.inventory || null,
          lines,
        });

        const nextInputs = {};
        lines.forEach((line) => {
          const key = String(line.item_id);
          nextInputs[key] = {
            counted: line.counted_quantity ?? "",
            damaged: line.damaged_quantity ?? 0,
            note: line.note ?? "",
          };
        });
        setInputs(nextInputs);
      } catch (error) {
        if (!mounted) return;
        setUzenet("Hiba: a kiválasztott leltár részleteinek betöltése sikertelen.");
      }
    };

    loadDetail();

    return () => {
      mounted = false;
    };
  }, [selectedSessionId]);

  const activeSession = detail.inventory;
  const isOpenSession = activeSession?.status === "open";

  const onInput = (itemId, key, value) => {
    const k = String(itemId);
    setInputs((prev) => ({
      ...prev,
      [k]: {
        counted: prev[k]?.counted ?? "",
        damaged: prev[k]?.damaged ?? "",
        note: prev[k]?.note ?? "",
        [key]: value,
      },
    }));
  };

  const handleStart = async () => {
    try {
      const note = window.prompt("Leltár megjegyzés (opcionális):", "") || "";
      const response = await createInventory(note);
      const newId = response?.inventory?.id || null;
      setUzenet("A leltárfolyamat elindítva.");
      await loadSessions(newId);
    } catch (error) {
      const msg = error?.response?.data?.message || "A leltár indítása sikertelen.";
      setUzenet(`Hiba: ${msg}`);

      const existingId = error?.response?.data?.inventory_id;
      if (existingId) {
        setSelectedSessionId(existingId);
      }
    }
  };

  const handleSaveRow = async (line) => {
    if (!activeSession) {
      setUzenet("Hiba: nincs kiválasztott leltár.");
      return;
    }

    const row = inputs[String(line.item_id)] || {};
    if (row.counted === "" || row.counted === null || row.counted === undefined) {
      setUzenet("Hiba: add meg az elszámolt mennyiséget.");
      return;
    }

    try {
      setSavingItemId(line.item_id);
      
      // Inventori sor mentése
      await saveInventoryLine(activeSession.id, line.item_id, {
        counted_quantity: Number(row.counted),
        damaged_quantity: Number(row.damaged || 0),
        note: row.note || "",
      });

      const fresh = await fetchInventoryDetail(activeSession.id);
      const lines = Array.isArray(fresh?.lines) ? fresh.lines : [];
      setDetail({ inventory: fresh?.inventory || null, lines });
      setUzenet(`Leltársor rögzítve: ${line.item_sku || line.item_id}`);
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Leltársor mentése sikertelen.";
      setUzenet(`Hiba: ${msg}`);
    } finally {
      setSavingItemId(null);
    }
  };

  const handleClose = async () => {
    if (!activeSession) {
      return;
    }

    const ok = window.confirm("Biztosan le szeretnéd zárni a leltárt? Lezárás után már nem szerkeszthető.");
    if (!ok) return;

    try {
      setClosing(true);
      await closeInventory(activeSession.id);
      setUzenet("A leltár sikeresen lezárva.");
      await loadSessions(activeSession.id);
    } catch (error) {
      const msg = error?.response?.data?.message || "A leltár lezárása sikertelen.";
      setUzenet(`Hiba: ${msg}`);
    } finally {
      setClosing(false);
    }
  };

  const sortedLines = useMemo(() => {
    const lines = Array.isArray(detail.lines) ? [...detail.lines] : [];
    lines.sort((a, b) => String(a.item_name || "").localeCompare(String(b.item_name || ""), "hu"));
    return lines;
  }, [detail.lines]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Leltár</h2>
        <button className="btn btn-primary warehouse-btn" onClick={handleStart}>
          Leltár létrehozása
        </button>
      </div>

      {uzenet && <div className="alert alert-info">{uzenet}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Leltár előzmények</h5>
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Azonosító</th>
                  <th>Állapot</th>
                  <th>Indítás ideje</th>
                  <th>Lezárás ideje</th>
                  <th>Tételek</th>
                  <th>Összes eltérés</th>
                  <th>Művelet</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className={selectedSessionId === s.id ? "table-primary" : ""}>
                    <td>{s.code}</td>
                    <td>{STATUS_LABELS[s.status] || s.status}</td>
                    <td>{formatDateTime(s.started_at || s.created_at)}</td>
                    <td>{formatDateTime(s.closed_at)}</td>
                    <td>{s.lines_count}</td>
                    <td>{s.difference_total > 0 ? `+${s.difference_total}` : s.difference_total}</td>
                    <td>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSelectedSessionId(s.id)}
                      >
                        Megnyitás
                      </button>
                    </td>
                  </tr>
                ))}
                {!sessions.length && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      Még nincs létrehozott leltár.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {activeSession && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <strong>{activeSession.code}</strong>
            <span className="ms-2 badge text-bg-secondary">{STATUS_LABELS[activeSession.status] || activeSession.status}</span>
          </div>
          {isOpenSession && (
            <button className="btn btn-success warehouse-btn" onClick={handleClose} disabled={closing}>
              {closing ? "Lezárás..." : "Leltár lezárása"}
            </button>
          )}
        </div>
      )}

      <div className="table-responsive mb-4">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Cikkszám</th>
              <th>Termék</th>
              <th>Nyilvántartott készlet</th>
              <th>Számolt</th>
              <th>Sérült</th>
              <th>Eltérés</th>
              <th>Megjegyzés</th>
              <th>Művelet</th>
            </tr>
          </thead>
          <tbody>
            {sortedLines.map((line) => (
              <tr key={line.id}>
                <td>{line.item_sku || line.item_id}</td>
                <td>{line.item_name}</td>
                <td>{line.system_quantity}</td>
                <td style={{ minWidth: 120 }}>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    placeholder="Példa: 17"
                    value={inputs[String(line.item_id)]?.counted ?? ""}
                    onChange={(e) => onInput(line.item_id, "counted", e.target.value)}
                    disabled={!isOpenSession}
                  />
                </td>
                <td style={{ minWidth: 120 }}>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    placeholder="Példa: 1"
                    value={inputs[String(line.item_id)]?.damaged ?? ""}
                    onChange={(e) => onInput(line.item_id, "damaged", e.target.value)}
                    disabled={!isOpenSession}
                  />
                </td>
                <td>
                  <span className={`badge ${diffBadgeClass(Number(line.difference || 0))}`}>
                    {Number(line.difference || 0) > 0 ? `+${line.difference}` : Number(line.difference || 0)}
                  </span>
                </td>
                <td style={{ minWidth: 200 }}>
                  <input
                    className="form-control"
                    placeholder="Példa: sérült csomagolás"
                    value={inputs[String(line.item_id)]?.note ?? ""}
                    onChange={(e) => onInput(line.item_id, "note", e.target.value)}
                    disabled={!isOpenSession}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-outline-primary warehouse-btn"
                    onClick={() => handleSaveRow(line)}
                    disabled={!isOpenSession || savingItemId === line.item_id}
                  >
                    Rögzítés
                  </button>
                </td>
              </tr>
            ))}
            {!sortedLines.length && (
              <tr>
                <td colSpan={8} className="text-center text-muted">
                  Válassz egy leltárat az előzmény táblából, vagy hozz létre újat.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
