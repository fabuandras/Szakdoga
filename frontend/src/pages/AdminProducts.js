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

  // deep unwrap helper
  const unwrap = (val) => {
    if (val === undefined || val === null) return null;
    if (Array.isArray(val)) return val.map(unwrap).filter(v => v != null).join(', ');
    if (typeof val === 'object') {
      for (const k of ['name','title','nev','label','value']) if (val[k] !== undefined && val[k] !== null) return unwrap(val[k]);
      for (const k of ['id','_id','sku']) if (val[k] !== undefined && val[k] !== null) return String(val[k]);
      try {
        const vals = Object.values(val).map(unwrap).filter(v => v != null);
        if (vals.length) return vals.join(' ');
      } catch (e) {}
      return null;
    }
    return val;
  };

  const typeRegex = {
    name: /nev|name|termek|title|megnevezes|cim/i,
    category: /kategoria|category|cat/i,
    price: /ar|price|price_huf|amount|ft/i,
    pieces: /darab|stock|pieces|qty|mennyiseg/i,
    status: /status|statusz/i,
  };

  const findFieldByType = (obj, type, candidates = []) => {
    if (!obj) return null;

    const deepFind = (o, predicate) => {
      if (o === undefined || o === null) return null;
      if (typeof o !== 'object') return null;
      for (const k of Object.keys(o)) {
        const v = o[k];
        try { if (predicate(k, v)) return unwrap(v); } catch (e) {}
      }
      for (const k of Object.keys(o)) {
        const v = o[k];
        if (v && typeof v === 'object') {
          const res = deepFind(v, predicate);
          if (res !== null && res !== undefined) return res;
        }
      }
      return null;
    };

    for (const k of candidates) {
      if (obj[k] !== undefined && obj[k] !== null && String(obj[k]).trim() !== '') return unwrap(obj[k]);
    }

    const regex = typeRegex[type];
    if (regex) {
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (regex.test(k) && v !== undefined && v !== null && String(v).trim() !== '') return unwrap(v);
      }
      const deepMatch = deepFind(obj, (key, val) => regex.test(key) && val !== undefined && val !== null && String(val).trim() !== '');
      if (deepMatch !== null) return deepMatch;
    }

    if (type === 'price' || type === 'pieces') {
      const numMatch = deepFind(obj, (key, val) => {
        if (val === undefined || val === null) return false;
        const s = String(val);
        return /[0-9]/.test(s);
      });
      if (numMatch !== null) return numMatch;
    }

    const primitive = deepFind(obj, (key, val) => (typeof val === 'string' && val.trim() !== '') || typeof val === 'number');
    if (primitive !== null) return primitive;

    return null;
  };

  const formatName = (p) => {
    const raw = findFieldByType(p, 'name', ['name','nev','title','product_name','termek_nev']);
    if (raw !== null && raw !== undefined && String(raw).trim() !== '') return String(raw);
    if (p && (p.sku || p.id || p._id)) return String(p.sku || p.id || p._id);
    return '-';
  };

  const formatCategory = (p) => {
    const raw = findFieldByType(p, 'category', ['category','kategoria','cat']);
    if (raw === null || raw === undefined) return '-';
    const s = String(raw).trim();
    if (s === '') return '-';
    if (/^[0-9]+$/.test(s)) return '-';
    return s;
  };

  const formatPrice = (p) => {
    const raw = findFieldByType(p, 'price', ['price','ar','price_huf','amount']);
    if (raw === null || raw === undefined) return '-';
    const asNum = (typeof raw === 'number') ? raw : Number(String(raw).replace(/[^0-9.-]+/g, ''));
    if (!isNaN(asNum)) return Math.round(asNum).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Ft';
    if (typeof raw === 'string') return raw.trim();
    return String(raw);
  };

  const formatPieces = (p) => {
    // prefer explicit akt_keszlet coming from the API
    if (p && (p.akt_keszlet !== undefined && p.akt_keszlet !== null)) {
      const akt = unwrap(p.akt_keszlet);
      if (akt === null || akt === undefined) return '-';
      const asNum = (typeof akt === 'number') ? akt : Number(String(akt).replace(/[^0-9.-]+/g, ''));
      if (!isNaN(asNum)) return String(asNum);
      return String(akt);
    }

    const raw = findFieldByType(p, 'pieces', ['akt_keszlet','pieces','stock','darab','mennyiseg','qty']);
    if (raw === null || raw === undefined) return '-';
    const asNum = (typeof raw === 'number') ? raw : Number(String(raw).replace(/[^0-9.-]+/g, ''));
    if (!isNaN(asNum)) return String(asNum);
    return String(raw);
  };

  // return boolean: true = in stock, false = out of stock
  const formatStatusBoolean = (p) => {
    const raw = findFieldByType(p, 'status', ['status','statusz']);
    if (raw === null || raw === undefined) return false;
    if (typeof raw === 'boolean') return raw;
    const s = String(raw).trim().toLowerCase();
    if (s === '') return false;
    if (/^(1|true|t|yes|y|aktív|aktiv|active|available|raktáron|in_stock)$/i.test(s)) return true;
    if (/^(0|false|f|no|n|inaktív|inaktiv|inactive|kifogyott|out|soldout)$/i.test(s)) return false;
    const n = Number(s.replace(/[^0-9.-]+/g, ''));
    if (!isNaN(n)) return n === 1;
    return false;
  };

  const filtered = React.useMemo(() => {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(p => {
      const name = String(formatName(p)).toLowerCase();
      const cat = String(formatCategory(p)).toLowerCase();
      return name.includes(q) || cat.includes(q) || (p.sku && String(p.sku).toLowerCase().includes(q));
    });
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
            <input
              className="form-control"
              style={{ minWidth: 200 }}
              placeholder="Keresés:"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
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
                <tr><td colSpan={6}>Nincs termék</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6}>Nincs találat</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id || p._id || p.sku || formatName(p)}>
                    <td>{formatName(p)}</td>
                    <td>{formatCategory(p)}</td>
                    <td>{formatPrice(p)}</td>
                    <td>{formatPieces(p)}</td>
                    <td>{formatStatusBoolean(p) ? 'Raktáron' : 'Kifogyott'}</td>
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