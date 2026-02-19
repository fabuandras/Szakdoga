import { Link } from "react-router-dom";

export default function RegistrationPage() {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1>Registration</h1>
      <p>Ez a public oldal (nincs Layout alatt).</p>
      <p>
        Van már fiókod? <Link to="/login">Bejelentkezés</Link>
      </p>
    </div>
  );
}
