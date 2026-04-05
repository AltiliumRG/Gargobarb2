import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Clock } from "lucide-react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function RescheduleModal({ appt, onClose, onSuccess }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [form, setForm] = useState({
    date: "",
    time: ""
  });

  // Init old values slightly
  useEffect(() => {
    if (appt) {
       // We do not pre-select the old date because we want the user to click explicitly to load slots
       // But we could show them their old date.
    }
  }, [appt]);

  const handleDateChange = async (dateObj) => {
    const formatted = dateObj.toISOString().split("T")[0];
    setSelectedDate(dateObj);
    
    setForm((prev) => ({
      ...prev,
      date: formatted,
      time: "" // Reset time on new date
    }));

    try {
      setLoadingSlots(true);
      const duration = appt.service?.duration_minutes || 30;
      // We pass the new date and the service duration
      const res = await api.get(
        `/availability/${appt.barbershop_id}?date=${formatted}&duration=${duration}`
      );
      
      // If we are rescheduling for the SAME date, we must "free up" the slot that is currently occupied by this very same appointment.
      // But the availability endpoint does not know who we are rescheduling.
      // A quick fix is: if the slot time perfectly matches `appt.time` and the date perfectly matches `appt.date`, we forcefully inject it or mark it as unbooked.
      // However, usually it's fine just to pick a new slot. If they pick the same date, their current time will show booked because the backend thinks it's occupied by themselves. 
      // We can manually un-book it on the frontend.
      const slots = res.data || [];
      if (formatted === appt.date) {
         const oldTimeNormalized = new Date(`1970-01-01T${appt.time}`).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
         const oldSlot = slots.find(s => s.time.substring(0, 5) === oldTimeNormalized);
         if (oldSlot) oldSlot.booked = false; 
      }
      
      setAvailableSlots(slots);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando horarios disponibles.");
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.date || !form.time) {
      toast.error("Debes seleccionar una nueva fecha y un nuevo horario.");
      return;
    }
    
    try {
      await api.put(`/appointments/${appt.id}/reschedule`, {
        date: form.date,
        time: form.time,
      });
      toast.success("Cita reprogramada correctamente.");
      onSuccess();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.error || "Error al reprogramar cita.";
      toast.error(msg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl my-8 relative"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-2xl font-bold text-white">Posponer Cita</h3>
            <p className="text-yellow-400 font-semibold mt-1">Servicio: {appt.service?.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition self-start">
            <X size={18} className="text-white" />
          </button>
        </div>

        <div className="space-y-8">
          
          {/* FECHA */}
          <div>
            <label className="flex items-center gap-2 text-sm uppercase tracking-wide opacity-60 text-white mb-4 font-bold">
              <Calendar size={16} className="text-yellow-500" />
              1. Selecciona Nueva Fecha
            </label>

            <ReactCalendar
              onChange={handleDateChange}
              value={selectedDate}
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
              className="mt-4 rounded-xl overflow-hidden mx-auto bg-black text-white border-zinc-800"
            />
          </div>

          {/* HORARIOS */}
          {form.date && (
            <div>
              <label className="flex items-center gap-2 text-sm uppercase tracking-wide opacity-60 text-white mb-4 font-bold">
                <Clock size={16} className="text-yellow-500" />
                2. Horarios disponibles para {form.date}
              </label>

              {loadingSlots ? (
                <div className="text-sm text-gray-400 animate-pulse">Cargando horarios...</div>
              ) : availableSlots.length === 0 ? (
                <div className="text-sm text-red-400 p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                  No hay horarios disponibles para esta fecha o la barbería se encuentra cerrada.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                  {availableSlots.map((slot) => {
                    const isBooked = slot.booked;
                    const isSelected = form.time === slot.time;
                    const timeLabel = new Date(`1970-01-01T${slot.time}`).toLocaleTimeString("es-CO", {
                      hour: "2-digit",
                      minute: "2-digit"
                    });

                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setForm(prev => ({ ...prev, time: slot.time }))}
                        className={`p-3 rounded-xl border transition text-sm font-bold
                          ${
                            isBooked
                              ? "bg-red-600/20 text-red-400 border-red-600/30 cursor-not-allowed"
                              : isSelected
                              ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]"
                              : "bg-black text-white border-white/10 hover:border-yellow-500 hover:text-yellow-400"
                          }`}
                      >
                        {timeLabel}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ACCIONES */}
          <div className="pt-6 border-t border-white/10 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl font-bold text-gray-300 bg-zinc-800 hover:bg-zinc-700 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.date || !form.time}
              className={`flex-1 py-4 rounded-xl font-bold transition flex justify-center items-center gap-2
                ${(!form.date || !form.time) 
                  ? "bg-zinc-800 text-gray-500 cursor-not-allowed" 
                  : "bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                }`}
            >
              Confirmar Cambio
            </button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
