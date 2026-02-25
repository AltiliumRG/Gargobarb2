import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AuthRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // 🔴 ADMIN
  if (user.role_id === 1) {
    return <Navigate to="/admin" replace />;
  }

  // 🟡 BARBERO (ROLE 2)
  if (user.role_id === 2) {
    return <Navigate to="/barber" replace />;
  }

  // 🔵 CLIENTE
  if (user.role_id === 3) {
<<<<<<< Updated upstream
    return <Navigate to="/client" replace />;
=======
<<<<<<< HEAD
    return <Navigate to="/" replace />;
=======
    return <Navigate to="/client" replace />;
>>>>>>> origin/David
>>>>>>> Stashed changes
  }

  // fallback
  return <Navigate to="/login" replace />;
}
