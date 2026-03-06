import React from "react";
import AdminNav from "../AdminNav";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div>
      <AdminNav />

      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}