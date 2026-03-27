import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Notifications() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await api.get('/api/activity-log');
        if (!mounted) return;
        setLogs(resp.data || []);
      } catch (e) {
        console.error('Hiba az activity log lekérésekor', e);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Betöltés...</div>;

  return (
    <div className="activity-log-page">
      <h2>Értesítések / Műveletek</h2>
      {logs.length === 0 ? (
        <div>Nincsenek események.</div>
      ) : (
        <ul className="list-group">
          {logs.map(l => (
            <li key={l.id} className="list-group-item">
              <div><strong>{l.type}</strong> — {new Date(l.created_at).toLocaleString()}</div>
              <div>{l.item_name} ({l.item_id})</div>
              {l.quantity !== null && <div>Mennyiség: {l.quantity}</div>}
              {l.user_name && <div className="text-muted">Felhasználó: {l.user_name}</div>}
              {l.reason && <div>Ok: {l.reason}</div>}
              {l.note && <div>Megjegyzés: {l.note}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
