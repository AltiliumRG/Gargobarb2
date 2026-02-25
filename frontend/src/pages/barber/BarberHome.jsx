import { useEffect, useState } from "react";
import { getMyBarbershops } from "../../api/barber.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function BarberHome() {
  const [loadingPage, setLoadingPage] = useState(true);
  const navigate = useNavigate();

  const { user, loading } = useAuth(); // 🔥 auth real

  useEffect(() => {
    // 🔥 Pedir barberías (auth ya verificada en PrivateRoute)

    // 🔥 ahora sí pedir barberías
    getMyBarbershops()
      .then((res) => {
        if (!res.data.length) {
          navigate("/barber/create");
        } else {
          navigate("/barber/my");
        }
      })
      .catch((err) => {
        console.error("❌ Error fetch barberías en Home:", err);
      })
      .finally(() => setLoadingPage(false));
  }, [loading, user]);

  if (loading || loadingPage) {
    return <p>Cargando barber...</p>;
  }

  return null;
}
