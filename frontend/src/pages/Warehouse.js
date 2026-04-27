import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../layout.css';
import Navigation from '../Navigation';
import './warehouse.css';

export default function Warehouse({ theme, toggleTheme }) {
  const menuItems = [
    { to: 'products', label: 'Terméklista' },
    { to: 'intake', label: 'Bevételezés' },
    { to: 'release', label: 'Kiadás' },
    { to: 'movement', label: 'Raktármozgás' },
    { to: 'inventory', label: 'Leltár' },
    { to: 'notifications', label: 'Értesítések' },
  ];

  const menuTextStyle = { color: '#fff', WebkitTextFillColor: '#fff' };

  return (
    <div className="page container warehouse-page">
      <Navigation theme={theme} toggleTheme={toggleTheme} />
      <nav className="warehouse-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `warehouse-nav-link${isActive ? ' active' : ''}`}
            style={menuTextStyle}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="warehouse-content">
        <Outlet />
      </div>
    </div>
  );
}
