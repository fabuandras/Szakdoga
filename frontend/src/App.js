import logo from "./logo.svg";
import "./App.css";
import "./layout.css";
import "./navigation.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

// LAYOUT
import GuestLayout from "./layouts/GuestLayout";

// AUTH CONTEXT
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <GuestLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "registration", element: <Registration /> },
      ],
    },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Frontend</h1>
      </header>

      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;