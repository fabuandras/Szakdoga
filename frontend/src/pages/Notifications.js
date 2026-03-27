import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Notifications() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const resp = await api.get('/api/notifications');
        if (!mounted) return;
        setRows(resp.data || []);
      } catch (e) {
        console.error('Hiba az értesítések lekérésekor', e);
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>Betöltés...</div>;

  return (
    <div className="notifications-page">
      <h2>Raktári műveleti napló</h2>
      <table className="table">
        <thead>
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
              <td>{new Date(r.created_at).toLocaleString()}</td>
              <td>{r.type}</td>
              <td>{r.item_name || r.item_id}</td>
              <td>{r.quantity ?? '-'}</td>
              <td>{r.user_name || r.user_id}</td>
              <td>{r.note || r.reason || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
