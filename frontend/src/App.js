import "./App.css";
import "./layout.css";
import "./navigation.css";

import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GuestLayout from "./layouts/GuestLayout";
import Home from "./pages/Home";
import Rolunk from "./pages/Rolunk";
import Termekek from "./pages/Termekek";
import Kapcsolat from "./pages/Kapcsolat";
import Kedvencek from "./pages/Kedvencek";
import Kosar from "./pages/Kosar";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Profile from "./pages/Profile";
import Warehouse from "./pages/Warehouse";
import ProductsList from "./pages/ProductsList";
import Intake from "./pages/Intake";
import Release from "./pages/Release";
import Movement from "./pages/Movement";
import Inventory from "./pages/Inventory";
import Notifications from "./pages/Notifications";
import AdminHomePage from "./pages/AdminHomePage";
import { AuthContext } from "./contexts/AuthContext";
import AdminNav from "./pages/AdminNav";
import AdminUsers from "./pages/AdminUsers";
import AdminProducts from "./pages/AdminProducts";
import Footer from "./Footer";

function isWarehouseOnlyUser(user) {
  return user?.felhasznalonev === "Bori";
}

function isAdminOnlyUser(user) {
  return user?.felhasznalonev === "Bendeguz";
}

function RedirectWarehouseOnly({ children }) {
  const { user } = useContext(AuthContext);

  if (isWarehouseOnlyUser(user)) {
    return <Navigate to="/warehouse" replace />;
  }

  if (isAdminOnlyUser(user)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function RequireAuth({ children }) {
  const { user, authReady } = useContext(AuthContext);

  if (!authReady) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  };

  return (
    <div className="App">
      <div className="app-main">
      <Routes>
        <Route path="/" element={<GuestLayout theme={theme} toggleTheme={toggleTheme} />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="registration" element={<Registration />} />
          <Route
            index
            element={
              <RedirectWarehouseOnly>
                <Home />
              </RedirectWarehouseOnly>
            }
          />
          <Route
            path="rolunk"
            element={
              <RedirectWarehouseOnly>
                <Rolunk />
              </RedirectWarehouseOnly>
            }
          />
          <Route
            path="termekek"
            element={
              <RedirectWarehouseOnly>
                <Termekek />
              </RedirectWarehouseOnly>
            }
          />
          <Route
            path="kapcsolat"
            element={
              <RedirectWarehouseOnly>
                <Kapcsolat />
              </RedirectWarehouseOnly>
            }
          />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <RedirectWarehouseOnly>
                  <Profile />
                </RedirectWarehouseOnly>
              </RequireAuth>
            }
          />
          <Route
            path="kedvencek"
            element={
              <RequireAuth>
                <RedirectWarehouseOnly>
                  <Kedvencek />
                </RedirectWarehouseOnly>
              </RequireAuth>
            }
          />
          <Route
            path="kosar"
            element={
              <RequireAuth>
                <RedirectWarehouseOnly>
                  <Kosar />
                </RedirectWarehouseOnly>
              </RequireAuth>
            }
          />
        </Route>

       
        <Route path="admin" element={<AdminNav />}>
          <Route index element={<AdminHomePage />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
        </Route>

        <Route
          path="warehouse"
          element={
            <RequireAuth>
              <Warehouse theme={theme} toggleTheme={toggleTheme} />
            </RequireAuth>
          }
        >
          <Route index element={<ProductsList />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="intake" element={<Intake />} />
          <Route path="release" element={<Release />} />
          <Route path="movement" element={<Movement />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>
      </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;