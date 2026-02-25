import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navigation() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-fluid">
        <ul className="navbar-nav">
          {user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profilom
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleLogout()}
                  style={{ textDecoration: "none", cursor: "pointer" }}
                >
                  Kijelentkezés
                </button>
              </li>
            </>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}