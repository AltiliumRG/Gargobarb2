import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Clock, BarChart3, Settings } from "lucide-react";

export default function BarberWorkspaceLayout() {
  const { barbershopId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      label: "Resumen",
      icon: LayoutDashboard,
      path: `/barber/dashboard/${barbershopId}`,
      color: "text-blue-400",
    },
    {
      label: "Citas",
      icon: Calendar,
      path: `/barber/dashboard/${barbershopId}/appointments`,
      color: "text-purple-400",
    },
    {
      label: "Horarios",
      icon: Clock,
      path: `/barber/dashboard/${barbershopId}/schedule`,
      color: "text-cyan-400",
    },
    {
      label: "Estadísticas",
      icon: BarChart3,
      path: `/barber/dashboard/${barbershopId}/stats`,
      color: "text-green-400",
    },
    {
      label: "Configuración",
      icon: Settings,
      path: `/barber/dashboard/${barbershopId}/settings`,
      color: "text-orange-400",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex flex-col lg:flex-row min-h-full text-white">

      {/* ========================================================
          TABS MÓVIL (horizontal scrollable)
      ======================================================== */}
      <div className="lg:hidden w-full shrink-0 sticky top-0 z-30 bg-[#060910]/95 backdrop-blur-xl border-b border-yellow-500/10">
        <div className="overflow-x-auto custom-scroll">
          <nav className="flex items-center px-3 py-3 gap-2 w-max">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${
                    active
                      ? "bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border-yellow-500/50 text-yellow-400 shadow-[0_0_16px_rgba(250,204,21,0.2)]"
                      : "bg-white/[0.03] border-white/[0.08] text-gray-500 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full" />
                  )}
                  <Icon size={16} className={active ? "text-yellow-400" : item.color} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ========================================================
          SIDEBAR ESCRITORIO (segundo nivel)
      ======================================================== */}
      <aside className="hidden lg:flex w-60 bg-[#07090f] border-r border-white/[0.05] flex-col py-6 shrink-0">
        <p className="px-5 mb-3 text-[9px] text-gray-600 font-black uppercase tracking-[0.25em]">
          Administración
        </p>

        <nav className="flex-1 px-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative w-full flex items-center gap-3 py-3 rounded-xl transition-all duration-300 font-semibold text-sm overflow-hidden
                  border-l-2 pl-[14px] pr-4
                  ${
                    active
                      ? "bg-gradient-to-r from-yellow-500/12 to-transparent text-yellow-400 border-yellow-500"
                      : "text-gray-500 hover:text-white hover:bg-white/[0.05] border-transparent"
                  }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 transition-all ${
                    active
                      ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]"
                      : `${item.color} opacity-60`
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.9)] shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ========================================================
          CONTENIDO DINÁMICO
      ======================================================== */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 min-w-0">
        <Outlet />
      </main>

    </div>
  );
}