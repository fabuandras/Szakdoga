import React from "react";
import AdminNav from "../AdminNav";
import { Outlet } from "react-router-dom";
import AdminRoute from '../components/AdminRoute';

export default function AdminLayout() {
  return (
    <AdminRoute>
      <div>
        <AdminNav />

        <main className="container">
          <Outlet />
        </main>
      </div>
    </AdminRoute>
  );
}