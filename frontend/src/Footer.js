import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        <section className="site-footer-block site-footer-brand">
          <h3>Loop & Stitch</h3>
          <p>Modern webáruház és raktárkezelés egy letisztult felületen.</p>
          <div className="site-footer-socials" aria-label="Kozossegi linkek">
            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
          </div>
        </section>

        <nav className="site-footer-block site-footer-links" aria-label="Gyorslinkek">
          <h4>Navigáció</h4>
          <NavLink to="/">Főoldal</NavLink>
          <NavLink to="/termekek">Termékek</NavLink>
          <NavLink to="/rolunk">Rólunk</NavLink>
          <NavLink to="/kapcsolat">Kapcsolat</NavLink>
        </nav>

        <section className="site-footer-block site-footer-meta">
          <h4>Információ</h4>
          <p>Rendelés feldolgozás: 1-2 munkanap</p>
          <p>Szállítás: országosan</p>
          <p>Támogatás: hétfő-péntek 8:00-16:00</p>
        </section>

        <section className="site-footer-block site-footer-contact">
          <h4>Elérhetőség</h4>
          <a href="mailto:kapcsolat@loopstitch.hu">kapcsolat@loopstitch.hu</a>
          <a href="tel:+36200000000">+36 20 123 4567</a>
          <p>Budapest, Magyarország</p>
        </section>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-bottom-inner container">
          <span>© {currentYear} Loop & Stitch. Minden jog fenntartva.</span>
          <span>Készítette: Loop & Stitch Team</span>
        </div>
      </div>
    </footer>
  );
}
