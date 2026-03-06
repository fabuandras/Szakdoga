import React from 'react';

export default function AdminProducts() {

  const products = [
    { id: 1, name: 'Naggyon ari plüss', category: 'valami', price: 'igen Ft', pieces: '69', status: 'Aktív' },
    { id: 2, name: 'Migiri', category: 'semmi', price: '0 Ft', pieces: '42', status: 'Inaktív' },
  ];

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
            <input className="form-control" style={{ minWidth: 200 }} placeholder="Keresés:" />
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
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>{p.pieces}</td>
                  <td>{p.status}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">Szerk</button>
                    <button className="btn btn-sm btn-outline-danger">Tilt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <footer className="mt-4 border-top pt-3 text-muted">&lt;footer&gt; Itt lesz a footer! </footer>
      </main>
    </div>
  );
}