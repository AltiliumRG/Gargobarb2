import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { Search, Package, MapPin, CheckCircle, Clock, Truck, ShieldAlert, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Orders() {
  const { barbershopId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [refundingId, setRefundingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/orders/barbershop/${barbershopId}`);
      if (res.data && Array.isArray(res.data)) {
         setOrders(res.data);
      } else {
         setOrders([]);
      }
    } catch (error) {
      console.error("Error obteniendo órdenes:", error);
      toast.error("Error al cargar las órdenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [barbershopId]);

  const handleUpdateShipping = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await api.put(`/orders/${id}/status`, { shipping_status: newStatus });
      toast.success("Estado de envío actualizado");
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar envío");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRefund = async (id) => {
    if (!window.confirm("¿Seguro que deseas reembolsar esta orden?")) return;
    setRefundingId(id);
    try {
      await api.put(`/orders/${id}/status`, { status: "refunded", shipping_status: "pending" });
      toast.success("Orden rembolsada con éxito");
      await fetchOrders();
    } catch (error) {
      console.error(error);
      toast.error("Error al reembolsar");
    } finally {
      setRefundingId(null);
    }
  };

  if (loading) {
    return <div className="text-gray-400 p-8">Cargando órdenes de la tienda...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Gestión Logística</h2>
          <p className="text-gray-400">Controla los envíos de los productos comprados en tu app</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {orders.length === 0 ? (
          <div className="xl:col-span-2 text-center py-20 bg-[#0c0c0e] rounded-3xl border border-white/5">
            <Package size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-lg text-gray-500 font-medium">No hay órdenes registradas.</p>
          </div>
        ) : (
          orders.map((order) => {
            const isCancelled = order.status === "cancelled" || order.status === "refunded";
            const shippedText = order.shipping_status === "pending" ? "Preparando" : 
                                order.shipping_status === "processing" ? "Procesando" :
                                order.shipping_status === "shipped" ? "Enviado" : "Entregado";
                                
            return (
              <div key={order.id} className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 hover:border-white/10 transition flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                    <div>
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Referencia</p>
                      <p className="text-sm font-mono text-gray-300">{order.transaction_ref}</p>
                    </div>
                    <div className="text-right">
                       <span className={
                         "px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest " +
                         (isCancelled ? "bg-red-500/10 text-red-500 border border-red-500/20" : 
                         order.status === "completed" ? "bg-green-500/10 text-green-500 border border-green-500/20" : 
                         "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20")
                       }>
                         {order.status}
                       </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="font-bold tracking-tight text-white">{order.client_name || "Cliente Invitado"}</p>
                      <p className="text-xs text-gray-400">{order.client_email} • {order.client_phone}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                      <MapPin size={16} className="text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider">Destino</p>
                        <p className="text-sm text-gray-300">{order.shipping_address || "Retiro en Tienda / No especificada"}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                      <span className="text-xs font-black text-gray-500 uppercase">Total Pagado:</span>
                      <span className="text-xl font-black text-yellow-400">${Number(order.total).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* ACCIONES DEL BARBERO */}
                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-[10px] uppercase font-black text-gray-500 tracking-wider mb-3">Acciones de Logística</p>
                  
                  {isCancelled ? (
                    <div className="text-center p-3 bg-red-950/20 text-red-500 rounded-xl text-xs font-bold border border-red-900/30">
                       ESTA ORDEN FUE {order.status.toUpperCase()}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        {order.shipping_status === "pending" && (
                          <button 
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateShipping(order.id, "processing")} 
                            className="flex-1 bg-blue-500 text-white text-xs font-bold px-3 py-2.5 rounded-xl hover:bg-blue-600 transition flex items-center justify-center gap-2"
                          >
                             {updatingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />} 
                             {updatingId === order.id ? "Procesando..." : "Procesar Pedido"}
                          </button>
                        )}
                        {order.shipping_status === "processing" && (
                          <button 
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateShipping(order.id, "shipped")} 
                            className="flex-1 bg-yellow-500 text-black text-xs font-black px-3 py-2.5 rounded-xl hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                          >
                             {updatingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />} 
                             {updatingId === order.id ? "Enviando..." : "Marcar como Enviado 🚀"}
                          </button>
                        )}
                        {order.shipping_status === "shipped" && (
                          <button 
                            disabled={updatingId === order.id}
                            onClick={() => handleUpdateShipping(order.id, "delivered")} 
                            className="flex-1 bg-green-500 text-white text-xs font-bold px-3 py-2.5 rounded-xl hover:bg-green-600 transition flex items-center justify-center gap-2"
                          >
                             {updatingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} 
                             {updatingId === order.id ? "Entregando..." : "Confirmar Entrega ✅"}
                          </button>
                        )}
                        {order.shipping_status === "delivered" && (
                          <div className="flex-1 text-center text-xs font-bold text-green-500 p-2.5 bg-green-500/10 rounded-xl border border-green-500/20">
                             EL PRODUCTO HA SIDO ENTREGADO
                          </div>
                        )}
                      </div>
                      
                      {order.shipping_status !== "delivered" && (
                         <button 
                           disabled={refundingId === order.id}
                           onClick={() => handleRefund(order.id)} 
                           className="w-full bg-transparent border border-red-500/50 text-red-400 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl transition flex items-center justify-center gap-2"
                         >
                           {refundingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <ShieldAlert size={14} />} 
                           {refundingId === order.id ? "Reembolsando..." : "Rembolsar Dinero"}
                         </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
