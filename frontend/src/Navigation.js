import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

export default function Navigation(){
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <nav className="main-nav">
      <div className="main-nav-left">
        <>
          <NavLink to="/">Kezdőlap</NavLink>
          <NavLink to="/rolunk">Rólunk</NavLink>
          <NavLink to="/termekek">Termékek</NavLink>
          <NavLink to="/kapcsolat">Kapcsolat</NavLink>
          <NavLink to="/warehouse">Raktáros</NavLink>
        </>
      </div>

      <div className="main-nav-right">
        <div
          className={`profile-menu ${menuOpen ? 'open' : ''}`}
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            className="profile-icon-link profile-icon-btn"
            aria-label="Profil menü"
            onClick={() => setMenuOpen((previous) => !previous)}
          >
            <i className="bi bi-person-circle"></i>
          </button>

          <div className="profile-dropdown">
            {user ? (
              <>
                <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                  Profilom
                </NavLink>
                <button type="button" className="nav-link-btn" onClick={handleLogout}>
                  Kijelentkezés
                </button>
              </>
            ) : (
              <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                Bejelentkezés
              </NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                Regisztráció
              </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
