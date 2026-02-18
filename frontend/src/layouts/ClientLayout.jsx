import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/client/Home";

const ClientLayout = () => {
  return (
    <Routes>
      {/* 👉 Por defecto redirige al Home */}
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<Home />} />
      <Route path="barbershop/:id" element={<div>Detalle de Barbería (Próximamente)</div>} />
      {/* Cualquier ruta desconocida también lleva al Home */}
      <Route path="*" element={<Navigate to="home" replace />} />
    </Routes>
  );
};

export default ClientLayout;
