import { Navigate } from 'react-router-dom';

function AdminRoute({ user, children }) {
  const isAdmin = user && (user.is_admin === true || user.role === 'admin');
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default AdminRoute;