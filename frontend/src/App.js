import logo from './logo.svg';
import './App.css';
import './layout.css';
import './navigation.css';

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import Layout from "./pages/Layout";
import NoPage from "./pages/NoPage";

import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailsPage from "./pages/CourseDetailsPage";
import MentorsPage from "./pages/MentorsPage";
import BookedSessionPage from "./pages/BookedSessionPage";

import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";

function App() {
  const router = createBrowserRouter([
    // PUBLIC ROUTES (nem Layout alatt)
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegistrationPage /> },

    // PRIVATE ROUTES (Layout alatt, később tokennel védjük)
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        { path: "dashboard", element: <DashboardPage /> },

        {
          path: "courses",
          children: [
            { index: true, element: <CoursesPage /> },
            { path: ":id", element: <CourseDetailsPage /> },
          ],
        },

        { path: "mentors", element: <MentorsPage /> },
        { path: "booked-session", element: <BookedSessionPage /> },
      ],
    },

    { path: "*", element: <NoPage /> },
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Frontend</h1>
      </header>

      {/* A router itt fogja kirenderelni a Layout-ot / page-eket */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
