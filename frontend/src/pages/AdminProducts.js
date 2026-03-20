import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get('http://localhost:8000/api/items', { headers, withCredentials: true });
        if (!mounted) return;
        const payload = Array.isArray(res.data) ? res.data : (res.data.products || res.data.items || res.data || []);
        setProducts(Array.isArray(payload) ? payload : []);
      } catch (e) {
        if (!mounted) return;
        setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // helper to get a field from many possible keys, with fuzzy matching
  const getField = (obj, keys) => {
    if (!obj) return null;
    for (const k of keys) {
      if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== '') return obj[k];
    }
    for (const k of Object.keys(obj)) {
      if (/nev|name|termek|title|megnevezes|cim/i.test(k) && obj[k]) return obj[k];
      if (/ar|price|price_huf|ft/i.test(k) && obj[k]) return obj[k];
      if (/darab|stock|pieces|qty|mennyiseg/i.test(k) && obj[k]) return obj[k];
    }
    return null;
  };

  const formatName = (p) => String(getField(p, ['name','nev','title','product_name','termek_nev']) || '');
  const formatCategory = (p) => String(getField(p, ['category','kategoria','cat']) || '-');
  const formatPrice = (p) => {
    const v = getField(p, ['price','ar','price_huf']);
    return v !== null ? v : '-';
  };
  const formatPieces = (p) => {
    const v = getField(p, ['pieces','stock','darab','mennyiseg','qty']);
    return v !== null ? v : '-';
  };
  const formatStatus = (p) => String(getField(p, ['status','statusz']) || '-');

  const filtered = React.useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(p => String(formatName(p)).toLowerCase().startsWith(q));
  }, [products, query]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading products.</div>;

  return (
    <div className="admin-container d-flex">
      <main className="col-md-9 flex-grow-1 p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <button className="btn btn-primary me-2">+ Új termék</button>
            <div className="d-md-none d-inline-block">
              <button className="btn btn-outline-secondary">Menü</button>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <input className="form-control" style={{ minWidth: 200 }} placeholder="Keresés:" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>

        <div className="table-responsive card">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Termék neve</th>
                <th scope="col">Kategória</th>
                <th scope="col">Ár</th>
                <th scope="col">Darabszám</th>
                <th scope="col">Státusz</th>
                <th scope="col">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan="6">Nincs termék</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6">Nincs találat</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id || p._id || p.sku || formatName(p)}>
                    <td>{formatName(p)}</td>
                    <td>{formatCategory(p)}</td>
                    <td>{formatPrice(p)}</td>
                    <td>{formatPieces(p)}</td>
                    <td>{formatStatus(p)}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">Szerk</button>
                      <button className="btn btn-sm btn-outline-danger">Tilt</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
        <footer className="mt-4 border-top pt-3 text-muted">&lt;footer&gt; Itt lesz a footer! </footer>
      </main>
    </div>
  );
}