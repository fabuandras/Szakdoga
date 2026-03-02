import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

export default function Navigation(){
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/');
    }
  };

  return (
    <nav className="main-nav">
      {user ? (
        <>
          <NavLink to="/profile">Profilom</NavLink>
          <NavLink to="/warehouse">Raktáros</NavLink>
          <button type="button" className="nav-link-btn" onClick={handleLogout}>
            Kijelentkezés
          </button>
        </>
      ) : (
        <>
          <NavLink to="/">Kezdőlap</NavLink>
          <NavLink to="/login">Bejelentkezés</NavLink>
          <NavLink to="/register">Regisztráció</NavLink>
        </>
      )}
    </nav>
  );
}
