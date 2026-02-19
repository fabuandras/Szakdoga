import { Link, useParams } from "react-router-dom";

export default function CourseDetailsPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Course details</h1>
      <p>
        Course ID: <strong>{id}</strong>
      </p>

      <p>
        <Link to="/courses">← Back to courses</Link>
      </p>
    </div>
  );
}
