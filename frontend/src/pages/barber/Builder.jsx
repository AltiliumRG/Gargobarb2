// frontend/src/pages/barber/Builder.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BuilderProvider, useBuilder } from "../../context/BuilderContext";
import { getSiteByBarbershop } from "../../api/site.api";
import { useAuth } from "../../auth/AuthContext";

import Canvas from "../../components/builder/Canvas";
import Toolbar from "../../components/builder/Toolbar";
import PropertiesPanel from "../../components/builder/PropertiesPanel";

import { useBarber } from "../../context/BarberContext";

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
    <div className="h-screen w-full flex bg-transparent overflow-hidden">

      {/* ================= LEFT PANEL ================= */}
      <aside
        className={`
          relative
          flex flex-col
          transition-all duration-300 ease-in-out
          ${leftOpen ? "w-[320px]" : "w-[60px]"}
          border-r border-gray-800
          bg-[#0f141a]
        `}
      >

        {/* TOGGLE */}
        <button
          onClick={() => setLeftOpen(!leftOpen)}
          className="
            absolute -right-3 top-6
            bg-gray-800 border border-gray-700
            w-6 h-6 rounded-full
            flex items-center justify-center
            text-xs hover:bg-gray-700
            transition z-20
          "
        >
          {leftOpen ? "◀" : "▶"}
        </button>

        {/* SCROLL INTERNO REAL */}
        <div className="flex-1 overflow-y-auto">
          <div className={`
            h-full
            transition-opacity duration-200
            ${!leftOpen && "opacity-0 pointer-events-none"}
          `}>
            <Toolbar />
          </div>
        </div>
      </aside>

      {/* ================= CANVAS ================= */}
      <main className="flex-1 h-full overflow-auto bg-transparent">
        <Canvas />
      </main>

      {/* ================= RIGHT PANEL ================= */}
      <aside
        className={`
          relative
          flex flex-col
          transition-all duration-300 ease-in-out
          ${rightOpen ? "w-[380px]" : "w-[60px]"}
          border-l border-gray-800
          bg-[#0f141a]
        `}
      >

        {/* TOGGLE */}
        <button
          onClick={() => setRightOpen(!rightOpen)}
          className="
            absolute -left-3 top-6
            bg-gray-800 border border-gray-700
            w-6 h-6 rounded-full
            flex items-center justify-center
            text-xs hover:bg-gray-700
            transition z-20
          "
        >
          {rightOpen ? "▶" : "◀"}
        </button>

        {/* SCROLL INTERNO REAL */}
        <div className="flex-1 overflow-y-auto">
          <div className={`
            h-full
            transition-opacity duration-200
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