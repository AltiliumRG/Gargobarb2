import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Settings, HelpCircle, Info, Phone, Calendar, Package } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";

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
                className="cursor-pointer bg-gray-900/70 border border-yellow-500/20 rounded-3xl p-6 hover:border-yellow-500/50 transition-all duration-300 flex flex-col items-center text-center"
              >
                {/* LOGO / IMAGE */}
                <div className="w-24 h-24 mb-6 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-white/5 shadow-2xl flex items-center justify-center shrink-0">
                  {shop.logo_url ? (
                    <img 
                      src={shop.logo_url} 
                      alt={shop.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                  ) : (
                    <div className="text-4xl font-black text-yellow-500 uppercase tracking-tighter">
                      {shop.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight group-hover:text-yellow-500 transition-colors">
                    {shop.name}
                  </h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{shop.address}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {shop.city} · Propietario:{" "}
                      <span className="text-yellow-500 font-bold uppercase">
                        {shop.owner?.full_name || "Desconocido"}
                      </span>
                    </p>
                  </div>
                  
                  {shop.site && (
                    <div className="mt-6 pt-4 border-t border-white/5">
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${isClassic ? "text-[#D4AF37]" : "text-yellow-500"} opacity-70`}>
                        Sitio {shop.site.status === 'published' ? 'Premium 🚀' : 'Borrador 📝'}
                      </span>
                    </div>
                  )}
                </div>
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
