import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

export default function Navigation({ theme, toggleTheme }){
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const isWarehouseOnlyUser = user?.felhasznalonev === 'Bori';

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
        {isWarehouseOnlyUser ? (
          <NavLink to="/warehouse" className="warehouse-top-title">Raktáros felület</NavLink>
        ) : (
          <>
            <NavLink to="/">
              <i className="bi bi-house"></i> Főoldal
            </NavLink>
            <NavLink to="/rolunk">
              <i className="bi bi-info-circle"></i> Rólunk
            </NavLink>
            <NavLink to="/termekek">
              <i className="bi bi-box-seam"></i> Termékek
            </NavLink>
            <NavLink to="/kapcsolat">
              <i className="bi bi-envelope"></i> Kapcsolat
            </NavLink>
          </>
        )}
      </div>

      <div className="main-nav-right">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Téma váltás"
          title={theme === 'dark' ? 'Világos mód' : 'Sötét mód'}
        >
          <i className={theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars'}></i>
        </button>

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
            <span className="profile-icon-text">Fiók</span>
          </button>

          <div className="profile-dropdown">
            {user ? (
              isWarehouseOnlyUser ? (
                <button type="button" className="nav-link-btn" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Kijelentkezés
                </button>
              ) : (
                <>
                  <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
                    Profilom
                  </NavLink>
                  <button type="button" className="nav-link-btn" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Kijelentkezés
                  </button>
                </>
              )
            ) : (
              <>
              <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-box-arrow-in-right"></i> Bejelentkezés
              </NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                <i className="bi bi-person-plus"></i> Regisztráció
              </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
