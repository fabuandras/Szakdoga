import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, errors } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [serverErrors, setServerErrors] = useState(null);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setServerErrors(null);
    const success = await login({ email, password });
    if (!success) {
      setServerErrors(errors);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Bejelentkezés</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2">
            <label className="form-label">Felhasználónév vagy Email</label>
            <input
              className="form-control"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Felhasználónév vagy Email"
              autoComplete="username"
            />
            {serverErrors && serverErrors.email && (
              <div className="auth-error">{serverErrors.email[0]}</div>
            )}
          </div>

          <div className="mb-2">
            <label className="form-label">Jelszó</label>
            <input
              className="form-control"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Jelszó"
              autoComplete="current-password"
            />
            {serverErrors && serverErrors.password && (
              <div className="auth-error">{serverErrors.password[0]}</div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary w-100"
          >
            Bejelentkezés
          </button>
          {serverErrors && serverErrors.message && (
            <div className="auth-error">{serverErrors.message}</div>
          )}
        </form>
      </div>
    </div>
  );
}