import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import BarberSidebar from "../components/barber/BarberSidebar";

import { BarberProvider } from "../context/BarberContext";
import { WizardProvider } from "../context/WizardContext";
import { BuilderProvider } from "../context/BuilderContext";

import { useAuth } from "../auth/AuthContext";
import api from "../api/api";

/* ============================================================
   TOPBAR PROFESIONAL ULTRA CLEAN
============================================================ */
function Topbar({ toggleSidebar }) {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const match = location.pathname.match(/(\d+)/);
  const siteId = match ? match[1] : null;

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      login(null);
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const goPreview = () => {
    if (!siteId) return;
    navigate(`/barber/preview/${siteId}`);
  };

  return (
    <header className="
      h-16
      border-b border-white/10
      backdrop-blur-md
      bg-black/60
      flex items-center justify-between
      px-6
      shrink-0
    ">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="
            bg-white/5
            hover:bg-white/10
            border border-white/10
            px-3 py-2
            rounded-lg
            transition
          "
        >
          ☰
        </button>

        <h1 className="font-bold text-lg tracking-wide text-yellow-400">
          Panel profesional barbería
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        <div className="
          flex items-center gap-3
          bg-white/5
          border border-white/10
          px-3 py-1.5
          rounded-xl
        ">
          <img
            src={user?.avatar_url || "https://i.imgur.com/6VBx3io.png"}
            className="w-8 h-8 rounded-full border border-white/20"
          />
          <span className="text-sm text-white/90">
            {user?.username}
          </span>
        </div>

        <button
          onClick={goPreview}
          className="
            bg-yellow-500
            hover:bg-yellow-400
            text-black
            px-4 py-2
            rounded-xl
            font-semibold
            transition
            active:scale-95
          "
        >
          🚀 Ver web
        </button>

        <button
          onClick={logout}
          className="
            bg-red-600
            hover:bg-red-700
            px-4 py-2
            rounded-xl
            transition
            active:scale-95
          "
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   LAYOUT PRINCIPAL PRO
============================================================ */
export default function BarberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BarberProvider>
      <WizardProvider>
        <BuilderProvider>

          {/* FONDO GLOBAL UNIFICADO */}
          <div className="
            h-screen
            w-full
            flex
            text-white
            overflow-hidden
            bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#0b1220_50%,_#05070f_100%)]
            relative
          ">

            {/* OVERLAY PARA MÓVIL CUANDO EL SIDEBAR ESTÁ ABIERTO */}
            {sidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[50] lg:hidden"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}

            {/* SIDEBAR */}
            <div className={`
              fixed lg:relative
              top-0 left-0 h-full
              transition-transform duration-300 ease-in-out z-[60]
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0"}
              w-64 lg:w-auto shrink-0
            `}>
              <BarberSidebar />
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">

              <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

              {/* CONTENIDO CENTRAL */}
              <main className="flex-1 overflow-x-hidden overflow-y-auto relative bg-transparent scroll-smooth">
                <div className="w-full max-w-[1400px] mx-auto min-h-full">
                  <Outlet />
                </div>
              </main>

            </div>

          </div>

        </BuilderProvider>
      </WizardProvider>
    </BarberProvider>
  );
}