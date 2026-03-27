import React, { useState, useContext, useRef, useCallback } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "../Registration.css";
import { AuthContext } from "../contexts/AuthContext";
import api from '../api/axios';

const Registration = () => {
  const navigate = useNavigate();
  const { register, errors: contextErrors, generalError, setErrors: setContextErrors, setGeneralError } =
    useContext(AuthContext);

  // state declarations (must be at top of component)
  const [vezeteknev, setVezeteknev] = useState('');
  const [keresztnev, setKeresztnev] = useState('');
  const [felhasznalonev, setFelhasznalonev] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // local state for the registration form
  const [errors, setErrors] = useState(contextErrors || null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [formData, setFormData] = useState({
    salutation: "",
    phone: "",
    birthDate: "",
  });

  const birthDateRef = useRef(null);

  function handleBirthInput(e) {
    const el = e.target;
    let v = el.value || ""; // expected format yyyy-mm-dd from native date input

    // Ensure year part max 4 digits and not in future
    const parts = v.split("-");
    const currentYear = new Date().getFullYear();

    if (parts.length > 0) {
      parts[0] = parts[0].replace(/\D/g, "").slice(0, 4);
      if (parts[0]) {
        const y = parseInt(parts[0], 10);
        if (!isNaN(y) && y > currentYear) {
          parts[0] = String(currentYear);
        }
      }
    }

    if (parts.length > 1) parts[1] = parts[1].replace(/\D/g, "").slice(0, 2);
    if (parts.length > 2) parts[2] = parts[2].replace(/\D/g, "").slice(0, 2);

    const newVal = parts.filter(Boolean).join("-");

    setFormData((prev) => ({ ...prev, birthDate: newVal }));

    // try to move caret to month when year typed (may not work on all browsers)
    try {
      if (birthDateRef?.current && parts[0] && parts[0].length === 4) {
        birthDateRef.current.setSelectionRange(5, 5);
      }
    } catch (err) {
      // ignore
    }
  }

  function handleChange(e) {
    const { name } = e.target;

    if (name === "birthDate") {
      handleBirthInput(e);
      return;
    }

    const { value } = e.target;

    // sanitize name fields: allow letters, spaces, hyphen and apostrophe
    if (name === "lastName" || name === "firstName") {
      const sanitized = (value || "").replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\u0100-\u017F '\-]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const validate = useCallback(() => {
    const newErrors = {};

    if (!felhasznalonev.trim())
      newErrors.felhasznalonev = "A felhasználónév megadása kötelező.";
    else if (felhasznalonev.length < 3)
      newErrors.felhasznalonev = "A felhasználónév legalább 3 karakter legyen.";

    if (!vezeteknev.trim())
      newErrors.lastName = "A vezetéknév megadása kötelező.";
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\u0100-\u017F '\-]+$/.test(vezeteknev.trim()))
      newErrors.lastName = "A vezetéknév csak betűket tartalmazhat.";

    if (!keresztnev.trim())
      newErrors.firstName = "A keresztnév megadása kötelező.";
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\u0100-\u017F '\-]+$/.test(keresztnev.trim()))
      newErrors.firstName = "A keresztnév csak betűket tartalmazhat.";

    if (!formData.salutation) newErrors.salutation = "A megszólítás megadása kötelező.";

    if (!email.trim()) newErrors.email = "Az email megadása kötelező.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Érvénytelen email formátum.";

    if (!formData.phone.trim()) newErrors.phone = "A telefonszám megadása kötelező.";
    else {
      const phonePattern = /^(?:\+36|06)\s?\d{2}\s?\d{3}\s?\d{4}$/;
      if (!phonePattern.test(formData.phone.trim())) {
        newErrors.phone = "Telefonszám formátuma érvénytelen. Elfogadott: 06 20 123 4567, +36 20 123 4567 vagy 06201234567.";
      }
    }

    if (!formData.birthDate) newErrors.birthDate = "A születési dátum megadása kötelező.";
    else {
      const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!isoPattern.test(formData.birthDate)) {
        newErrors.birthDate = "Érvénytelen dátumformátum. Használja a naptárat (pl. 2002-01-25).";
      } else {
        const year = parseInt(formData.birthDate.slice(0, 4), 10);
        const currentYear = new Date().getFullYear();
        if (year > currentYear) newErrors.birthDate = "Az év nem lehet a jövőben.";
      }
    }

    if (!password) newErrors.password = "A jelszó megadása kötelező.";
    else if (password.length < 8) newErrors.password = "A jelszó legalább 8 karakter legyen.";

    if (!passwordConfirm) newErrors.passwordConfirm = "A jelszó megerősítése kötelező.";
    else if (password !== passwordConfirm)
      newErrors.passwordConfirm = "A két jelszó nem egyezik.";

    return newErrors;
  }, [formData, felhasznalonev, vezeteknev, keresztnev, email, password, passwordConfirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Registration handleSubmit called', { vezeteknev, keresztnev, felhasznalonev, email });
    setErrors(null);

    const payload = {
      vez_nev: vezeteknev,
      ker_nev: keresztnev,
      felhasznalonev: felhasznalonev,
      name: felhasznalonev,
      email: email,
      password: password,
      password_confirmation: passwordConfirm,
    };

    try {
      console.log('Requesting CSRF cookie...');
      const csrfRes = await api.get('/sanctum/csrf-cookie');
      console.log('CSRF response:', csrfRes && csrfRes.status, csrfRes && csrfRes.headers);

      console.log('Sending registration payload', payload);
      const res = await api.post('/api/register', payload);
      console.log('REGISTER SUCCESS', res && res.data);
      setShowSuccess(true);
    } catch (err) {
      console.error('REGISTER ERROR full', err);
      if (err && err.response) {
        console.error('REGISTER ERROR response data:', err.response.data);
        console.error('REGISTER ERROR response status:', err.response.status);
        console.error('REGISTER ERROR response headers:', err.response.headers);
      }
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || err.response.data);
      } else {
        setErrors({ message: 'Regisztráció sikertelen' });
      }
    }
  };

  return (
    <>
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Regisztráció</h1>

          {generalError && <div className="auth-error">{generalError}</div>}

          {/* registration form: only the required fields */}
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="mb-2">
              <label className="form-label">Vezetéknév</label>
              <input
                className="form-control"
                name="lastName"
                placeholder="Vezetéknév"
                value={vezeteknev}
                onChange={(e) => setVezeteknev(e.target.value)}
                autoComplete="family-name"
                required
              />
              {errors && errors.lastName && <div className="auth-error">{errors.lastName}</div>}
            </div>

            <div className="mb-2">
              <label className="form-label">Keresztnév</label>
              <input
                className="form-control"
                name="firstName"
                placeholder="Keresztnév"
                value={keresztnev}
                onChange={(e) => setKeresztnev(e.target.value)}
                autoComplete="given-name"
                required
              />
              {errors && errors.firstName && <div className="auth-error">{errors.firstName}</div>}
            </div>

            <div className="mb-2">
              <label className="form-label">Felhasználónév</label>
              <input
                className="form-control"
                name="felhasznalonev"
                placeholder="Felhasználónév"
                value={felhasznalonev}
                onChange={(e) => setFelhasznalonev(e.target.value)}
                autoComplete="username"
                required
              />
              {errors && errors.felhasznalonev && <div className="auth-error">{errors.felhasznalonev}</div>}
            </div>

            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              {errors && errors.email && <div className="auth-error">{errors.email}</div>}
            </div>

            <div className="mb-2 password-field">
              <label className="form-label">Jelszó</label>
              <div className="password-input-wrapper">
                <input
                  className="form-control"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Jelszó"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <i
                  className={"password-toggle bi " + (showPassword ? "bi-eye-slash" : "bi-eye")}
                  onClick={() => setShowPassword((v) => !v)}
                />
              </div>
              {errors && errors.password && <div className="auth-error">{errors.password}</div>}
            </div>

            <div className="mb-2 password-field">
              <label className="form-label">Jelszó megerősítése</label>
              <div className="password-input-wrapper">
                <input
                  className="form-control"
                  type={showPasswordConfirm ? 'text' : 'password'}
                  name="passwordConfirm"
                  placeholder="Jelszó megerősítése"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <i
                  className={"password-toggle bi " + (showPasswordConfirm ? "bi-eye-slash" : "bi-eye")}
                  onClick={() => setShowPasswordConfirm((v) => !v)}
                />
              </div>
              {errors && errors.passwordConfirm && (
                <div className="auth-error">{errors.passwordConfirm}</div>
              )}
            </div>

            <div className="form-row">
              <button className="btn primary" type="submit">Regisztráció</button>
            </div>
          </form>

          <div className="auth-footer">
            Van már fiókod? <Link to="/login">Bejelentkezek!</Link>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div className="reg-modal-overlay">
          <div className="reg-modal-backdrop" />
          <div className="reg-modal-box">
            <div className="reg-modal-check">✓</div>
            <h2 className="reg-modal-title">Sikeres regisztráció</h2>
            <p className="reg-modal-desc">A fiók létrejött. Kérjük, jelentkezz be a folytatáshoz.</p>
            <div className="reg-modal-actions">
              <button onClick={() => navigate('/login')} className="reg-modal-btn primary">Tovább a bejelentkezéshez</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Registration;