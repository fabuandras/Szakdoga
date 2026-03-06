import React from "react";
import Navigation from "../Navigation";
import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div>
      <Navigation />

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}