import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { ArrowLeft, Package, MapPin, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isClassic = theme === "classic";

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/client");
      setOrders(res.data);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("No se pudieron cargar tus órdenes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRefund = async (id) => {
    if (!window.confirm("¿Seguro que deseas solicitar reembolso de esta orden? El administrador revisará tu solicitud.")) return;
    try {
      // In a real scenario we might have a 'refund_requested' status, but we will reuse status=cancelled for now or set it to 'refunded'
      await api.put(`/orders/${id}/status`, { status: "cancelled" });
      toast.success("Has cancelado la orden exitosamente.");
      loadOrders();
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al procesar tu solicitud.");
    }
  };

  const getShippingProgress = (status) => {
    switch (status) {
      case "pending": return 25;
      case "processing": return 50;
      case "shipped": return 75;
      case "delivered": return 100;
      default: return 0;
    }
  };

  const getShippingText = (status) => {
    switch (status) {
      case "pending": return "Preparando 📦";
      case "processing": return "Procesando ⚙️";
      case "shipped": return "En Camino 🚀";
      case "delivered": return "Entregado ✅";
      default: return "Desconocido";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-400">Cargando órdenes...</span>
      </div>
    );
  }

  return (
    <div className={`p-8 max-w-6xl mx-auto min-h-screen ${isClassic ? "text-white" : "text-[#1C1C1C]"}`}>
      <button onClick={() => navigate("/client/home")} className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition mb-6">
        <ArrowLeft size={20} /> Volver al Inicio
      </button>
      
      <h2 className={`text-4xl font-extrabold tracking-tight mb-8 bg-gradient-to-r ${isClassic ? "from-[#D4AF37] to-[#B8860B]" : "from-[#1C1C1C] to-[#444444]"} bg-clip-text text-transparent`}>
        Historial de Compras
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-black/20 rounded-xl border border-white/5">
          <Package size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-xl text-gray-400">Aún no has comprado nada en las barberías.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => {
             const progress = getShippingProgress(order.shipping_status);
             const isCancelled = order.status === "cancelled" || order.status === "refunded";

             return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-3xl border transition-all duration-300 relative shadow-2xl backdrop-blur-md ${isClassic ? "bg-[#0b1220]/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xs uppercase tracking-widest text-gray-500 font-black mb-1">REFERENCIA: {order.transaction_ref}</h3>
                    <p className={`text-2xl font-black ${isClassic ? "text-white" : "text-black"}`}>
                      ${Number(order.total).toLocaleString("es-CO")} COP
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest
                    ${isCancelled ? "bg-red-500/20 text-red-500 border border-red-500/50" : 
                      order.status === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/50" : 
                      "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50"}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* PROGRESS BAR ALIEXPRESS STYLE */}
                {!isCancelled && (
                  <div className="my-6 p-5 bg-black/30 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs text-yellow-500 font-bold uppercase tracking-wider">{getShippingText(order.shipping_status)}</span>
                       <span className="text-xs text-gray-400 font-mono">{progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: progress + "%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                      />
                    </div>
                    <div className="flex justify-between text-[9px] uppercase tracking-widest text-gray-500 mt-2 font-bold">
                       <span>Preparando</span>
                       <span>Procesado</span>
                       <span>Enviado</span>
                       <span>Entregado</span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 text-sm mt-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-300 font-semibold">{item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                      <span className="text-yellow-400 font-bold">${Number(item.price * (item.quantity || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-gray-400 flex items-start gap-3">
                  <MapPin size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">Dirección de Destino:</span>
                    <span className="text-sm text-gray-300">{order.shipping_address || "No especificada"}</span>
                  </div>
                </div>

                {/* ACCIONES */}
                {(!isCancelled && order.shipping_status !== "delivered") && (
                  <div className="flex gap-3 mt-8 pt-4">
                    <button
                      onClick={() => handleRefund(order.id)}
                      className="w-full py-3 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-500 hover:text-white transition text-xs font-black uppercase tracking-widest border border-red-900/50 shadow-lg"
                    >
                      Cancelar Orden & Reembolsar
                    </button>
                  </div>
                )}
              </motion.div>
             );
          })}
        </div>
      )}
    </div>
  );
}
