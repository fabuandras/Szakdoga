import { Link } from "react-router-dom";

export default function CoursesPage() {
  return (
    <div>
      <h1>Courses</h1>
      <p>Válassz egy kurzust (demo):</p>

      <ul>
        <li>
          <Link to="/courses/1">Course #1</Link>
        </li>
        <li>
          <Link to="/courses/2">Course #2</Link>
        </li>
        <li>
          <Link to="/courses/3">Course #3</Link>
        </li>
      </ul>
    </div>
  );
}
