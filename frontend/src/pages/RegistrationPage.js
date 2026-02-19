import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../login.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Gyenge", cls: "strength--weak" };
  if (score === 2 || score === 3) return { label: "Közepes", cls: "strength--medium" };
  return { label: "Erős", cls: "strength--strong" };
}

function validateRegister(values) {
  const errors = {};

  if (!values.lastName.trim()) errors.lastName = "A vezetéknév megadása kötelező.";
  if (!values.firstName.trim()) errors.firstName = "A keresztnév megadása kötelező.";

  if (!values.salutation) errors.salutation = "Válassz megszólítást.";

  if (!values.email.trim()) {
    errors.email = "Az email megadása kötelező.";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Érvénytelen email formátum.";
  }

  if (!values.phone.trim()) {
    errors.phone = "A telefonszám megadása kötelező.";
  } else if (!phoneRegex.test(values.phone.trim())) {
    errors.phone = "Érvénytelen telefonszám formátum.";
  }

  if (!values.birthDate) {
    errors.birthDate = "A születési dátum megadása kötelező.";
  } else {
    const d = new Date(values.birthDate);
    const now = new Date();
    if (Number.isNaN(d.getTime())) errors.birthDate = "Érvénytelen dátum.";
    else if (d > now) errors.birthDate = "A születési dátum nem lehet jövőbeli.";
  }

  if (!values.password) {
    errors.password = "A jelszó megadása kötelező.";
  } else if (values.password.length < 8) {
    errors.password = "A jelszó legalább 8 karakter legyen.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "A jelszó megerősítése kötelező.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "A két jelszó nem egyezik.";
  }

  return errors;
}

export default function RegistrationPage() {
  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    salutation: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const strength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const canSubmit = useMemo(() => {
    const e = validateRegister(form);
    return Object.keys(e).length === 0;
  }, [form]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // (opcionális) mezőszintű live validáció
    setErrors((prev) => {
      const next = { ...prev };
      const nextForm = { ...form, [name]: value };
      const nextErrors = validateRegister(nextForm);

      if (nextErrors[name]) next[name] = nextErrors[name];
      else delete next[name];

      // ha password változik, a confirmPassword hibát is frissítjük
      if (name === "password" || name === "confirmPassword") {
        if (nextErrors.confirmPassword) next.confirmPassword = nextErrors.confirmPassword;
        else delete next.confirmPassword;
      }

      return next;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateRegister(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    // Később: axios register + token + redirect
    console.log("REGISTER SUBMIT", form);
    alert("Regisztráció submit (demo) – később API-ra kötjük.");
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create account</h1>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-row">
            <div className="auth-field">
              <label htmlFor="lastName">Vezetéknév</label>
              <input
                id="lastName"
                className="auth-input"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Vezetéknév"
                autoComplete="family-name"
              />
              {errors.lastName && <div className="auth-error">{errors.lastName}</div>}
            </div>

            <div className="auth-field">
              <label htmlFor="firstName">Keresztnév</label>
              <input
                id="firstName"
                className="auth-input"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Keresztnév"
                autoComplete="given-name"
              />
              {errors.firstName && <div className="auth-error">{errors.firstName}</div>}
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="salutation">Megszólítás</label>
            <select
              id="salutation"
              className="auth-select"
              name="salutation"
              value={form.salutation}
              onChange={handleChange}
            >
              <option value="">Válassz...</option>
              <option value="Mr">Mr.</option>
              <option value="Ms">Ms.</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr.</option>
            </select>
            {errors.salutation && <div className="auth-error">{errors.salutation}</div>}
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email cím</label>
            <input
              id="email"
              className="auth-input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="email"
            />
            {errors.email && <div className="auth-error">{errors.email}</div>}
          </div>

          <div className="auth-field">
            <label htmlFor="phone">Telefonszám</label>
            <input
              id="phone"
              className="auth-input"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+36 20 123 4567"
              autoComplete="tel"
            />
            {errors.phone && <div className="auth-error">{errors.phone}</div>}
          </div>

          <div className="auth-field">
            <label htmlFor="birthDate">Születési dátum</label>
            <input
              id="birthDate"
              className="auth-input"
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
            />
            {errors.birthDate && <div className="auth-error">{errors.birthDate}</div>}
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
              placeholder="Jelszó"
              autoComplete="new-password"
            />
            <div className={`strength ${strength.cls}`}>
              Jelszó erőssége: {strength.label}
            </div>
            {errors.password && <div className="auth-error">{errors.password}</div>}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Jelszó megerősítése</label>
            <input
              id="confirmPassword"
              className="auth-input"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Jelszó megerősítése"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <div className="auth-error">{errors.confirmPassword}</div>
            )}
          </div>

          <button className="auth-button" type="submit" disabled={!canSubmit}>
            Fiók létrehozása
          </button>
        </form>

        <div className="auth-footer">
          Van már fiókod?{" "}
          <Link className="auth-link" to="/login">
            Bejelentkezés
          </Link>
        </div>
      </div>
    </div>
  );
}