import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
import { useTheme } from "../context/ThemeContext";
>>>>>>> Stashed changes
import Home from "../pages/client/Home";

const ClientLayout = () => {
  return (
<<<<<<< Updated upstream
=======
    <div className={`min-h-screen transition-colors duration-500 ${isClassic ? "bg-[#0F0F0F] text-white" : "bg-[#F8F6F2] text-[#1C1C1C]"
      }`}>
      <Routes>
        {/* Páginas informativas */}
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="Support" element={<Support />} />
        <Route path="settings" element={<Settings />} />

        {/* 👉 Por defecto redirige al Home */}
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="barbershop/:id" element={<div>Detalle de Barbería (Próximamente)</div>} />
        {/* Cualquier ruta desconocida también lleva al Home */}
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
=======
import Home from "../pages/client/Home";

const ClientLayout = () => {
  return (
>>>>>>> Stashed changes
    <Routes>
      {/* 👉 Por defecto redirige al Home */}
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<Home />} />
      <Route path="barbershop/:id" element={<div>Detalle de Barbería (Próximamente)</div>} />
      {/* Cualquier ruta desconocida también lleva al Home */}
      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
<<<<<<< Updated upstream
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
  );
};

export default ClientLayout;
