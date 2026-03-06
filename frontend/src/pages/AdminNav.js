import React from "react";
import { Link, Outlet } from "react-router-dom";



export default function AdminNav() {


  return (
    <>
      <nav className="navbar navbar-expand-sm bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav">
            
              
                <li className="nav-item">
                  <strong>Adminisztrátor felület</strong>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    ✉️ Üzenetek
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/registration">
                    🔔 Értesítések
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/registration">
                    👤Admin 
                  </Link>
                </li>
              
            
          </ul>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}