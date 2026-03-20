import { useContext, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Registration.css";
import { AuthContext } from "../contexts/AuthContext";
import api from '../api/axios';

export default function Registration() {
  const navigate = useNavigate();
  const { register, errors, generalError, setErrors, setGeneralError } =
    useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    felhasznalonev: "",
    lastName: "",
    firstName: "",
    salutation: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    passwordConfirm: "",
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

    if (!formData.felhasznalonev.trim())
      newErrors.felhasznalonev = "A felhasználónév megadása kötelező.";
    else if (formData.felhasznalonev.length < 3)
      newErrors.felhasznalonev = "A felhasználónév legalább 3 karakter legyen.";

    if (!formData.lastName.trim())
      newErrors.lastName = "A vezetéknév megadása kötelező.";
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\u0100-\u017F '\-]+$/.test(formData.lastName.trim()))
      newErrors.lastName = "A vezetéknév csak betűket tartalmazhat.";

    if (!formData.firstName.trim())
      newErrors.firstName = "A keresztnév megadása kötelező.";
    else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\u0100-\u017F '\-]+$/.test(formData.firstName.trim()))
      newErrors.firstName = "A keresztnév csak betűket tartalmazhat.";

    if (!formData.salutation) newErrors.salutation = "A megszólítás megadása kötelező.";

    if (!formData.email.trim()) newErrors.email = "Az email megadása kötelező.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
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

    if (!formData.password) newErrors.password = "A jelszó megadása kötelező.";
    else if (formData.password.length < 8) newErrors.password = "A jelszó legalább 8 karakter legyen.";

    if (!formData.passwordConfirm) newErrors.passwordConfirm = "A jelszó megerősítése kötelező.";
    else if (formData.password !== formData.passwordConfirm)
      newErrors.passwordConfirm = "A két jelszó nem egyezik.";

    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setGeneralError(null);

      const validationErrors = validate();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

      // Build payload matching backend validation: include 'name' and password_confirmation
      const name = formData.felhasznalonev.trim() || `${formData.lastName.trim()} ${formData.firstName.trim()}`.trim();

      const {
        felhasznalonev,
        lastName: vezeteknev,
        firstName: keresztnev,
        salutation: megszolitas,
        email,
        phone: telefon,
        birthDate: szulDatum,
        password,
        passwordConfirm,
      } = formData;

      const payload = {
        felhasznalonev: felhasznalonev,
        name: felhasznalonev,

        // send multiple variants for last name and first name
        vez_nev: vezeteknev,
        vezeteknev: vezeteknev,
        last_name: vezeteknev,

        ker_nev: keresztnev,
        keresztnev: keresztnev,
        first_name: keresztnev,

        megszolitas: megszolitas,
        email,

        tel_szam: telefon,
        telefonszam: telefon,

        szul_datum: szulDatum,
        birthdate: szulDatum,

        password,
        password_confirmation: passwordConfirm,
      };

      try {
        await api.get('/sanctum/csrf-cookie');
        const res = await api.post('/api/register', payload);
        console.log('REGISTER SUCCESS', res.data);
        // show in-page modal success message
        setShowSuccess(true);
        // keep modal visible until user clicks the button
     } catch (err) {
        console.error('REGISTER ERROR', err.response && err.response.data);
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors || err.response.data);
        } else {
          setErrors({ message: 'Regisztráció sikertelen' });
        }
      }
    },
    [validate, register, setErrors, setGeneralError, navigate, formData]
  );

  return (
    <>
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Regisztráció</h1>

          {generalError && <div className="auth-error">{generalError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-2">
              <label className="form-label">Felhasználónév</label>
              <input
                className="form-control"
                name="felhasznalonev"
                placeholder="Felhasználónév"
                value={formData.felhasznalonev}
                onChange={handleChange}
                autoComplete="username"
              />
              {errors.felhasznalonev && <div className="auth-error">{errors.felhasznalonev}</div>}
            </div>

            <div className="mb-2">
              <label className="form-label">Vezetéknév</label>
              <input
                className="form-control"
                name="lastName"
                placeholder="Vezetéknév"
                value={formData.lastName}
                onChange={handleChange}
                autoComplete="family-name"
              />
              {errors.lastName && <div className="auth-error">{errors.lastName}</div>}
            </div>

            <div className="mb-2">
              <label className="form-label">Keresztnév</label>
              <input
                className="form-control"
                name="firstName"
                placeholder="Keresztnév"
                value={formData.firstName}
                onChange={handleChange}
                autoComplete="given-name"
              />
              {errors.firstName && <div className="auth-error">{errors.firstName}</div>}
            </div>

            <div className="mb-2">
              <label className="form-label">Megszólítás</label>
              <select
                className="form-control"
                name="salutation"
                value={formData.salutation}
                onChange={handleChange}
              >
                <option value="">Megszólítás kiválasztása</option>
                <option value="Mr">Mr.</option>
                <option value="Ms">Ms.</option>
                <option value="Miss">Miss.</option>
                <option value="Dr">Dr.</option>
              </select>
              {errors.salutation && (
                <div className="auth-error">{errors.salutation}</div>
              )}
            </div>

            <div className="mb-2">
              <label className="form-label">Email</label>
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
              <label className="form-label">Telefonszám</label>
              <input
                className="form-control"
                name="phone"
                placeholder="Telefonszám (pl. +36 20 123 4567)"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
              />
              {errors.phone && <div className="auth-error">{errors.phone}</div>}
            </div>

            <div className="mb-2">
              <label className="form-label">Születési dátum</label>
              <input
                className="form-control"
                type="date"
                name="birthDate"
                placeholder="Születési dátum"
                value={formData.birthDate}
                onChange={handleChange}
                ref={birthDateRef}
                 autoComplete="bday"
               />
              {errors.birthDate && <div className="auth-error">{errors.birthDate}</div>}
            </div>

            <div className="mb-2 password-field">
              <label className="form-label">Jelszó</label>
              <div className="password-input-wrapper">
                <input
                  className="form-control"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Jelszó"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <i
                  className={"password-toggle bi " + (showPassword ? "bi-eye-slash" : "bi-eye")}
                  onClick={() => setShowPassword((v) => !v)}
                />
              </div>
              {errors.password && <div className="auth-error">{errors.password}</div>}
            </div>

            <div className="mb-2 password-field">
              <label className="form-label">Jelszó megerősítése</label>
              <div className="password-input-wrapper">
                <input
                  className="form-control"
                  type={showPasswordConfirm ? "text" : "password"}
                  name="passwordConfirm"
                  placeholder="Jelszó megerősítése"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <i
                  className={"password-toggle bi " + (showPasswordConfirm ? "bi-eye-slash" : "bi-eye")}
                  onClick={() => setShowPasswordConfirm((v) => !v)}
                />
              </div>
              {errors.passwordConfirm && (
                <div className="auth-error">{errors.passwordConfirm}</div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100">
              Regisztráció
            </button>
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