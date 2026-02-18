import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBuilder } from "../../context/BuilderContext";
import { Save, Rocket } from "lucide-react";
import toast from "react-hot-toast";

export default function TopbarBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveDraft, publishSite, site } = useBuilder();

  const handlePublish = async () => {
    try {
      await saveDraft();
      await publishSite();
      toast.success("¡Sitio publicado con éxito!");
    } catch (err) {
      toast.error("Error al publicar el sitio");
    }
  };

  return (
    <header className="h-16 bg-[#0b0f14] border-b border-gray-800 flex items-center justify-between px-8 text-white">

      {/* LOGO */}
      <div className="flex items-center gap-10">
        <h1 className="font-black text-xl tracking-tighter bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          GargoBarb Builder
        </h1>

        <nav className="hidden lg:flex gap-8 text-[11px] uppercase tracking-widest font-bold opacity-50">
          <button onClick={() => navigate("/barber/mis-barberias")} className="hover:opacity-100 transition">
            Mis barberías
          </button>
          <button onClick={() => navigate("/barber/crear")} className="hover:opacity-100 transition">
            Crear barbería
          </button>
          {site?.slug && (
            <button onClick={() => window.open(`/b/${site.slug}`, '_blank')} className="text-yellow-500 hover:brightness-110 transition flex items-center gap-2">
              <Rocket size={14} /> Ver Sitio Público
            </button>
          )}
        </nav>
      </div>

      {/* USER & ACTIONS */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end mr-4">
          <span className="text-xs font-bold">{user?.full_name || "Barbero"}</span>
          <span className="text-[10px] opacity-40 uppercase tracking-tighter">Plan Professional</span>
        </div>

        <button
          onClick={saveDraft}
          className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition flex items-center gap-2 text-sm font-bold"
          title="Guardar Borrador"
        >
          <Save size={18} />
          <span className="hidden md:inline">Guardar</span>
        </button>

        <button
          className="bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-tight hover:scale-105 active:scale-95 transition shadow-lg shadow-yellow-500/20 flex items-center gap-2"
          onClick={handlePublish}
        >
          <Rocket size={18} />
          Publicar
        </button>
      </div>
    </header>
  );
}
