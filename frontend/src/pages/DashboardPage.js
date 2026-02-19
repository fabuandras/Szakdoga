import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div>
      <h1>Welcome back, John Doe!</h1>
      <p>Current balance: 25 credits</p>

      <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <div style={{ border: "2px solid #2a2a2a", padding: 16, minWidth: 220 }}>
          <div style={{ fontSize: 32, fontWeight: 700, textAlign: "center" }}>3</div>
          <div style={{ textAlign: "center", textTransform: "uppercase" }}>Enrolled courses</div>
        </div>
        <div style={{ border: "2px solid #2a2a2a", padding: 16, minWidth: 220 }}>
          <div style={{ fontSize: 32, fontWeight: 700, textAlign: "center" }}>8</div>
          <div style={{ textAlign: "center", textTransform: "uppercase" }}>Completed chapters</div>
        </div>
        <div style={{ border: "2px solid #2a2a2a", padding: 16, minWidth: 220 }}>
          <div style={{ fontSize: 32, fontWeight: 700, textAlign: "center" }}>25</div>
          <div style={{ textAlign: "center", textTransform: "uppercase" }}>Total credits earned</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
        <Link to="/courses" style={{ border: "2px solid #2a2a2a", padding: "10px 14px", textDecoration: "none", color: "#2a2a2a" }}>
          Browse courses
        </Link>
        <Link to="/booked-session" style={{ border: "2px solid #2a2a2a", padding: "10px 14px", textDecoration: "none", color: "#2a2a2a" }}>
          Book mentor session
        </Link>
      </div>
    </div>
  );
}
