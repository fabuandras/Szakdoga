import React, { useState } from "react";

export default function Kapcsolat() {
  const [formData, setFormData] = useState({
    nev: "",
    email: "",
    targy: "",
    uzenet: "",
  });
  const [errors, setErrors] = useState({});
  const [isSent, setIsSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) {
      setErrors((previous) => ({ ...previous, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nev.trim()) {
      newErrors.nev = "A név megadása kötelező.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Az email cím megadása kötelező.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Érvénytelen email formátum.";
    }

    if (!formData.targy.trim()) {
      newErrors.targy = "A tárgy megadása kötelező.";
    }

    if (!formData.uzenet.trim()) {
      newErrors.uzenet = "Az üzenet megadása kötelező.";
    } else if (formData.uzenet.trim().length < 10) {
      newErrors.uzenet = "Az üzenet legalább 10 karakter legyen.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setIsSent(false);
      return;
    }

    setIsSent(true);
    setFormData({ nev: "", email: "", targy: "", uzenet: "" });
  };

  return (
    <section className="page">
      <h1>Kapcsolat</h1>
      <p>Írj nekünk üzenetet, és hamarosan válaszolunk.</p>

      <div className="contact-card">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-field">
            <label htmlFor="nev">Név</label>
            <input
              id="nev"
              name="nev"
              type="text"
              className="form-control"
              placeholder="Teljes név"
              value={formData.nev}
              onChange={handleChange}
            />
            {errors.nev && <small className="contact-error">{errors.nev}</small>}
          </div>

          <div className="contact-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              placeholder="pelda@email.hu"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <small className="contact-error">{errors.email}</small>}
          </div>

          <div className="contact-field">
            <label htmlFor="targy">Tárgy</label>
            <input
              id="targy"
              name="targy"
              type="text"
              className="form-control"
              placeholder="Miben segíthetünk?"
              value={formData.targy}
              onChange={handleChange}
            />
            {errors.targy && <small className="contact-error">{errors.targy}</small>}
          </div>

          <div className="contact-field">
            <label htmlFor="uzenet">Üzenet</label>
            <textarea
              id="uzenet"
              name="uzenet"
              className="form-control contact-textarea"
              placeholder="Írd le röviden az üzenetedet..."
              value={formData.uzenet}
              onChange={handleChange}
            />
            {errors.uzenet && <small className="contact-error">{errors.uzenet}</small>}
          </div>

          <button type="submit" className="primary contact-submit">Üzenet küldése</button>
        </form>

        {isSent && (
          <p className="contact-success">Köszönjük! Az üzeneted sikeresen elküldve.</p>
        )}
      </div>
    </section>
  );
}
