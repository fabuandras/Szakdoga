import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";
import { AuthContext } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, errors, generalError, setGeneralError } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle visibility

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setGeneralError(null);
    const success = await login({ email, password });
    if (success) {
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
            {(errors.email_or_username || errors.email) && (
              <div className="auth-error">{errors.email_or_username || errors.email}</div>
            )}
          </div>

          <div className="mb-2 password-field">
            <label className="form-label">Jelszó</label>
            <div className="password-input-wrapper">
              <input
                className="form-control"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Jelszó"
                autoComplete="current-password"
              />
              <i
                className={"password-toggle bi " + (showPassword ? "bi-eye-slash" : "bi-eye")}
                onClick={() => setShowPassword((v) => !v)}
              />
            </div>
            {errors.password && (
              <div className="auth-error">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Bejelentkezés
          </button>
          {generalError && (
            <div className="auth-error">{generalError}</div>
          )}
        </form>
      </div>
    </div>
  );
}