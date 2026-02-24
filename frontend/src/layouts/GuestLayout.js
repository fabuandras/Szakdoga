import React from "react";
import Navigation from "../pages/Navigation";
import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <>
      <Navigation />
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}