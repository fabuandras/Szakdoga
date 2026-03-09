import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

export default function Navigation({ theme, toggleTheme }){
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isWarehouseOnlyUser = user?.felhasznalonev === 'Bori';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setMenuOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    }
  };

  return (
    <nav className="main-nav shell-nav">
      <button
        type="button"
        className="nav-mobile-toggle"
        onClick={() => setMobileMenuOpen((previous) => !previous)}
        aria-label="Menü nyitása"
      >
        <i className={mobileMenuOpen ? 'bi bi-x-lg' : 'bi bi-list'}></i>
      </button>

      <div className={`main-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
        {isWarehouseOnlyUser ? (
          <NavLink to="/warehouse" className="warehouse-top-title" onClick={() => setMobileMenuOpen(false)}>Raktáros felület</NavLink>
        ) : (
          <>
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Fooldal</NavLink>
            <NavLink to="/termekek" onClick={() => setMobileMenuOpen(false)}>Termekek</NavLink>
            <NavLink to="/rolunk" onClick={() => setMobileMenuOpen(false)}>Rolunk</NavLink>
            <NavLink to="/kapcsolat" onClick={() => setMobileMenuOpen(false)}>Kapcsolat</NavLink>
          </>
        )}
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
            <span className="profile-icon-text">Fiok</span>
          </button>

          <div className="profile-dropdown">
            {user ? (
              isWarehouseOnlyUser ? (
                <button type="button" className="nav-link-btn" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Kijelentkezés
                </button>
              ) : (
                <>
                  <NavLink to="/profile" onClick={() => { setMenuOpen(false); setMobileMenuOpen(false); }}>
                    Profilom
                  </NavLink>
                  <button type="button" className="nav-link-btn" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Kijelentkezés
                  </button>
                </>
              )
            ) : (
              <>
                <NavLink to="/login" onClick={() => { setMenuOpen(false); setMobileMenuOpen(false); }}>
                  <i className="bi bi-box-arrow-in-right"></i> Bejelentkezés
                </NavLink>
                <NavLink to="/register" onClick={() => { setMenuOpen(false); setMobileMenuOpen(false); }}>
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
