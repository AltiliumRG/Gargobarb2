import { useLocation, Outlet } from "react-router-dom";
import { useState } from "react";
import BarberSidebar from "../components/barber/BarberSidebar";

import { BarberProvider } from "../context/BarberContext";
import { WizardProvider } from "../context/WizardContext";
import { BuilderProvider, useBuilder } from "../context/BuilderContext";
import { useAuth } from "../auth/AuthContext";
import { handleVerWeb as verWebAction } from "../features/ver-web/verWebHandler";
import { Menu, Eye, Bell } from "lucide-react";

/* ============================================================
   TOPBAR PROFESIONAL VIBRANTE (RESPONSIVE)
============================================================ */
function Topbar({ toggleSidebar }) {
  const { user } = useAuth();
  const location = useLocation();
  const { site, pages } = useBuilder();

  const match = location.pathname.match(/(\d+)/);
  const siteId = match ? match[1] : null;

  const handleVerWeb = () => {
    verWebAction(site, pages);
  };

  return (
    <header className="relative h-[68px] flex items-center justify-between px-4 sm:px-6 shrink-0 z-40
      bg-[#060910]/90 backdrop-blur-xl
      border-b border-yellow-500/10
      shadow-[0_4px_40px_rgba(0,0,0,0.5)]
    ">
      {/* Línea accent amarilla en la parte superior */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500/70 to-transparent" />

      {/* LEFT */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-yellow-500/30 transition-all text-white active:scale-95"
          aria-label="Abrir menú"
        >
          <Menu size={20} />
        </button>

        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">Panel</span>
          <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
            Profesional <span className="text-yellow-500">Barbería</span>
          </h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Notificaciones (placeholder visual) */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/[0.08] hover:border-yellow-500/30 hover:bg-white/[0.08] transition-all text-gray-400 hover:text-yellow-400">
          <Bell size={17} />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(250,204,21,0.8)] border border-[#060910]" />
        </button>

        {/* Botón Ver Web — compañero conecta la lógica */}
        <button
          onClick={handleVerWeb}
          disabled={!siteId}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300
            border border-yellow-500/60
            bg-gradient-to-r from-yellow-500/20 to-amber-500/10
            text-yellow-400
            hover:from-yellow-500 hover:to-amber-400 hover:text-black hover:border-transparent
            hover:shadow-[0_0_24px_rgba(250,204,21,0.45)]
            active:scale-95
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Eye size={16} className="transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:inline">Ver Web</span>
        </button>

        {/* Avatar + nombre */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-yellow-500/20 transition-all">
          <div className="relative">
            <img
              src={user?.avatar_url || "https://i.imgur.com/6VBx3io.png"}
              className="w-8 h-8 rounded-lg border border-yellow-500/20 object-cover"
              alt="Avatar"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#060910] shadow-[0_0_6px_rgba(74,222,128,0.7)]" />
          </div>
          <span className="text-sm font-semibold text-white/90 hidden md:block max-w-[120px] truncate">
            {user?.username}
          </span>
        </div>

      </div>
    </header>
  );
}

/* ============================================================
   LAYOUT PRINCIPAL PRO (RESPONSIVE)
============================================================ */
export default function BarberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BarberProvider>
      <WizardProvider>
        <BuilderProvider>

          <div className="h-screen w-full flex text-white overflow-hidden bg-[#06080e] relative">

            {/* Radial glow de fondo */}
            <div className="pointer-events-none fixed inset-0 z-0">
              <div className="absolute top-0 left-0 w-[600px] h-[400px] bg-yellow-500/[0.03] blur-[120px] rounded-full" />
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/[0.04] blur-[140px] rounded-full" />
            </div>

            {/* OVERLAY MÓVIL */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[55] lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* SIDEBAR */}
            <div className={`
              fixed lg:static top-0 left-0 h-full
              transition-transform duration-300 ease-out
              z-[60] shrink-0
              ${sidebarOpen ? "translate-x-0 shadow-[8px_0_60px_rgba(0,0,0,0.7)]" : "-translate-x-full lg:translate-x-0"}
              w-64
            `}>
              <BarberSidebar />
            </div>

            {/* CONTENIDO */}
            <div className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative z-10">

              <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

              <main className="flex-1 overflow-x-hidden overflow-y-auto scroll-smooth custom-scroll">
                <div className="w-full max-w-[1600px] mx-auto min-h-full flex flex-col">
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