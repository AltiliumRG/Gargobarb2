import { Outlet, useParams, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Clock, BarChart3, Settings } from "lucide-react";

export default function BarberWorkspaceLayout() {
  const { barbershopId } = useParams();
  const navigate = useNavigate();

  const menu = [
    {
      label: "Resumen",
      icon: <LayoutDashboard size={18} />,
      path: `/barber/dashboard/${barbershopId}`,
    },
    {
      label: "Citas",
      icon: <Calendar size={18} />,
      path: `/barber/dashboard/${barbershopId}/appointments`,
    },
    {
      label: "Horarios",
      icon: <Clock size={18} />,
      path: `/barber/dashboard/${barbershopId}/schedule`,
    },
    {
      label: "Estadísticas",
      icon: <BarChart3 size={18} />,
      path: `/barber/dashboard/${barbershopId}/stats`,
    },
    {
      label: "Configuración",
      icon: <Settings size={18} />,
      path: `/barber/dashboard/${barbershopId}/settings`,
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#0b1220] text-white">

      {/* SIDEBAR INTERNO */}
      <aside className="w-64 bg-black/40 border-r border-white/10 p-6 space-y-6">
        <h2 className="text-xl font-black tracking-tight">
          Panel Administrativo
        </h2>

        <nav className="space-y-2">
          {menu.map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO DINÁMICO */}
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}