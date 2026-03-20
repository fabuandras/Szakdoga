import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function AdminNav() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext) || {};

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } catch (e) {
      // ignore
    }
    try { localStorage.removeItem('token'); } catch (e) {}
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar navbar-expand-sm bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/messages">📩 Üzenetek</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/notifications">🔔 Értesítések</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin">👤 Admin</Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/profile">⚙️ Fiók</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                Kijelentkezés
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}