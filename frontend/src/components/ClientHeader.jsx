import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Settings, HelpCircle, Info, Phone, Calendar, Package, Bell } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationMenu from "./barber/NotificationMenu";

const ClientHeader = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const isClassic = theme === "classic";

  return (
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
        <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/contact-us")}>
          <Phone size={16} /> Contacto
        </button>
        <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/appointments")}>
          <Calendar size={16} /> Mis Citas
        </button>
        <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/orders")}>
          <Package size={16} /> Mis Órdenes
        </button>
        <button className={`hover:text-[#D4AF37] transition flex items-center gap-1 font-medium ${isClassic ? "text-gray-300" : "text-gray-600"}`} onClick={() => navigate("/client/settings")}>
          <Settings size={16} /> Configuración
        </button>

        <div className={`border-l pl-4 flex items-center gap-3 ${isClassic ? "border-[#D4AF37]/30" : "border-gray-200"}`}>
          
          {/* BELL NOTIFICATIONS */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 transition relative ${isClassic ? "text-gray-300 hover:text-[#D4AF37]" : "text-gray-600 hover:text-black"}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-black shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <NotificationMenu onClose={() => setShowNotifications(false)} />
            )}
          </div>

          <span className={`font-medium hidden md:block ${isClassic ? "text-gray-300" : "text-gray-700"}`}>
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
  );
};

export default ClientHeader;
