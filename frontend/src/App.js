import logo from "./logo.svg";
import "./App.css";
import "./layout.css";
import "./navigation.css";

import { Routes, Route } from "react-router-dom";
import GuestLayout from "./layouts/GuestLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

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
          <Route path="registration" element={<Registration />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
