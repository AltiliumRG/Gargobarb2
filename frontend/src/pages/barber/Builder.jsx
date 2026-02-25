// frontend/src/pages/barber/Builder.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BuilderProvider, useBuilder } from "../../context/BuilderContext";
import { getSiteByBarbershop } from "../../api/site.api";
import { useAuth } from "../../auth/AuthContext";

import Canvas from "../../components/builder/Canvas";
import Toolbar from "../../components/builder/Toolbar";
import PropertiesPanel from "../../components/builder/PropertiesPanel";
import TopbarBuilder from "../../components/builder/TopbarBuilder";


//gei el que lo lea 

/* ============================================================
   CONTENIDO INTERNO
============================================================ */
function BuilderContent() {
  const { barbershopId } = useParams();
  const { loadSite } = useBuilder();
  const { user, loading } = useAuth();

  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    // ⛔ esperar auth
    if (loading) return;

    // ⛔ si no hay sesión → no pedir nada
    if (!user) {
      console.log("❌ SIN SESIÓN — no cargar builder");
      setLoadingPage(false);
      return;
    }

    const fetchSite = async () => {
      try {
        const res = await getSiteByBarbershop(barbershopId);
        window.__SITE_DEBUG__ = res.data;
        loadSite({
          site: res.data,
          pages: res.data.pages,
        });

        console.log("🟢 BUILDER CARGADO");
      } catch (err) {
        console.error("❌ Error cargando sitio:", err);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchSite();
  }, [barbershopId, user, loading]);

  if (loading || loadingPage) {
    return (
      <div className="flex h-screen bg-gray-950 text-white overflow-hidden"> 
      </div>
    );
  }

 return (
  <div className="h-screen flex flex-col bg-[#0b0f14]">

    {/* TOPBAR */}
    <TopbarBuilder />

    {/* BODY */}
    <div className="flex flex-1 overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-72 border-r border-gray-800 bg-[#0f141a]">
        <Toolbar />
      </div>

      {/* CANVAS */}
      <div className="flex-1 overflow-auto bg-[#0b0f14]">
        <Canvas />
      </div>

      {/* EDITOR */}
      <div className="w-80 border-l border-gray-800 bg-[#0f141a]">
        <PropertiesPanel />
      </div>

    </div>
  </div>
);

}

/* ============================================================
   PROVIDER PRINCIPAL
============================================================ */
export default function Builder() {
  return (
    <BuilderProvider>
      <BuilderContent />
    </BuilderProvider>
  );
}
