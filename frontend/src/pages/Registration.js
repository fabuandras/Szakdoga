import { useContext, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Registration.css";
import { AuthContext } from "../contexts/AuthContext";

export default function Registration() {
  const navigate = useNavigate();
  const { register, errors, generalError, setErrors, setGeneralError } =
    useContext(AuthContext);

  const [formData, setFormData] = useState({
    felhasznalonev: "",
    lastName: "",
    firstName: "",
    salutation: "",
    email: "",
    phone: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    password: "",
    passwordConfirm: "",
  });

  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const birthDateRef = useRef(null);

  function handleBirthInput(e) {
    const el = e.target;
    let v = el.value || ""; // expected format yyyy-mm-dd from native date input

    // If user typed characters (some browsers allow), normalize to digits and dashes
    // Ensure year part max 4 digits
    const parts = v.split('-');
    const currentYear = new Date().getFullYear();

    if (parts.length > 0) {
      parts[0] = parts[0].replace(/\D/g, '').slice(0, 4);
      // If year exceeds currentYear, clamp it
      if (parts[0]) {
        const y = parseInt(parts[0], 10);
        if (!isNaN(y) && y > currentYear) {
          parts[0] = String(currentYear);
        }
      }
    }

    // month and day: keep numeric, max two digits
    if (parts.length > 1) parts[1] = parts[1].replace(/\D/g, '').slice(0, 2);
    if (parts.length > 2) parts[2] = parts[2].replace(/\D/g, '').slice(0, 2);

    const newVal = parts.filter(Boolean).join('-');

    // set the sanitized value to state
    setFormData((prev) => ({ ...prev, birthDate: newVal }));

    // Attempt to auto-advance caret: if year reached 4 digits, move caret to month (index 5)
    try {
      if (birthDateRef?.current && parts[0] && parts[0].length === 4) {
        // position for month start in yyyy-mm-dd is 5
        birthDateRef.current.setSelectionRange(5, 5);
      }
    } catch (err) {
      // Ignore if browser doesn't allow setSelectionRange on date input
    }
  }

  function handleChange(e) {
    const { name } = e.target;

    if (name === 'birthDate') {
      handleBirthInput(e);
      return;
    }

    const { value } = e.target;

    // If editing name fields, strip any digits and disallowed characters (allow letters, spaces, hyphen, apostrophe)
    if (name === 'lastName' || name === 'firstName') {
      const sanitized = (value || '').replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\u0100-\u017F '\-]/g, '');
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

  function validate() {
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

    if (!formData.salutation)
      newErrors.salutation = "A megszólítás megadása kötelező.";

    if (!formData.email.trim()) newErrors.email = "Az email megadása kötelező.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = "Érvénytelen email formátum.";

    if (!formData.phone.trim())
      newErrors.phone = "A telefonszám megadása kötelező.";
    else {
      // Elfogadott formátumok: 06 20 123 4567  |  +36 20 123 4567  |  06201234567
      const phonePattern = /^(?:\+36|06)\s?\d{2}\s?\d{3}\s?\d{4}$/;
      if (!phonePattern.test(formData.phone.trim())) {
        newErrors.phone = "Telefonszám formátuma érvénytelen. Elfogadott: 06 20 123 4567, +36 20 123 4567 vagy 06201234567.";
      }
    }

    if (!formData.birthYear)
      newErrors.birthDate = "A születési dátum megadása kötelező.";
    else {
      // validate year/month/day parts
      const y = formData.birthYear;
      const m = formData.birthMonth;
      const d = formData.birthDay;
      if (!y || y.length !== 4) {
        newErrors.birthDate = "Az évnek négy számjegyből kell állnia (pl. 2002).";
      } else {
        const yearNum = parseInt(y, 10);
        const currentYear = new Date().getFullYear();
        if (isNaN(yearNum) || yearNum > currentYear) {
          newErrors.birthDate = "Az év nem lehet a jövőben.";
        }
      }

      if (!newErrors.birthDate) {
        if (!m || m.length === 0) newErrors.birthDate = "A hónap megadása kötelező.";
        else if (parseInt(m, 10) < 1 || parseInt(m, 10) > 12) newErrors.birthDate = "Érvénytelen hónap.";
      }

      if (!newErrors.birthDate) {
        if (!d || d.length === 0) newErrors.birthDate = "A nap megadása kötelező.";
        else if (parseInt(d, 10) < 1 || parseInt(d, 10) > 31) newErrors.birthDate = "Érvénytelen nap.";
      }

      // final check: create date object
      if (!newErrors.birthDate) {
        const yy = parseInt(formData.birthYear, 10);
        const mm = parseInt(formData.birthMonth, 10) - 1;
        const dd = parseInt(formData.birthDay, 10);
        const dt = new Date(yy, mm, dd);
        if (dt.getFullYear() !== yy || dt.getMonth() !== mm || dt.getDate() !== dd) {
          newErrors.birthDate = "Érvénytelen dátum.";
        }
      }
    }

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
        // küldjük a felhasználónév mezőt a backendnek is
        felhasznalonev: formData.felhasznalonev.trim(),

        // Laravel alap mezők
        name: fullName,
        email: formData.email.trim(),
        password: formData.password,
        password_confirmation: formData.passwordConfirm,

        // opcionális, ha backend kezelni tudja
        vez_nev: formData.lastName.trim(),
        ker_nev: formData.firstName.trim(),
        megszolitas: formData.salutation,
        tel_szam: formData.phone.trim(),
        // küldés előtt összeállítjuk YYYY.MM.DD formátumot a részekből
        szul_datum:
          formData.birthYear && formData.birthMonth && formData.birthDay
            ? `${formData.birthYear}.${formData.birthMonth.padStart(2, '0')}.${formData.birthDay.padStart(2, '0')}`
            : null,
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

          <div className="mb-2">
            <label className="form-label">Jelszó</label>
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
            <label className="form-label">Jelszó megerősítése</label>
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