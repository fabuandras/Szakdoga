import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navigation(){
  return (
    <nav className="main-nav">
      <NavLink to="/">Kezdőlap</NavLink>
      <NavLink to="/login">Bejelentkezés</NavLink>
      <NavLink to="/register">Regisztráció</NavLink>
      <NavLink to="/warehouse">Raktáros</NavLink>
    </nav>
  );
}
