import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function BarberSidebar() {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3.5 rounded-[12px] font-semibold transition-all duration-300 ${
      isActive
        ? "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-[0_4px_20px_rgba(250,204,21,0.3)] shadow-yellow-500/20 translate-x-1"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="w-64 h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col relative z-[60] overflow-y-auto">
      
      {/* 🎯 HEADER CON LOGO ILLUMINADO */}
      <div className="p-6 border-b border-white/[0.04] flex items-center gap-4 group">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full group-hover:bg-yellow-500/40 transition-colors"></div>
          <img 
            src="/GargobarbLogo.png" 
            alt="GargoBarb" 
            className="w-14 h-14 object-contain relative z-10 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>
        <div>
          <h1 className="text-xl font-black bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent uppercase tracking-wider drop-shadow-md">
            GargoBarb
          </h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-black mt-0.5">Panel Barbero</p>
        </div>
      </div>

      {/* 👤 PERFIL PROFESIONAL */}
      <div className="p-6 border-b border-white/[0.04] flex items-center gap-4">
        {user?.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            className="w-12 h-12 rounded-full border-2 border-yellow-500/50 p-0.5 object-cover shrink-0 shadow-[0_0_15px_rgba(250,204,21,0.15)]"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-2 border-gray-600 bg-gray-800 text-gray-300 flex items-center justify-center font-bold text-lg shrink-0">
            {getInitials(user?.username)}
          </div>
        )}
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate leading-tight">{user?.username}</p>
          <p className="text-xs text-yellow-500/70 truncate mt-0.5">{user?.email}</p>
        </div>
      </div>

      {/* 🧭 NAVEGACIÓN */}
      <nav className="flex-1 p-5 space-y-2">
        <NavLink to="/barber" end className={navLinkClass}>
          <span className="text-xl w-6 text-center">🏠</span> 
          <span>Inicio</span>
        </NavLink>

        <NavLink to="/barber/my" className={navLinkClass}>
          <span className="text-xl w-6 text-center">💈</span> 
          <span>Mis barberías</span>
        </NavLink>

        <NavLink to="/barber/create" className={navLinkClass}>
          <span className="text-xl w-6 text-center">➕</span> 
          <span>Crear barbería</span>
        </NavLink>
      </nav>

      {/* 🚪 LOGOUT */}
      <div className="p-5 mt-auto">
        <button
          onClick={logout}
          className="w-full flex justify-center items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white py-3.5 rounded-xl font-bold transition-all shadow-[0_4px_15px_rgba(220,38,38,0.25)] hover:shadow-[0_4px_25px_rgba(220,38,38,0.4)] active:scale-95"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
