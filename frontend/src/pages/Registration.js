import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Registration.css";
import { AuthContext } from "../contexts/AuthContext";

export default function Registration() {
  const navigate = useNavigate();
  const { register, errors, generalError, setErrors, setGeneralError } =
    useContext(AuthContext);

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    salutation: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    passwordConfirm: "",
  });

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.lastName.trim())
      newErrors.lastName = "A vezetéknév megadása kötelező.";
    if (!formData.firstName.trim())
      newErrors.firstName = "A keresztnév megadása kötelező.";

    if (!formData.salutation)
      newErrors.salutation = "A megszólítás megadása kötelező.";

    if (!formData.email.trim()) newErrors.email = "Az email megadása kötelező.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "Érvénytelen email formátum.";

    if (!formData.phone.trim())
      newErrors.phone = "A telefonszám megadása kötelező.";

    if (!formData.birthDate)
      newErrors.birthDate = "A születési dátum megadása kötelező.";

    if (!formData.password) newErrors.password = "A jelszó megadása kötelező.";
    else if (formData.password.length < 8)
      newErrors.password = "A jelszó legalább 8 karakter legyen.";

    if (!formData.passwordConfirm)
      newErrors.passwordConfirm = "A jelszó megerősítése kötelező.";
    else if (formData.password !== formData.passwordConfirm)
      newErrors.passwordConfirm = "A két jelszó nem egyezik.";

    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    try {
      await register({
        // ✅ Breeze / Laravel validáció miatt
        name: fullName,

        // ✅ Saját adatbázis mezők (migráció alapján)
        vez_nev: formData.lastName.trim(),
        ker_nev: formData.firstName.trim(),
        megszolitas: formData.salutation,
        email: formData.email.trim(),
        tel_szam: formData.phone.trim(),
        szul_datum: formData.birthDate, // yyyy-mm-dd
        jelszo: formData.password,

        // ✅ ha a backend Laravel "password_confirmation"-t vár
        password: formData.password,
        password_confirmation: formData.passwordConfirm,
      });

      navigate("/login");
    } catch {
      // hibát a context kezeli
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Regisztráció</h1>

        {generalError && <div className="auth-error">{generalError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2">
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
            <select
              className="form-control"
              name="salutation"
              value={formData.salutation}
              onChange={handleChange}
            >
              <option value="">Megszólítás kiválasztása</option>
              <option value="Mr">Mr</option>
              <option value="Ms">Ms</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
            </select>
            {errors.salutation && (
              <div className="auth-error">{errors.salutation}</div>
            )}
          </div>

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
              name="phone"
              placeholder="Telefonszám"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
            />
            {errors.phone && <div className="auth-error">{errors.phone}</div>}
          </div>

          <div className="mb-2">
            <input
              className="form-control"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              autoComplete="bday"
            />
            {errors.birthDate && <div className="auth-error">{errors.birthDate}</div>}
          </div>

          <div className="mb-2">
            <input
              className="form-control"
              type="password"
              name="password"
              placeholder="Jelszó"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <div className="mb-2">
            <input
              className="form-control"
              type="password"
              name="passwordConfirm"
              placeholder="Jelszó megerősítése"
              value={formData.passwordConfirm}
              onChange={handleChange}
              autoComplete="new-password"
            />
            {errors.passwordConfirm && (
              <div className="auth-error">{errors.passwordConfirm}</div>
            )}
          </div>

          <button type="submit" className="btn btn-success w-100">
            Regisztráció
          </button>
        </form>

        <div className="auth-footer">
          Van már fiókod? <Link to="/login">Bejelentkezés</Link>
        </div>
      </div>
    </div>
  );
}