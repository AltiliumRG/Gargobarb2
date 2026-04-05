// src/layouts/AdminLayout.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

// importa usando los nombres exactos de tus archivos (ver tu screenshot)
import Dashboard from "../pages/admin/Dashboard";
import ManageAppointments from "../pages/admin/ManageAppointments";
import ManageBarbers from "../pages/admin/ManageBarbers";
import ManageBarbershops from "../pages/admin/ManageBarbershops";
import ManageClients from "../pages/admin/ManageClients";
import ManageServices from "../pages/admin/ManageServices";
import ManageUsers from "../pages/admin/ManageUsers";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(true); // control de sidebar
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const location = useLocation();

  // Mantener abierto en pantallas md+ y permitir toggle en móvil
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen((s) => !s);

  return (
    <div className="flex h-screen text-white bg-gradient-to-b from-black via-gray-950 to-gray-900">
      {/* Sidebar recibe isOpen e isDesktop */}
      <AdminSidebar isOpen={isOpen} isDesktop={isDesktop} toggleSidebar={toggleSidebar} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Mobile Header */}
        {!isDesktop && (
          <header className="h-16 flex items-center px-6 bg-black/50 backdrop-blur-md border-b border-zinc-800/50">
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-lg bg-amber-500 text-black shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="ml-4 font-bold text-lg text-zinc-100 uppercase tracking-widest">GargoBarb Admin</h2>
          </header>
        )}

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-tr from-gray-950 via-gray-900 to-black">
          <Routes key={location.pathname}>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="manage-appointments" element={<ManageAppointments />} />
            <Route path="manage-barbers" element={<ManageBarbers />} />
            <Route path="manage-barbershops" element={<ManageBarbershops />} />
            <Route path="manage-clients" element={<ManageClients />} />
            <Route path="manage-services" element={<ManageServices />} />
            <Route path="manage-users" element={<ManageUsers />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
