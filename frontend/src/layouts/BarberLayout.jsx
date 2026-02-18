import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { useState } from "react";
import BarberSidebar from "../components/barber/BarberSidebar";

import { BarberProvider } from "../context/BarberContext";
import { WizardProvider } from "../context/WizardContext";
import { BuilderProvider } from "../context/BuilderContext";

import { useAuth } from "../auth/AuthContext";
import api from "../api/api";

// Pages
import BarberHome from "../pages/barber/BarberHome";
import MyBarbershops from "../pages/barber/MyBarbershops";
import CreateBarbershopWizard from "../pages/barber/CreateBarbershopWizard";
import Builder from "../pages/barber/Builder";
import Preview from "../pages/barber/Preview";

/* ============================================================
   HEADER PROFESIONAL
============================================================ */
function Topbar({ toggleSidebar }) {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // detectar id actual (builder o preview)
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
    if (!siteId) {
      alert("Primero entra al editor de una barbería");
      return;
    }
    navigate(`/barber/preview/${siteId}`);
  };

  return (
    <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0b0b0b]">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700"
        >
          ☰
        </button>

        <h1 className="font-bold text-lg text-yellow-400">
          Panel profesional barbería
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* usuario */}
        <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded">
          <img
            src={user?.avatar_url || "https://i.imgur.com/6VBx3io.png"}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm">{user?.username}</span>
        </div>

        {/* preview */}
        <button
          onClick={goPreview}
          className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400"
        >
          🚀 Ver web
        </button>

        {/* logout */}
        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}

/* ============================================================
   LAYOUT PRINCIPAL
============================================================ */
export default function BarberLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BarberProvider>
      <WizardProvider>
        <BuilderProvider>
          <div className="flex h-screen bg-[#070707] text-white overflow-hidden">

            {/* SIDEBAR */}
            {sidebarOpen && <BarberSidebar />}

            {/* CONTENIDO */}
            <div className="flex-1 flex flex-col">

              {/* HEADER */}
              <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

              {/* PAGE */}
              <main className="flex-1 overflow-auto p-6">
                <Routes>
                  <Route index element={<BarberHome />} />
                  <Route path="my" element={<MyBarbershops />} />
                  <Route path="create" element={<CreateBarbershopWizard />} />
                  <Route path="builder/:siteId" element={<Builder />} />
                  <Route path="preview/:siteId" element={<Preview />} />
                </Routes>
              </main>

            </div>
          </div>
        </BuilderProvider>
      </WizardProvider>
    </BarberProvider>
  );
}
