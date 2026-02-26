import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, errors, generalError, setErrors, setGeneralError } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
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

    // Client-side validation (magyar hibák)
    const validation = {};
    if (!formData.emailOrUsername || !formData.emailOrUsername.trim()) {
      validation.email_or_username = 'A felhasználónév vagy email megadása kötelező.';
    }
    if (!formData.password) {
      validation.password = 'A jelszó megadása kötelező.';
    }
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    try {
      await login(formData);
      navigate("/profile");
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
            <label className="form-label">Felhasználónév vagy Email</label>
            <input
              className="form-control"
              name="emailOrUsername"
              placeholder="Felhasználónév vagy Email"
              value={formData.emailOrUsername}
              onChange={handleChange}
              autoComplete="username"
            />
            {errors.email_or_username && <div className="auth-error">{errors.email_or_username}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label">Jelszó</label>
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