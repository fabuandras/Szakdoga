import { Outlet } from "react-router-dom";
import Navigation from "../pages/Navigation";

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