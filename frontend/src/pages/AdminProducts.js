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
        const res = await axios.get('http://localhost:8000/api/items', { withCredentials: true });
        if (!mounted) return;
        // assume API returns { products: [...] } or an array directly
        const payload = res.data.products || res.data || [];
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

  const filtered = React.useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(p => String(p.nev || p.name || '').toLowerCase().startsWith(q));
  }, [products, query]);

  const formatName = (p) => p.name || p.nev || p.title || p.product_name || '';
  const formatCategory = (p) => p.category || p.kategoria || p.cat || '-';
  const formatPrice = (p) => p.price || p.ar || '-';
  const formatPieces = (p) => p.pieces || p.stock || p.darab || '-';
  const formatStatus = (p) => p.status || p.statusz || '-';

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
              {loading ? (
                <tr><td colSpan="6">Betöltés...</td></tr>
              ) : error ? (
                <tr><td colSpan="6">Hiba: {error.message}</td></tr>
              ) : products.length === 0 ? (
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