import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function ProductsList() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/api/items')
      .then(res => setItems(res.data || []))
      .catch(err => console.error(err));
  }, []);

  const filtered = items.filter(i => {
    if (!q) return true;
    return (i.elnevezes || '').toString().toLowerCase().includes(q.toLowerCase()) ||
      (i.cikk_szam || '').toString().includes(q);
  });

  return (
    <div>
      <h2>Terméklista</h2>
      <div style={{marginBottom:12}}>
        <input placeholder="Keresés név vagy cikk szám" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Termék név</th>
            <th>Cikkszám</th>
            <th>Készlet</th>
            <th>Státusz</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((it, idx) => (
            <tr key={it.cikk_szam || idx}>
              <td>{idx+1}</td>
              <td>{it.elnevezes}</td>
              <td>{it.cikk_szam}</td>
              <td>{it.akt_keszlet}</td>
              <td>{it.akt_keszlet > 10 ? 'Raktáron' : (it.akt_keszlet > 0 ? 'Alacsony' : 'Nincs készleten')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
