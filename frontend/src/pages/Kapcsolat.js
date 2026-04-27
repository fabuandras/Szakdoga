import React, { useState } from "react";

export default function Kapcsolat() {
  const inputStyle = {
    background: "#f7f3ef",
    color: "#222",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "8px",
  };
  const labelStyle = { color: "#222", fontWeight: 600 };
  const leftColStyle = { minWidth: 260, maxWidth: 380 };
  const infoBoxStyle = {
    background: "#f7f3ef",
    color: "#222",
    padding: "12px",
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    lineHeight: 1.35,
    wordBreak: "normal",
    overflowWrap: "normal",
    whiteSpace: "normal",
  };

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

      <div className="contact-layout">
        <div className="col-md-4" style={leftColStyle}>
          <div className="card">
            <div className="card-body">
              <h3
                style={{
                  color: "#222",
                  whiteSpace: "normal",
                  fontSize: 28,
                  lineHeight: 1.1,
                }}
              >
                Elérhetőségeink
              </h3>
              <p style={{ color: "#444", marginBottom: 16 }}>
                Hétfőtől péntekig 8:00-16:00 között vagyunk elérhetők.
              </p>

              <div style={infoBoxStyle}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Telefonszám</div>
                <div>+36 30 123 4567</div>
              </div>

              <div style={infoBoxStyle}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Email</div>
                <div style={{ wordBreak: "normal", overflowWrap: "anywhere" }}>
                  kapcsolat@loopandstitch.hu
                </div>
              </div>

              <div style={infoBoxStyle}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Helyszín</div>
                <div>4024 Debrecen, Piac utca 18.</div>
              </div>
            </div>
          </div>
        </div>

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
              {errors.nev && (
                <small className="contact-error">{errors.nev}</small>
              )}
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
              {errors.email && (
                <small className="contact-error">{errors.email}</small>
              )}
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
              {errors.targy && (
                <small className="contact-error">{errors.targy}</small>
              )}
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
              {errors.uzenet && (
                <small className="contact-error">{errors.uzenet}</small>
              )}
            </div>

            <button type="submit" className="primary contact-submit">
              Üzenet küldése
            </button>
          </form>

          {isSent && (
            <p className="contact-success">
              Köszönjük! Az üzeneted sikeresen elküldve.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
