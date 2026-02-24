import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, errors, generalError, setErrors, setGeneralError } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError(null);
    setErrors({});

    try {
      await login(formData);
      navigate("/");
    } catch {
      // hibát a context kezeli
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Bejelentkezés</h1>

        {generalError && <div className="auth-error">{generalError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2">
            <input
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <div className="auth-error">{errors.email}</div>}
          </div>

          <div className="mb-2">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Jelszó"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Bejelentkezés
          </button>
        </form>
      </div>
    </div>
  );
}