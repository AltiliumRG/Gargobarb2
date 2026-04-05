import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";
import { ArrowLeft, Calendar, Clock, Edit2, X, XCircle, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RescheduleModal from "../../components/appointments/RescheduleModal";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isClassic = theme === "classic";

  // Modal State
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/client");
      setAppointments(res.data);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("No se pudieron cargar tus citas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta cita?")) return;
    try {
      await api.put(`/appointments/${id}/status`, { status: "cancelada" });
      toast.success("Cita cancelada correctamente.");
      loadAppointments();
    } catch (err) {
      console.error(err);
      toast.error("Hubo un error al cancelar la cita.");
    }
  };

  const openReschedule = (appt) => {
    setCurrentAppt(appt);
    setNewDate(appt.date);
    setNewTime(appt.time);
    setIsRescheduling(true);
  };

  const closeReschedule = () => {
    setIsRescheduling(false);
    setCurrentAppt(null);
  };

  const confirmReschedule = async () => {
    if (!newDate || !newTime) {
      toast.error("Debes seleccionar fecha y hora nueva.");
      return;
    }
    try {
      await api.put(`/appointments/${currentAppt.id}/reschedule`, {
        date: newDate,
        time: newTime,
      });
      toast.success("Cita reprogramada correctamente.");
      closeReschedule();
      loadAppointments();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Error al reprogramar cita.";
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-400">Cargando citas...</span>
      </div>
    );
  }

  const statusColors = {
    pendiente: "bg-yellow-500/20 text-yellow-500 border border-yellow-500/50",
    confirmada: "bg-green-500/20 text-green-400 border border-green-500/50",
    completada: "bg-blue-500/20 text-blue-400 border border-blue-500/50",
    cancelada: "bg-red-500/20 text-red-500 border border-red-500/50",
  };

  return (
    <div className={`p-8 max-w-6xl mx-auto min-h-screen ${isClassic ? "text-white" : "text-[#1C1C1C]"}`}>
      <button onClick={() => navigate("/client/home")} className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition mb-6">
        <ArrowLeft size={20} /> Volver al Inicio
      </button>
      
      <h2 className={`text-4xl font-extrabold tracking-tight mb-8 bg-gradient-to-r ${isClassic ? "from-[#D4AF37] to-[#B8860B]" : "from-[#1C1C1C] to-[#444444]"} bg-clip-text text-transparent`}>
        Historial de Citas
      </h2>

      {appointments.length === 0 ? (
        <div className="text-center py-20 bg-black/20 rounded-xl border border-white/5">
          <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
          <p className="text-xl text-gray-400">No tienes citas programadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl border transition-all duration-300 relative shadow-xl backdrop-blur-md ${isClassic ? "bg-[#0b1220]/80 border-gray-800" : "bg-white/80 border-gray-200"}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{appt.barbershop?.name || "Barbería"}</h3>
                  <p className="text-sm text-yellow-500 font-semibold">{appt.service?.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${statusColors[appt.status]}`}>
                  {appt.status}
                </span>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Calendar size={16} className="text-yellow-500" />
                  <span className="font-medium text-sm">{appt.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock size={16} className="text-yellow-500" />
                  <span className="font-medium text-sm">{appt.time}</span>
                </div>
                
                {/* DIRECCIÓN */}
                {appt.barbershop?.address && (
                  <div className="flex items-start gap-3 mt-4 pt-3 border-t border-white/5 text-gray-400">
                    <MapPin size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm">{appt.barbershop.address}</span>
                      <span className="text-xs opacity-70">{appt.barbershop.city}</span>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appt.barbershop.address + ', ' + appt.barbershop.city)}`}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-yellow-500 hover:underline mt-1 font-semibold"
                      >
                        Ver en Google Maps
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {(appt.status === "pendiente" || appt.status === "confirmada") && (
                <div className="flex gap-3 mt-8 border-t border-gray-800 pt-4">
                  <button
                    onClick={() => openReschedule(appt)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gray-800 hover:bg-yellow-500 hover:text-black transition text-sm font-bold text-gray-300"
                  >
                    <Edit2 size={14} /> Posponer
                  </button>
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-500 hover:text-white transition text-sm font-bold border border-red-900/50"
                  >
                    <XCircle size={14} /> Cancelar
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL POSPONER */}
      <AnimatePresence>
        {isRescheduling && currentAppt && (
          <RescheduleModal
            appt={currentAppt}
            onClose={closeReschedule}
            onSuccess={() => {
              closeReschedule();
              loadAppointments();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
