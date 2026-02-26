import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Home from "../pages/client/Home";
import AboutUs from "../pages/client/AboutUs";
import Support from "../pages/client/Support";
import ContactUs from "../pages/client/ContactUs";
import Settings from "../pages/client/Settings";

const ClientLayout = () => {
  const { theme } = useTheme();
  const isClassic = theme === "classic";

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isClassic ? "bg-[#0F0F0F] text-white" : "bg-[#F8F6F2] text-[#1C1C1C]"
      }`}>
      <Routes>
        <Route path="home" element={<Home />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="support" element={<Support />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="settings" element={<Settings />} />
        <Route path="barbershop/:id" element={<div>Detalle de Barbería (Próximamente)</div>} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="home" replace />} />
      </Routes>
    </div>
  );
};

export default ClientLayout;
