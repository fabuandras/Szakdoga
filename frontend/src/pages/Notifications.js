import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';

const TYPE_LABELS = {
  create: 'Új termék felvétel',
  delete: 'Törlés',
  bevetelez: 'Bevételezés',
  update: 'Készlet módosítás',
  release: 'Kiadás',
  movement: 'Raktármozgás',
  rendeles: 'Rendelés',
  inventory_start: 'Leltár indítása',
  inventory_count: 'Leltár rögzítés',
  inventory_close: 'Leltár lezárás',
};

function muvelCimke(r) {
  if (r.type === 'release' && r.reason) return r.reason;
  return TYPE_LABELS[r.type] || r.type || '-';
}

export default function Notifications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const resp = await api.get('/api/notifications');
      setRows(resp.data || []);
    } catch (e) {
      console.error('Hiba az értesítések lekérésekor', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) return <div>Betöltés...</div>;

  return (
    <div className="notifications-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Raktári műveleti napló</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={load}>
          Frissítés
        </button>
      </div>
      {rows.length === 0 ? (
        <p className="text-muted">Még nincs rögzített műveleti napló.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th>Idő</th>
                <th>Művelet</th>
                <th>Termék</th>
                <th>Mennyiség</th>
                <th>Felhasználó</th>
                <th>Megjegyzés</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(r.created_at).toLocaleString('hu-HU')}
                  </td>
                  <td>{muvelCimke(r)}</td>
                  <td>
                    {r.item_name || (r.item_id ? `#${r.item_id}` : '-')}
                    {r.inventory_code ? <div className="small text-muted">{r.inventory_code}</div> : null}
                  </td>
                  <td>{r.quantity !== null && r.quantity !== undefined ? r.quantity : '-'}</td>
                  <td>{r.user_name || (r.user_id ? `#${r.user_id}` : '-')}</td>
                  <td>{r.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
