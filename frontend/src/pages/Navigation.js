import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navigation() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Kezdőlap
            </Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <span className="nav-link">
                  Bejelentkezett: <strong>{user.email}</strong>
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => logout()}
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Kijelentkezés
                </button>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}