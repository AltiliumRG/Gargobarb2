import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Home from "../pages/client/Home";
import AboutUs from "../pages/client/AboutUs";
import Support from "../pages/client/Support";
import ContactUs from "../pages/client/ContactUs";
import MyBarbershop from "../pages/client/MyBarbershop";
import Settings from "../pages/client/Settings";
import Faqs from "../pages/client/Faqs";

const ClientLayout = () => {
  const { theme } = useTheme();
  const isClassic = theme === "classic";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 bg-cover bg-center bg-fixed relative ${isClassic ? "text-white" : "text-[#1C1C1C]"}`}
      style={{ backgroundImage: `url('/barber-shop-background-zwpfeo9qfr3kalod.jpg')` }}
    >
      <div className={`absolute inset-0 z-0 ${isClassic ? "bg-[#0F0F0F]/85" : "bg-[#F8F6F2]/85"} backdrop-blur-sm pointer-events-none`}></div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="support" element={<Support />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="my-barbershop" element={<MyBarbershop />} />
          <Route path="settings" element={<Settings />} />
          <Route path="faqs" element={<Faqs />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="home" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default ClientLayout;
