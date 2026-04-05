// frontend/src/pages/barber/Builder.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BuilderProvider, useBuilder } from "../../context/BuilderContext";
import { getSiteByBarbershop } from "../../api/site.api";
import { useAuth } from "../../auth/AuthContext";

import Canvas from "../../components/builder/Canvas";
import Toolbar from "../../components/builder/Toolbar";
import PropertiesPanel from "../../components/builder/PropertiesPanel";

import { useBarber, BarberProvider } from "../../context/BarberContext";

/* ============================================================
   CONTENIDO INTERNO
============================================================ */
function BuilderContent() {
  const { barbershopId } = useParams();
  const { loadSite } = useBuilder();
  const { user, loading } = useAuth();

  const [loadingPage, setLoadingPage] = useState(true);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const { setActiveBarbershop } = useBarber();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setLoadingPage(false);
      return;
    }
    const fetchSite = async () => {
      try {
        const res = await getSiteByBarbershop(barbershopId);


        loadSite({
          site: res.data.site,
          pages: res.data.pages,
        });

      } catch (err) {
        console.error("❌ Error cargando sitio:", err);
      } finally {
        setLoadingPage(false);
      }
    };
    setActiveBarbershop({ id: Number(barbershopId) });
    fetchSite();
  }, [barbershopId, user, loading]);

  if (loading || loadingPage) {
    return (
      <div className="h-screen w-full bg-[#0b0f14]" />
    );
  }

  return (
    <div className="h-[calc(100vh-68px)] w-full flex bg-[#060910] overflow-hidden relative">

      {/* ================= MODAL BACKDROP (Mobile only) ================= */}
      {!loadingPage && (leftOpen || rightOpen) && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => {
            setLeftOpen(false);
            setRightOpen(false);
          }}
        />
      )}

      {/* ================= LEFT PANEL (Toolbar) ================= */}
      <aside
        className={`
          fixed md:relative top-0 left-0 h-full z-40
          flex flex-col
          transition-all duration-500 ease-in-out
          ${leftOpen ? "w-[320px] translate-x-0" : "w-[60px] -translate-x-full md:translate-x-0"}
          border-r border-white/5
          bg-[#0f141a]/95 backdrop-blur-xl
        `}
      >
        {/* TOGGLE */}
        <button
          onClick={() => setLeftOpen(!leftOpen)}
          className="
            absolute -right-3 top-20 md:top-6
            bg-yellow-500/80 hover:bg-yellow-500 border border-yellow-400/50
            w-6 h-6 rounded-full
            flex items-center justify-center
            text-black text-[10px] hover:scale-110
            transition z-50 shadow-lg shadow-yellow-500/10
          "
        >
          {leftOpen ? "◀" : "▶"}
        </button>

        {/* SCROLL INTERNO */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className={`
            h-full p-2
            transition-opacity duration-300
            ${!leftOpen && "opacity-0 pointer-events-none"}
          `}>
            <Toolbar />
          </div>
        </div>
      </aside>

      {/* ================= CANVAS (Center) ================= */}
      <main className="flex-1 h-full overflow-y-auto relative z-10 bg-[#060910] custom-scroll">
         <Canvas />
      </main>

      {/* ================= RIGHT PANEL (Properties) ================= */}
      <aside
        className={`
          fixed md:relative top-0 right-0 h-full z-40
          flex flex-col
          transition-all duration-500 ease-in-out
          ${rightOpen ? "w-full sm:w-[380px] translate-x-0" : "w-[60px] translate-x-full md:translate-x-0"}
          border-l border-white/5
          bg-[#0f141a]/95 backdrop-blur-xl
        `}
      >
        {/* TOGGLE */}
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="
            absolute -left-3 top-20 md:top-6
            bg-yellow-500/80 hover:bg-yellow-500 border border-yellow-400/50
            w-6 h-6 rounded-full
            flex items-center justify-center
            text-black text-[10px] hover:scale-110
            transition z-50 shadow-lg shadow-yellow-500/10
          "
        >
          {rightOpen ? "▶" : "◀"}
        </button>

        {/* SCROLL INTERNO */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className={`
            h-full p-2
            transition-opacity duration-300
            ${!rightOpen && "opacity-0 pointer-events-none"}
          `}>
            <PropertiesPanel />
          </div>
        </div>
      </aside>

    </div>
  );
}

/* ============================================================
   EXPORT PRINCIPAL (Ya envuelto en layout)
============================================================ */
export default function Builder() {
  return <BuilderContent />;
}