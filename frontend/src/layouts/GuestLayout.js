import React from "react";
import Navigation from "../Navigation";
import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div>
      <header className="App-header">
        <h1>Frontend</h1>
      </header>

      <Navigation />

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}