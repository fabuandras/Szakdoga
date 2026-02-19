import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import "../css/layout.css";

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-shell__header">
        <Navigation />
      </header>

      <main className="app-shell__main">
        <div className="page-frame">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
