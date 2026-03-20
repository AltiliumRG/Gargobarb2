import { NavLink } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";

export default function BarberSidebar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition ${isActive
      ? "bg-yellow-500 text-black font-semibold"
      : "text-gray-300 hover:bg-gray-800"
    }`;

  return (
    <>
      {/* BTN MOBILE */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 bg-yellow-500 text-black px-3 py-2 rounded lg:hidden"
      >
        ☰
      </button>

      <aside
        className={`bg-[#0b0b0b] border-r border-gray-800 flex flex-col transition-all duration-300
        ${open ? "w-64" : "w-0 overflow-hidden"} lg:w-64`}
      >
        {/* LOGO */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <img src="/GargobarbLogo.png" alt="GargoBarb Logo" className="w-12 h-12 drop-shadow-[0_0_8px_#FFD700]" />
          <div>
            <h1 className="text-xl font-bold text-yellow-500 uppercase tracking-tight">GargoBarb</h1>
            <p className="text-xs text-gray-500">Panel barbero</p>
          </div>
        </div>

        {/* PERFIL */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-3">
          <img
            src={
              user?.avatar_url ||
              "https://ui-avatars.com/api/?name=" + user?.username
            }
            className="w-10 h-10 rounded-full border border-yellow-500"
          />
          <div>
            <p className="text-sm font-semibold">{user?.username}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/barber" end className={linkClass}>
            🏠 Inicio
          </NavLink>

          <NavLink to="/barber/my" className={linkClass}>
            💈 Mis barberías
          </NavLink>

          <NavLink to="/barber/create" className={linkClass}>
            ➕ Crear barbería
          </NavLink>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
