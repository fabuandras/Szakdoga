import { NavLink } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="topnav">
      <div className="topnav__left">
        <div className="topnav__brand">SKILLSHARE ACADEMY</div>

        <div className="topnav__links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `topnav__link ${isActive ? "is-active" : ""}`}
          >
            DASHBOARD
          </NavLink>

          <NavLink
            to="/courses"
            className={({ isActive }) => `topnav__link ${isActive ? "is-active" : ""}`}
          >
            COURSES
          </NavLink>

          <NavLink
            to="/mentors"
            className={({ isActive }) => `topnav__link ${isActive ? "is-active" : ""}`}
          >
            MENTORS
          </NavLink>
        </div>
      </div>

      <div className="topnav__right">
        <div className="topnav__badge">25 CREDITS</div>
        <div className="topnav__welcome">Welcome, John Doe</div>
        <button className="topnav__logout" type="button">
          LOGOUT
        </button>
      </div>
    </nav>
  );
}