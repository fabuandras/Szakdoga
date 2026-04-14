
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <section className="page home-page">
      {user ? (
        <>
          <h1>Üdv újra, {user.felhasznalonev}!</h1>
          <p>Innen gyorsan eléred a legfontosabb funkciókat.</p>

          <div className="home-actions">
            <NavLink to="/profile" className="home-action-card">
              <i className="bi bi-person-circle"></i>
              <span>Profilom</span>
            </NavLink>
            {user?.felhasznalonev === 'Bori' && (
              <NavLink to="/warehouse" className="home-action-card">
                <i className="bi bi-box-seam"></i>
                <span>Raktáros felület</span>
              </NavLink>
            )}
            <NavLink to="/kapcsolat" className="home-action-card">
              <i className="bi bi-envelope"></i>
              <span>Kapcsolat</span>
            </NavLink>
          </div>
        </>
      ) : (
        <>
          <h1>Főoldal</h1>

          <div className="home-feature-grid">
            <article className="home-feature-card">
              <h3>Átlátható készletkezelés</h3>
              <p>Rendezett felületen követheted a mozgásokat, bevételezést és kiadást.</p>
            </article>
            <article className="home-feature-card">
              <h3>Gyors munkafolyamat</h3>
              <p>Kevesebb kattintás, gyorsabb adminisztráció és jobb napi átláthatóság.</p>
            </article>
            <article className="home-feature-card">
              <h3>Egyszerű kapcsolatfelvétel</h3>
              <p>Kérdés esetén a Kapcsolat oldalon azonnal küldhetsz nekünk üzenetet.</p>
            </article>
          </div>
        </>
      )}
    </section>
  );
}