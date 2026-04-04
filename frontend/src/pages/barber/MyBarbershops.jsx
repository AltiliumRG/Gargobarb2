import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBarbershops, deleteBarbershop } from "../../api/barber.api";
import { Trash2, Edit, Layout, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function MyBarbershops() {
  const [shops, setShops] = useState([]);
  const navigate = useNavigate();

  const fetchShops = () => {
    getMyBarbershops().then((res) => setShops(res.data));
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta barbería? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await deleteBarbershop(id);
      toast.success("Barbería eliminada correctamente");
      fetchShops();
    } catch (error) {
      console.error("Error deleting barbershop:", error);
      toast.error("Error al eliminar la barbería");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black mb-8 uppercase tracking-tighter text-white">
        Mis Barberías
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <div key={shop.id} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-yellow-500/30 transition-all group shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-500 transition-colors">{shop.name}</h2>
            <p className="text-sm text-gray-400 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              {shop.address} · {shop.city}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate(`/barber/dashboard/${shop.id}`)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Layout size={16} />
                Panel de Control
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/barber/builder/${shop.id}`)}
                  className="flex-1 bg-white hover:bg-gray-200 text-black py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Editar sitio
                </button>

                <button
                  onClick={() => navigate(`/barber/dashboard/${shop.id}/schedule`)}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/5"
                >
                  <Clock size={16} />
                  Horarios
                </button>

                <button
                  onClick={() => handleDelete(shop.id)}
                  className="w-12 h-10.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all flex items-center justify-center border border-red-500/20"
                  title="Eliminar barbería"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shops.length === 0 && (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
          <p className="text-gray-500 text-lg">Aún no tienes barberías registradas.</p>
          <button
            onClick={() => navigate("/barber/create")}
            className="mt-4 text-yellow-500 font-bold hover:underline"
          >
            Crear mi primera barbería
          </button>
        </div>
      )}
    </div>
  );
}
