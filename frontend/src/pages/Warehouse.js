import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../layout.css';

export default function Warehouse() {
  return (
    <div className="page container">
      <h1>Raktáros felület</h1>
      <nav className="warehouse-nav">
        <NavLink to="products">Terméklista</NavLink>
        <NavLink to="intake">Bevitel</NavLink>
        <NavLink to="release">Kiadás</NavLink>
        <NavLink to="movement">Raktármozgás</NavLink>
        <NavLink to="inventory">Leltár</NavLink>
        <NavLink to="notifications">Értesítések</NavLink>
      </nav>

      <div className="warehouse-content">
        <Outlet />
      </div>
    </div>
  );
}
