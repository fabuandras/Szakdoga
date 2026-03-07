import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        <div className="site-footer-brand">
          <h3>Loop & Stitch</h3>
          <p>Minőség, precizitás és modern raktárkezelés egy helyen.</p>
        </div>

        <div className="site-footer-links">
          <h4>Gyorslinkek</h4>
          <nav>
            <NavLink to="/">Főoldal</NavLink>
            <NavLink to="/rolunk">Rólunk</NavLink>
            <NavLink to="/termekek">Termékek</NavLink>
            <NavLink to="/kapcsolat">Kapcsolat</NavLink>
          </nav>
        </div>

        <div className="site-footer-meta">
          <h4>Elérhetőség</h4>
          <p>Kapcsolat: kapcsolat@loopstitch.hu</p>
          <p>Telefon: +36 20 000 0000</p>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {currentYear} Loop & Stitch. Minden jog fenntartva.</span>
      </div>
    </footer>
  );
}
