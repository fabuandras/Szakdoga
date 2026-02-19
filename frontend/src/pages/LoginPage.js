import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h1>Login</h1>
      <p>Ez a public oldal (nincs Layout alatt).</p>
      <p>
        Nincs még fiókod? <Link to="/register">Regisztráció</Link>
      </p>
    </div>
  );
}
