import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminUsers() {
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await axios.get('http://localhost:8000/api/users', { withCredentials: true });
        if (!mounted) return;
        setUsers(res.data.users || []);
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
                <th scope="col">Felhasználónév</th>
                <th scope="col">Név</th>
                <th scope="col">Email</th>
                <th scope="col">Létrehozva</th>
                <th scope="col">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5">Betöltés...</td></tr>
              ) : error ? (
                <tr><td colSpan="5">Hiba: {error.message}</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5">Nincs felhasználó</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.felhasznalonev}</td>
                    <td>{u.vez_nev ? `${u.vez_nev} ${u.ker_nev}` : ''}</td>
                    <td>{u.email}</td>
                    <td>{u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</td>
                     <td>
                       <button className="btn btn-sm btn-outline-primary me-1">Szerk</button>
                       <button className="btn btn-sm btn-outline-danger">Tilt</button>
                     </td>
                   </tr>
                 ))
               )}
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