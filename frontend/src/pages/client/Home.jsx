import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Settings, HelpCircle, Info, Phone } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/api";

const Home = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);

  const isClassic = theme === "classic";

  useEffect(() => {
    const fetchBarbershops = async () => {
      try {
        const res = await api.get("/barbershops", {
          withCredentials: true,
        });
        setBarbershops(res.data);
      } catch (err) {
        console.error("❌ Error al obtener barberías:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBarbershops();
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isClassic ? "text-gray-300 bg-[#0F0F0F]" : "text-gray-500 bg-[#F8F6F2]"
        }`}>
        <p className="animate-pulse font-medium">Cargando barberías...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isClassic ? "text-white" : "text-[#1C1C1C]"
      }`}>

      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-500 ${isClassic
          ? "bg-[#0b0b0b]/80 border-[#D4AF37]/30"
          : "bg-white/80 border-gray-200 shadow-sm"
          }`}
      >
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate("/client/home")}
        >
          <img src="/GargobarbLogo.png" alt="GargoBarb Logo" className="w-10 h-10 drop-shadow-[0_0_8px_#FFD700]" />
          <h1 className={`text-xl font-bold bg-gradient-to-r ${isClassic ? "from-[#D4AF37] to-[#B8860B]" : "from-[#C6A75E] to-[#A8842F]"} bg-clip-text text-transparent hidden sm:block`}>
            GargoBarb
          </h1>
        </motion.div>

        <div className="flex items-center gap-6 text-sm">
          <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/about-us")}>
            <Info size={16} /> Sobre Nosotros
          </button>
          <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/support")}>
            <HelpCircle size={16} /> Soporte
          </button>
          <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/contact")}>
            <Phone size={16} /> Contacto
          </button>
          <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/settings")}>
            <Settings size={16} /> Configuración
          </button>

          <div className={`border-l pl-4 flex items-center gap-3 ${isClassic ? "border-[#D4AF37]/30" : "border-gray-200"}`}>
            <span className={`font-medium ${isClassic ? "text-gray-300" : "text-gray-700"}`}>
              {user?.full_name || "Invitado"}
            </span>

            <motion.button
              onClick={logout}
              whileTap={{ scale: 0.9 }}
              className={`px-3 py-1 rounded-md transition shadow-sm ${isClassic
                ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black hover:shadow-[#D4AF37]/30"
                : "bg-[#1C1C1C] text-white hover:bg-black"
                }`}
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
          className={`text-3xl font-bold mb-8 text-center bg-gradient-to-r ${isClassic ? "from-[#D4AF37] to-[#B8860B]" : "from-[#1C1C1C] to-[#444444]"
            } bg-clip-text text-transparent uppercase tracking-tight`}
        >
          Barberías disponibles
        </motion.h2>

        {barbershops.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {barbershops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, scale: 0.95 }}
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
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] block mt-4 ${isClassic ? "text-[#D4AF37]/40" : "text-gray-300"}`}>
                    Sitio {shop.site.status === 'published' ? 'Premium' : 'Borrador'}
                  </span>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className={`text-center mt-10 font-medium ${isClassic ? "text-gray-500" : "text-gray-400"}`}>
            No hay barberías registradas todavía.
          </p>
        )}
      </div>

      {/* Footer Branding */}
      <footer className="max-w-7xl mx-auto mt-20 pb-12 text-center">
        <div className={`flex flex-col items-center justify-center gap-2 font-medium ${isClassic ? "text-gray-500" : "text-gray-400"}`}>
          <img src="/GargobarbLogo.png" alt="GargoBarb Logo" className="w-8 h-8 opacity-80" />
          <p className="text-sm">
            <span className="font-bold text-[#D4AF37]">GARGO</span>BARB © 2026 • Selección Premier
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
