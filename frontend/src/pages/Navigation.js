import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Kezdőlap
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/login">
              Bejelentkezés
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/registration">
              Regisztráció
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}