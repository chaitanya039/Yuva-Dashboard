// utils/PublicRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((s) => s.auth);

  if (loading) return null;              // optional spinner while booting
  return !isAuthenticated
    ? children                           // show Login / Forgot-password etc.
    : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
