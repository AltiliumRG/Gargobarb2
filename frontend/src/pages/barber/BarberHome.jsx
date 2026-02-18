import { useEffect, useState } from "react";
import { getMyBarbershops } from "../../api/barber.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function BarberHome() {
  const [loadingPage, setLoadingPage] = useState(true);
  const navigate = useNavigate();

  const { user, loading } = useAuth(); // 🔥 auth real

  useEffect(() => {
    // ⛔ esperar auth
    if (loading) return;

    // ⛔ si no hay user → login
    if (!user) {
      navigate("/login");
      return;
    }

    // 🔥 ahora sí pedir barberías
    getMyBarbershops()
      .then((res) => {
        if (!res.data.length) {
          navigate("/barber/crear");
        } else {
          navigate("/barber/mis-barberias");
        }
      })
      .catch(() => {
        navigate("/login");
      })
      .finally(() => setLoadingPage(false));
  }, [loading, user]);

  if (loading || loadingPage) {
    return <p>Cargando barber...</p>;
  }

  return null;
}
