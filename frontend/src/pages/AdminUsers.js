import React, { useMemo, useState } from 'react';
import { formatUserName, formatCreatedAt, filterUsers } from '../contexts/UserContext';
import { useUsersData } from '../contexts/useUsersContext';
import axios from 'axios';

export default function AdminUsers() {
  const { users, loading, error, query, setQuery, setUsers } = useUsersData();
  const [blockLoading, setBlockLoading] = useState(null);
  const [blockError, setBlockError] = useState(null);

  const filtered = useMemo(() => filterUsers(users, query), [users, query]);

  const handleBlockUser = async (felhasznalonev, isBlocked) => {
    setBlockLoading(felhasznalonev);
    setBlockError(null);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const endpoint = isBlocked 
        ? `/api/admin/users/${felhasznalonev}/unblock`
        : `/api/admin/users/${felhasznalonev}/block`;
      
      await axios.post(`http://localhost:8000${endpoint}`, {}, { headers, withCredentials: true });
      
      // Frissítse a felhasználót a listában
      setUsers(users.map(u => 
        u.felhasznalonev === felhasznalonev 
          ? { ...u, is_blocked: !isBlocked }
          : u
      ));
    } catch (e) {
      setBlockError(e.response?.data?.message || 'Hiba történt a blokkolás során');
    } finally {
      setBlockLoading(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading users.</div>;

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
            <input className="form-control" style={{ minWidth: 200 }} placeholder="Keresés:" value={query} onChange={e => setQuery(e.target.value)} />
          </div>
        </div>

        {blockError && (
          <div className="alert alert-danger mb-3">
            {blockError}
          </div>
        )}

        <div className="table-responsive card">
          <table className="table mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col">Felhasználónév</th>
                <th scope="col">Név</th>
                <th scope="col">Email</th>
                <th scope="col">Létrehozva</th>
                <th scope="col">Státusz</th>
                <th scope="col">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="6">Nincs felhasználó</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6">Nincs találat</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id || u.felhasznalonev}>
                    <td>{u.felhasznalonev}</td>
                    <td>{formatUserName(u)}</td>
                    <td>{u.email}</td>
                    <td>{formatCreatedAt(u)}</td>
                    <td>
                      {u.is_blocked ? (
                        <span className="badge bg-danger">Letiltva</span>
                      ) : (
                        <span className="badge bg-success">Aktív</span>
                      )}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1">Szerk</button>
                      <button 
                        className={`btn btn-sm ${u.is_blocked ? 'btn-outline-success' : 'btn-outline-danger'}`}
                        onClick={() => handleBlockUser(u.felhasznalonev, u.is_blocked)}
                        disabled={blockLoading === u.felhasznalonev}
                      >
                        {blockLoading === u.felhasznalonev ? 'Feldolgozás...' : (u.is_blocked ? 'Felold' : 'Tilt')}
                      </button>
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
      </main>
    </div>
  );
}