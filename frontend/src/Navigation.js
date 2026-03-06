import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

export default function Navigation(){
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [guestMenuOpen, setGuestMenuOpen] = useState(false);

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
      <div className="main-nav-left">
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
            <NavLink to="/rolunk">Rólunk</NavLink>
            <NavLink to="/termekek">Termékek</NavLink>
            <NavLink to="/kapcsolat">Kapcsolat</NavLink>
          </>
        )}
      </div>

      <div className="main-nav-right">
        {user ? (
          <NavLink to="/profile" className="profile-icon-link" aria-label="Profil">
            <i className="bi bi-person-circle"></i>
          </NavLink>
        ) : (
          <div
            className={`profile-menu ${guestMenuOpen ? 'open' : ''}`}
            onMouseEnter={() => setGuestMenuOpen(true)}
            onMouseLeave={() => setGuestMenuOpen(false)}
          >
            <button
              type="button"
              className="profile-icon-link profile-icon-btn"
              aria-label="Profil menü"
              onClick={() => setGuestMenuOpen((previous) => !previous)}
            >
              <i className="bi bi-person-circle"></i>
            </button>

            <div className="profile-dropdown">
              <NavLink to="/login" onClick={() => setGuestMenuOpen(false)}>
                Bejelentkezés
              </NavLink>
              <NavLink to="/register" onClick={() => setGuestMenuOpen(false)}>
                Regisztráció
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
