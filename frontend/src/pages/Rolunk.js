import React from "react";
import { NavLink } from "react-router-dom";

export default function Rolunk() {
  return (
    <section className="page about-page">
      <h1>Rólunk</h1>

      <div className="about-intro-card">
        <h2>Kik vagyunk?</h2>
        <p>
          Egy olyan raktárkezelési megoldást építünk, amely egyszerűen használható,
          gyors, és a mindennapi adminisztrációt átláthatóvá teszi.
        </p>
        <p>
          Célunk, hogy a készletkezelés ne plusz teher legyen, hanem egy stabil,
          könnyen követhető folyamat.
        </p>
      </div>

      <div className="about-stats-grid">
        <article className="about-stat-card">
          <strong>Egységes</strong>
          <span>felület a napi munkához</span>
        </article>
        <article className="about-stat-card">
          <strong>Gyors</strong>
          <span>bevitel és nyomon követés</span>
        </article>
        <article className="about-stat-card">
          <strong>Átlátható</strong>
          <span>készlet és mozgáskezelés</span>
        </article>
      </div>

      <div className="about-values-grid">
        <article className="about-value-card">
          <i className="bi bi-lightning-charge"></i>
          <h3>Hatékonyság</h3>
          <p>Kevesebb adminisztráció, gyorsabb napi műveletek.</p>
        </article>

        <article className="about-value-card">
          <i className="bi bi-shield-check"></i>
          <h3>Megbízhatóság</h3>
          <p>Rendezett adatok és egyértelmű munkafolyamatok.</p>
        </article>

        <article className="about-value-card">
          <i className="bi bi-people"></i>
          <h3>Támogatás</h3>
          <p>Felhasználóbarát működés és gyors kapcsolatfelvétel.</p>
        </article>
      </div>

      <div className="about-cta-card">
        <h3>Segíthetünk valamiben?</h3>
        <p>Lépj velünk kapcsolatba, vagy nézd meg a termékeket.</p>
        <div className="about-cta-actions">
          <NavLink to="/kapcsolat" className="home-action-card">
            <i className="bi bi-envelope"></i>
            <span>Kapcsolat</span>
          </NavLink>
          <NavLink to="/termekek" className="home-action-card">
            <i className="bi bi-grid"></i>
            <span>Termékek</span>
          </NavLink>
        </div>
      </div>
    </section>
  );
}
