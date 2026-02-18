import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function TopbarBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-[#0b0f14] border-b border-gray-800 flex items-center justify-between px-8">
      
      {/* LOGO */}
      <div className="flex items-center gap-6">
        <h1 className="font-bold text-lg text-white">
          GargoBarb Builder
        </h1>

        <nav className="hidden md:flex gap-6 text-sm text-gray-400">
          <button onClick={() => navigate("/barber/dashboard")}>
            Mis barberías
          </button>

          <button onClick={() => navigate("/barber/create")}>
            Crear barbería
          </button>

          <button onClick={() => navigate("/client/explore")}>
            Ver barberías
          </button>
        </nav>
      </div>

      {/* USER */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          {user?.name || "Usuario"}
        </span>

        <button
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold"
          onClick={() => alert("Publicar sitio")}
        >
          Publicar
        </button>
      </div>
    </header>
  );
}
