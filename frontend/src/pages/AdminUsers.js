import React from 'react';

export default function AdminUsers() {
  
  const users = [
    { id: 1, name: 'Kovács A.', email: 'a@pelda.hu', role: 'Admin', status: 'Aktív' },
    { id: 2, name: 'Nagy B.', email: 'b@pelda.hu', role: 'Felhasz.', status: 'Inaktív' },
  ];

  return (
    <div className="admin-container d-flex">
      <main className="col-md-9 flex-grow-1 p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <button className="btn btn-primary me-2">+ Új felhasználó</button>
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
                <th scope="col">Név</th>
                <th scope="col">Email</th>
                <th scope="col">Szerepkör</th>
                <th scope="col">Státusz</th>
                <th scope="col">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-1">Szerk</button>
                    <button className="btn btn-sm btn-outline-danger">Tilt</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-3 border-top d-flex justify-content-between align-items-center">
            <div>
              <select className="form-select form-select-sm w-auto d-inline-block">
                <option>Tömeges műveletek</option>
                <option>Aktiválás</option>
                <option>Inaktiválás</option>
                <option>Szerepkör módosítás</option>
              </select>
              <button className="btn btn-sm btn-secondary ms-2">Végrehajt</button>
            </div>
            <small className="text-muted">{users.length} találat</small>
          </div>
        </div>
        <footer className="mt-4 border-top pt-3 text-muted">&lt;footer&gt; Itt lesz a footer! </footer>
      </main>
    </div>
  );
}