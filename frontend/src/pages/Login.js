import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Login.css";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, errors, generalError, setErrors, setGeneralError } =
    useContext(AuthContext);

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

  function validate() {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Az email megadása kötelező.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "Érvénytelen email formátum.";

    if (!formData.password) newErrors.password = "A jelszó megadása kötelező.";

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/");
    } catch {
      // hibát a context beállítja
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
            {errors.password && (
              <div className="auth-error">{errors.password}</div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Bejelentkezés
          </button>
        </form>

        <div className="auth-footer">
          Nincs még fiókod? <Link to="/registration">Regisztráció</Link>
        </div>
      </div>
    </div>
  );
}