import { Link } from "react-router-dom";

export default function NoPage() {
  return (
    <div>
      <h1>404 - No page</h1>
      <p>
        <Link to="/dashboard">Go to Dashboard</Link>
      </p>
    </div>
  );
}
