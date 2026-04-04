import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Home, Scissors, PlusCircle, LogOut, Zap } from "lucide-react";

export default function BarberSidebar() {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { to: "/barber", end: true, icon: Home, label: "Inicio" },
    { to: "/barber/my", icon: Scissors, label: "Mis barberías" },
    { to: "/barber/create", icon: PlusCircle, label: "Nueva barbería" },
  ];

  const navLinkClass = ({ isActive }) =>
    `group relative flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
      isActive
        ? "bg-gradient-to-r from-yellow-500 to-amber-400 text-black shadow-[0_0_24px_rgba(250,204,21,0.45)] scale-[1.02]"
        : "text-gray-400 hover:text-white hover:bg-white/8"
    }`;

  return (
    <aside className="w-64 h-full flex flex-col bg-[#070a10] border-r border-yellow-500/10 shadow-[4px_0_40px_rgba(0,0,0,0.6)] overflow-y-auto">

      {/* ─── HEADER ─── */}
      <div className="relative px-6 py-5 border-b border-white/[0.06] flex items-center gap-3 overflow-hidden shrink-0">
        {/* Ambient glow */}
        <div className="absolute -top-6 -left-6 w-28 h-28 bg-yellow-500/15 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-[0_0_20px_rgba(250,204,21,0.5)] shrink-0">
          <Zap size={20} className="text-black fill-black" />
        </div>

        <div className="relative z-10">
          <h1 className="text-lg font-black tracking-wide text-white uppercase">
            GargoBarb
          </h1>
          <p className="text-[9px] text-yellow-500/60 uppercase tracking-[0.2em] font-bold leading-tight">
            Panel Barbero
          </p>
        </div>
      </div>

      {/* ─── PERFIL ─── */}
      <div className="mx-3 mt-4 px-4 py-3 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.07] flex items-center gap-3 shrink-0">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            className="w-10 h-10 rounded-xl border border-yellow-500/30 object-cover shrink-0 shadow-[0_0_12px_rgba(250,204,21,0.2)]"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center font-black text-sm shrink-0">
            {getInitials(user?.username)}
          </div>
        )}
        <div className="overflow-hidden flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{user?.username || "Barbero"}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-pulse shrink-0" />
            <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* ─── LABEL SECCIÓN ─── */}
      <p className="px-6 pt-6 pb-2 text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
        Navegación
      </p>

      {/* ─── NAV ─── */}
      <nav className="flex-1 px-3 space-y-1.5">
        {navItems.map(({ to, end, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            {({ isActive }) => (
              <>
                {/* Shimmer en activo */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-60 pointer-events-none" />
                )}
                <Icon
                  size={19}
                  className={`relative z-10 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                />
                <span className="relative z-10 text-sm">{label}</span>
                {/* Dot indicador inactivo */}
                {!isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-yellow-500/50 transition-colors shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ─── LOGOUT ─── */}
      <div className="p-4 mt-auto border-t border-white/[0.06] shrink-0">
        <button
          onClick={logout}
          className="w-full group flex justify-center items-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all duration-300
            bg-red-500/8 border border-red-500/20 text-red-400
            hover:bg-red-500 hover:text-white hover:border-transparent hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]
            active:scale-95"
        >
          <LogOut size={17} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
