import "./App.css";
import "./layout.css";
import "./navigation.css";


import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import GuestLayout from "./layouts/GuestLayout";
import Home from "./pages/Home";
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

function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Frontend</h1>
      </header>

      <Routes>
        <Route path="/" element={<GuestLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Registration />} />
          <Route path="registration" element={<Registration />} />
          <Route
            path="profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route path="/admin" element={<AdminHomePage />} />
        </Route>

        <Route
          path="/warehouse"
          element={
            <RequireAuth>
              <Warehouse />
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
  );
}

export default App;
