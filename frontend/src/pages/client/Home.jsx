import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Settings, HelpCircle, Info, Phone } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
import { useTheme } from "../../context/ThemeContext";
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
import api from "../../api/api";

const Home = () => {
  const { user, logout } = useAuth();
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
  const { theme } = useTheme();
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
  const navigate = useNavigate();
  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);

<<<<<<< Updated upstream
  // ======================================
  // ✅ 1. CARGAR BARBERÍAS CON SESIÓN ACTIVA
  // ======================================
=======
<<<<<<< HEAD
  const isClassic = theme === "classic";

=======
  // ======================================
  // ✅ 1. CARGAR BARBERÍAS CON SESIÓN ACTIVA
  // ======================================
>>>>>>> origin/David
>>>>>>> Stashed changes
  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        const res = await api.get("/barbershops", {
          withCredentials: true,
        });
<<<<<<< Updated upstream
        console.log("📥 Barbershops loaded:", res.data);
=======
<<<<<<< HEAD
=======
        console.log("📥 Barbershops loaded:", res.data);
>>>>>>> origin/David
>>>>>>> Stashed changes
        setBarbershops(res.data);
      } catch (err) {
        console.error("❌ Error al obtener barberías:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbershops();
  }, []);

<<<<<<< Updated upstream
  // ======================================
  // ⏳ LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300 bg-black">
        <p className="animate-pulse">Cargando barberías...</p>
=======
<<<<<<< HEAD
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isClassic ? "text-gray-300 bg-[#0F0F0F]" : "text-gray-500 bg-[#F8F6F2]"
        }`}>
        <p className="animate-pulse font-medium">Cargando barberías...</p>
=======
  // ======================================
  // ⏳ LOADING
  // ======================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-300 bg-black">
        <p className="animate-pulse">Cargando barberías...</p>
>>>>>>> origin/David
>>>>>>> Stashed changes
      </div>
    );
  }

<<<<<<< Updated upstream
  // ======================================
  // 🏠 HOME UI
  // ======================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
=======
<<<<<<< HEAD
  return (
    <div className={`min-h-screen transition-colors duration-500 ${isClassic ? "text-white" : "text-[#1C1C1C]"
      }`}>
=======
  // ======================================
  // 🏠 HOME UI
  // ======================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-900 text-white">
>>>>>>> origin/David
>>>>>>> Stashed changes

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
<<<<<<< Updated upstream
        className="bg-gray-900/80 backdrop-blur-md border-b border-yellow-500/30 px-6 py-4 flex justify-between items-center sticky top-0 z-50"
      >
        <motion.h1
          className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent cursor-pointer"
=======
<<<<<<< HEAD
        className={`px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${isClassic
            ? "bg-[#0b0b0b]/80 border-[#D4AF37]/30"
            : "bg-white/80 border-gray-200 shadow-sm"
          }`}
      >
        <motion.h1
          className={`text-2xl font-bold bg-gradient-to-r ${isClassic ? "from-[#D4AF37] to-[#B8860B]" : "from-[#C6A75E] to-[#A8842F]"
            } bg-clip-text text-transparent cursor-pointer`}
=======
        className="bg-gray-900/80 backdrop-blur-md border-b border-yellow-500/30 px-6 py-4 flex justify-between items-center sticky top-0 z-50"
      >
        <motion.h1
          className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent cursor-pointer"
>>>>>>> origin/David
>>>>>>> Stashed changes
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/client/home")}
        >
          GargoBarb 💈
        </motion.h1>

        <div className="flex items-center gap-6 text-sm">
<<<<<<< Updated upstream
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
=======
<<<<<<< HEAD
          <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/about-us")}>
>>>>>>> Stashed changes
            <Info size={16} /> Sobre Nosotros
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <HelpCircle size={16} /> Soporte
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <Phone size={16} /> Contacto
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <Settings size={16} /> Configuración
          </button>

<<<<<<< Updated upstream
          <div className="border-l border-yellow-500/30 pl-4 flex items-center gap-3">
            <span className="text-gray-300 font-medium">
=======
          <div className={`border-l pl-4 flex items-center gap-3 ${isClassic ? "border-[#D4AF37]/30" : "border-gray-200"}`}>
            <span className={`font-medium ${isClassic ? "text-gray-300" : "text-gray-700"}`}>
=======
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <Info size={16} /> Sobre Nosotros
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <HelpCircle size={16} /> Soporte
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <Phone size={16} /> Contacto
          </button>
          <button className="hover:text-yellow-400 transition flex items-center gap-1">
            <Settings size={16} /> Configuración
          </button>

          <div className="border-l border-yellow-500/30 pl-4 flex items-center gap-3">
            <span className="text-gray-300 font-medium">
>>>>>>> origin/David
>>>>>>> Stashed changes
              {user?.full_name || "Invitado"}
            </span>

            <motion.button
              onClick={logout}
              whileTap={{ scale: 0.9 }}
<<<<<<< Updated upstream
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black px-3 py-1 rounded-md hover:shadow-yellow-500/30 transition"
=======
<<<<<<< HEAD
              className={`px-3 py-1 rounded-md transition shadow-sm ${isClassic
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black hover:shadow-[#D4AF37]/30"
                  : "bg-[#1C1C1C] text-white hover:bg-black"
                }`}
=======
              className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black px-3 py-1 rounded-md hover:shadow-yellow-500/30 transition"
>>>>>>> origin/David
>>>>>>> Stashed changes
            >
              <LogOut size={16} />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="px-6 py-10 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
<<<<<<< Updated upstream
          className="text-3xl font-semibold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
=======
<<<<<<< HEAD
          className={`text-3xl font-bold mb-8 text-center bg-gradient-to-r ${isClassic ? "from-[#D4AF37] to-[#B8860B]" : "from-[#1C1C1C] to-[#444444]"
            } bg-clip-text text-transparent uppercase tracking-tight`}
=======
          className="text-3xl font-semibold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
>>>>>>> origin/David
>>>>>>> Stashed changes
        >
          Barberías disponibles
        </motion.h2>

        {barbershops.length > 0 ? (
          <motion.div
<<<<<<< Updated upstream
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
=======
<<<<<<< HEAD
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
=======
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
>>>>>>> origin/David
>>>>>>> Stashed changes
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {barbershops.map((shop, index) => (
              <motion.div
                key={shop.id}
<<<<<<< Updated upstream
                initial={{ opacity: 0, scale: 0.9 }}
=======
<<<<<<< HEAD
                initial={{ opacity: 0, scale: 0.95 }}
>>>>>>> Stashed changes
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.3)",
                }}
                onClick={() => {
                  console.log("🎯 Shop clicked:", shop);
                  if (shop.site && shop.site.slug) {
                    console.log("🚀 Redirecting to custom site:", `/b/${shop.site.slug}`);
                    navigate(`/b/${shop.site.slug}`);
                  } else {
                    console.warn("⚠️ No custom site found, going to default view");
                    navigate(`/client/barbershop/${shop.id}`);
                  }
                }}
                className="cursor-pointer bg-gray-900/70 border border-yellow-500/20 rounded-2xl p-5 hover:border-yellow-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  {shop.name}
                </h3>
                <p className="text-gray-300">{shop.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {shop.city} · Propietario:{" "}
                  <span className="text-yellow-500">
                    {shop.owner?.full_name || "Desconocido"}
                  </span>
                </p>
                {shop.site && (
<<<<<<< Updated upstream
                  <span className="text-[10px] uppercase tracking-widest text-yellow-600/50 block mt-3">
                    Sitio {shop.site.status === 'published' ? 'Personalizado' : 'En Borrador'}
=======
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] block mt-4 ${isClassic ? "text-[#D4AF37]/40" : "text-gray-300"}`}>
                    Sitio {shop.site.status === 'published' ? 'Premium' : 'Borrador'}
=======
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.3)",
                }}
                onClick={() => {
                  console.log("🎯 Shop clicked:", shop);
                  if (shop.site && shop.site.slug) {
                    console.log("🚀 Redirecting to custom site:", `/b/${shop.site.slug}`);
                    navigate(`/b/${shop.site.slug}`);
                  } else {
                    console.warn("⚠️ No custom site found, going to default view");
                    navigate(`/client/barbershop/${shop.id}`);
                  }
                }}
                className="cursor-pointer bg-gray-900/70 border border-yellow-500/20 rounded-2xl p-5 hover:border-yellow-500/50 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-yellow-400 mb-2">
                  {shop.name}
                </h3>
                <p className="text-gray-300">{shop.address}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {shop.city} · Propietario:{" "}
                  <span className="text-yellow-500">
                    {shop.owner?.full_name || "Desconocido"}
                  </span>
                </p>
                {shop.site && (
                  <span className="text-[10px] uppercase tracking-widest text-yellow-600/50 block mt-3">
                    Sitio {shop.site.status === 'published' ? 'Personalizado' : 'En Borrador'}
>>>>>>> origin/David
>>>>>>> Stashed changes
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
<<<<<<< Updated upstream
          <p className="text-center text-gray-400 mt-10">
=======
<<<<<<< HEAD
          <p className={`text-center mt-10 font-medium ${isClassic ? "text-gray-500" : "text-gray-400"}`}>
=======
          <p className="text-center text-gray-400 mt-10">
>>>>>>> origin/David
>>>>>>> Stashed changes
            No hay barberías registradas todavía.
          </p>
        )}
      </div>
<<<<<<< Updated upstream
=======
<<<<<<< HEAD

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto mt-20 pb-12 text-center">
        <p className={`text-sm flex items-center justify-center gap-2 font-medium ${isClassic ? "text-gray-500" : "text-gray-400"}`}>
          <span className="font-bold text-[#D4AF37]">GARGO</span>BARB © 2026 • Selección Premier
        </p>
      </footer>
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
    </div>
  );
};

export default Home;
<<<<<<< Updated upstream

=======
<<<<<<< HEAD
=======

>>>>>>> origin/David
>>>>>>> Stashed changes
