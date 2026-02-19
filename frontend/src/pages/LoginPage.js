import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../login.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Az email megadása kötelező.";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Érvénytelen email formátum.";
  }

  if (!values.password) {
    errors.password = "A jelszó megadása kötelező.";
  } else if (values.password.length < 6) {
    errors.password = "A jelszó legalább 6 karakter legyen.";
  }

  return errors;
}

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const canSubmit = useMemo(() => {
    const e = validateLogin(form);
    return Object.keys(e).length === 0;
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // (opcionális) mezőszintű live validáció
    setErrors((prev) => {
      const next = { ...prev };
      const nextForm = { ...form, [name]: value };
      const nextErrors = validateLogin(nextForm);

      if (nextErrors[name]) next[name] = nextErrors[name];
      else delete next[name];

      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateLogin(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    // Később: axios login + token + redirect
    console.log("LOGIN SUBMIT", form);
    alert("Login submit (demo) – később API-ra kötjük.");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Sign in</h1>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-field">
            <label htmlFor="email">Email cím</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Add meg az email címed"
              autoComplete="email"
            />
            {errors.email && <div className="auth-error">{errors.email}</div>}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Jelszó</label>
            <input
              id="password"
              className="auth-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Add meg a jelszavad"
              autoComplete="current-password"
            />
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <button className="auth-button" type="submit" disabled={!canSubmit}>
            Bejelentkezés
          </button>
        </form>

        <div className="auth-footer">
          Nincs még fiókod?{" "}
          <Link className="auth-link" to="/register">
            Regisztráció
          </Link>
        </div>
      </div>
    </div>
  );
}