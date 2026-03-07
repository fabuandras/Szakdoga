import React from "react";
import Navigation from "../Navigation";
import { Outlet } from "react-router-dom";

export default function GuestLayout({ theme, toggleTheme }) {
  return (
    <div>
      <Navigation theme={theme} toggleTheme={toggleTheme} />

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}