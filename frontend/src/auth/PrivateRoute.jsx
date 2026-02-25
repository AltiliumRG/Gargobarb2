import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔑 NORMALIZAR ROL
  const userRole = user.role_id ?? user.role;

  // 🔒 Validación segura
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

