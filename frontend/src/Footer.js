import React from "react";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner container">
        <section className="site-footer-block site-footer-brand">
          <h3>Loop & Stitch</h3>
          <p>Modern webaruhaz es raktarkezeles egy letisztult feluleten.</p>
          <div className="site-footer-socials" aria-label="Kozossegi linkek">
            <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
          </div>
        </section>

        <nav className="site-footer-block site-footer-links" aria-label="Gyorslinkek">
          <h4>Navigacio</h4>
          <NavLink to="/">Fooldal</NavLink>
          <NavLink to="/termekek">Termekek</NavLink>
          <NavLink to="/rolunk">Rolunk</NavLink>
          <NavLink to="/kapcsolat">Kapcsolat</NavLink>
        </nav>

        <section className="site-footer-block site-footer-meta">
          <h4>Informacio</h4>
          <p>Rendeles feldolgozas: 1-2 munkanap</p>
          <p>Szallitas: orszagosan</p>
          <p>Tamogatas: hetfo-pentek 8:00-16:00</p>
        </section>

        <section className="site-footer-block site-footer-contact">
          <h4>Elerhetoseg</h4>
          <a href="mailto:kapcsolat@loopstitch.hu">kapcsolat@loopstitch.hu</a>
          <a href="tel:+36200000000">+36 20 000 0000</a>
          <p>Budapest, Magyarorszag</p>
        </section>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-bottom-inner container">
          <span>© {currentYear} Loop & Stitch. Minden jog fenntartva.</span>
          <span>Keszitette: Loop & Stitch Team</span>
        </div>
      </div>
    </footer>
  );
}
