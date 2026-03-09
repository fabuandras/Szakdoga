import React from "react";
import Navigation from "../Navigation";
import { Outlet } from "react-router-dom";

export default function GuestLayout({ theme, toggleTheme }) {
  return (
    <div>
      <h1 className="site-title">LOOP & STITCH</h1>
      <section className="guest-hero">
        <Navigation theme={theme} toggleTheme={toggleTheme} />
      </section>

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}