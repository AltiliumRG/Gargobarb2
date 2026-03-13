import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBarbershopById } from "../../api/barber.api";
import api from "../../api/api"; // 🔥 usamos instancia con withCredentials
import {
  Layout,
  Calendar,
  Settings,
  Eye,
  Edit3
} from "lucide-react";
import toast from "react-hot-toast";



export default function Dashboard() {
  const { barbershopId } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================
     CARGAR BARBERÍA
  ============================ */
  useEffect(() => {
    if (!barbershopId) return;

    setLoading(true);

    getBarbershopById(barbershopId)
      .then((res) => {
        setShop(res.data);
      })
      .catch((err) => {
        console.error("Error cargando barbería:", err);
        toast.error("No se pudo cargar la barbería");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [barbershopId]);

  /* ============================
     CARGAR ESTADÍSTICAS
  ============================ */
  useEffect(() => {
    if (!barbershopId) return;

    const loadStats = async () => {
      try {
        const res = await api.get(
          `/appointments/stats/${barbershopId}`
        );

        setStats(res.data);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);

        if (err.response?.status === 401) {
          toast.error("Sesión expirada, vuelve a iniciar sesión");
        }
      }
    };

    loadStats();
  }, [barbershopId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  /* ============================
     CARDS DE ACCESO RÁPIDO
  ============================ */
  const cards = [
    {
      title: "Editor de Sitio",
      desc: "Personaliza la apariencia y bloques de tu web.",
      icon: <Layout className="text-blue-400" />,
      action: () => navigate(`/barber/builder/${barbershopId}`),
      color: "border-blue-500/20 hover:border-blue-500/50"
    },
    {
      title: "Horarios",
      desc: "Configura tus horas de apertura y cierre.",
      icon: <Calendar className="text-green-400" />,
      action: () =>
        navigate(`/barber/dashboard/${barbershopId}/schedule`),
      color: "border-green-500/20 hover:border-green-500/50"
    },
    {
      title: "Vista Previa",
      desc: "Mira cómo ven tus clientes tu barbería.",
      icon: <Eye className="text-yellow-400" />,
      action: () =>
        navigate(`/barber/preview/${shop?.site?.id || 0}`),
      color: "border-yellow-500/20 hover:border-yellow-500/50"
    },
    {
      title: "Configuración",
      desc: "Edita información básica de la barbería.",
      icon: <Settings className="text-purple-400" />,
      action: () => toast.success("Próximamente..."),
      color: "border-purple-500/20 hover:border-purple-500/50"
    },
    {
      title: "Gestión de Citas",
      desc: "Administra reservas, estados e ingresos.",
      icon: <Calendar className="text-red-400" />,
      action: () =>
        navigate(`/barber/dashboard/${barbershopId}/appointments`),
      color: "border-red-500/20 hover:border-red-500/50"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          {shop?.name}
        </h1>
        <p className="text-gray-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Panel Administrativo
        </p>
      </header>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {cards.map((card, i) => (
          <button
            key={i}
            onClick={card.action}
            className={`bg-zinc-900/40 backdrop-blur-md border ${card.color} p-6 rounded-2xl text-left transition-all group hover:scale-[1.02] shadow-xl`}
          >
            <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
              {card.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {card.title}
            </h3>
            <p className="text-gray-400 text-sm">
              {card.desc}
            </p>
          </button>
        ))}
      </div>

      {/* ESTADÍSTICAS */}
      <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
          <Edit3 size={20} className="text-yellow-500" />
          Resumen de Actividad
        </h3>

        {stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard label="Total Citas" value={stats.totalAppointments} />
            <StatCard label="Citas Hoy" value={stats.todayAppointments} />
            <StatCard
              label="Pendientes"
              value={stats.pendingAppointments}
              highlight="text-yellow-400"
            />
            <StatCard
              label="Ingresos del Mes"
              value={`$${stats.monthlyRevenue}`}
              highlight="text-green-400"
            />

          </div>
        ) : (
          <p className="text-gray-500">Cargando estadísticas...</p>
        )}
      </div>
    </div>
  );
}

/* ============================
   COMPONENTE CARD
============================ */
function StatCard({ label, value, highlight }) {
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <p className="text-gray-400 text-sm">{label}</p>
      <h2 className={`text-3xl font-black mt-2 ${highlight || ""}`}>
        {value}
      </h2>
    </div>
  );
}