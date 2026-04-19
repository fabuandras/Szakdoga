import React, { useMemo } from 'react';
import {
  formatName,
  formatCategory,
  formatPrice,
  formatPieces,
  formatStatusBoolean,
  filterProducts,
} from '../contexts/ProductContext';
import { useProductsData } from '../contexts/useProductsContext';

export default function AdminProducts() {
  const { products, loading, error, query, setQuery } = useProductsData();

  const filtered = useMemo(() => filterProducts(products, query), [products, query]);


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