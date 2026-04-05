import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RescheduleModal from "../../components/appointments/RescheduleModal";

export default function Appointments() {
  const { barbershopId } = useParams();

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Reschedule State
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [apptRes, statsRes] = await Promise.all([
        api.get(`/appointments/barbershop/${barbershopId}`),
        api.get(`/appointments/stats/${barbershopId}`)
      ]);

      setAppointments(apptRes.data);
      setStats(statsRes.data);

    } catch (err) {
      console.error("Error cargando citas:", err);
      toast.error("Error cargando citas");
    } finally {
      setLoading(false);
    }
  }, [barbershopId]);

  useEffect(() => {
    if (barbershopId) fetchData();
  }, [barbershopId, fetchData]);

  /* ================= STATUS UPDATE ================= */
  const changeStatus = async (id, status) => {
    setUpdatingId(`${id}-${status}`);
    try {
      await api.put(`/appointments/${id}/status`, { status });
      toast.success("Estado actualizado");
      await fetchData();
    } catch (err) {
      console.error("Error actualizando estado:", err);
      toast.error("Error actualizando estado");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= DELETE ================= */
  const deleteAppointment = async (id) => {
    if (!window.confirm("¿Eliminar cita?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/appointments/${id}`);
      toast.success("Cita eliminada");
      await fetchData();
    } catch (err) {
      console.error("Error eliminando cita:", err);
      toast.error("Error eliminando cita");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= RESCHEDULE ================= */
  const openReschedule = (appt) => {
    setCurrentAppt(appt);
    setIsRescheduling(true);
  };

  const closeReschedule = () => {
    setIsRescheduling(false);
    setCurrentAppt(null);
  };

  /* ================= FILTER ================= */
  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Cargando citas...
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-white">

      {/* ================= STATS ================= */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          <StatCard label="Total Citas" value={stats.totalAppointments} />
          <StatCard label="Hoy" value={stats.todayAppointments} />
          <StatCard label="Pendientes" value={stats.pendingAppointments} />
          <StatCard label="Ingreso Mes" value={`$${stats.monthlyRevenue}`} />
          <StatCard label="Ingreso Total" value={`$${stats.totalRevenue}`} />
        </div>
      )}

      {/* ================= FILTER ================= */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {["all", "pendiente", "confirmada", "completada", "cancelada"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition
              ${filter === s
                ? "bg-yellow-500 text-black"
                : "bg-zinc-800 hover:bg-zinc-700"}`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= LIST / TABLE ================= */}
      <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/5">
        
        {/* MOBILE VIEW (CARDS) */}
        <div className="md:hidden divide-y divide-white/5">
          {filteredAppointments.length === 0 ? (
            <div className="p-10 text-center text-gray-500">No hay citas</div>
          ) : (
            filteredAppointments.map((appt) => (
              <div key={appt.id} className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{appt.client?.username}</h3>
                    <p className="text-yellow-500 text-sm">{appt.service?.name}</p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
                
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>📅 {appt.date}</span>
                  <span>⏰ {appt.time}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    disabled={updatingId === `${appt.id}-confirmada`}
                    onClick={() => changeStatus(appt.id, "confirmada")} 
                    className="flex-1 py-2 bg-green-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {updatingId === `${appt.id}-confirmada` ? <Loader2 size={12} className="animate-spin" /> : "Confirmar"}
                  </button>
                  <button 
                    disabled={updatingId === `${appt.id}-completada`}
                    onClick={() => changeStatus(appt.id, "completada")} 
                    className="flex-1 py-2 bg-blue-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {updatingId === `${appt.id}-completada` ? <Loader2 size={12} className="animate-spin" /> : "Completar"}
                  </button>
                  <button 
                    disabled={updatingId === `${appt.id}-cancelada`}
                    onClick={() => changeStatus(appt.id, "cancelada")} 
                    className="flex-1 py-2 bg-red-600 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                  >
                    {updatingId === `${appt.id}-cancelada` ? <Loader2 size={12} className="animate-spin" /> : "Cancelar"}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => openReschedule(appt)} 
                    className="flex-1 py-2 bg-yellow-500 text-black rounded-lg text-xs font-bold"
                  >
                    Posponer
                  </button>
                  <button 
                    disabled={deletingId === appt.id}
                    onClick={() => deleteAppointment(appt.id)} 
                    className="px-4 py-2 bg-zinc-800 rounded-lg text-xs font-bold text-red-500 flex items-center justify-center gap-2"
                  >
                    {deletingId === appt.id ? <Loader2 size={12} className="animate-spin" /> : "Eliminar"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP VIEW (TABLE) */}
        <table className="hidden md:table w-full text-sm">
          <thead className="bg-zinc-800 text-gray-400 uppercase text-xs">
            <tr>
              <th className="p-4 text-left">Cliente</th>
              <th className="p-4 text-left">Servicio</th>
              <th className="p-4 text-left">Fecha</th>
              <th className="p-4 text-left">Hora</th>
              <th className="p-4 text-left">Estado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No hay citas
                </td>
              </tr>
            )}

            {filteredAppointments.map((appt) => (
              <tr
                key={appt.id}
                className="border-t border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-4">{appt.client?.username}</td>
                <td className="p-4">
                  {appt.service?.name} (${appt.service?.price})
                </td>
                <td className="p-4">{appt.date}</td>
                <td className="p-4">{appt.time}</td>
                <td className="p-4 capitalize">
                  <StatusBadge status={appt.status} />
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    disabled={updatingId === `${appt.id}-confirmada`}
                    onClick={() => changeStatus(appt.id, "confirmada")}
                    className="px-2 py-1 bg-green-600 rounded text-xs hover:scale-105 transition min-w-[28px] h-[26px] inline-flex items-center justify-center"
                    title="Confirmar"
                  >
                    {updatingId === `${appt.id}-confirmada` ? <Loader2 size={12} className="animate-spin" /> : "✔"}
                  </button>
                  <button
                    disabled={updatingId === `${appt.id}-completada`}
                    onClick={() => changeStatus(appt.id, "completada")}
                    className="px-2 py-1 bg-blue-600 rounded text-xs hover:scale-105 transition min-w-[28px] h-[26px] inline-flex items-center justify-center"
                    title="Completar"
                  >
                    {updatingId === `${appt.id}-completada` ? <Loader2 size={12} className="animate-spin" /> : "✓"}
                  </button>
                  <button
                    disabled={updatingId === `${appt.id}-cancelada`}
                    onClick={() => changeStatus(appt.id, "cancelada")}
                    className="px-2 py-1 bg-red-600 rounded text-xs hover:scale-105 transition min-w-[28px] h-[26px] inline-flex items-center justify-center"
                    title="Cancelar"
                  >
                    {updatingId === `${appt.id}-cancelada` ? <Loader2 size={12} className="animate-spin" /> : "✖"}
                  </button>
                  <button
                    onClick={() => openReschedule(appt)}
                    className="px-2 py-1 bg-yellow-500 text-black rounded text-xs hover:scale-105 transition min-w-[28px] h-[26px] inline-flex items-center justify-center"
                    title="Posponer"
                  >
                    📝
                  </button>
                  <button
                    disabled={deletingId === appt.id}
                    onClick={() => deleteAppointment(appt.id)}
                    className="px-2 py-1 bg-gray-700 rounded text-xs hover:scale-105 transition min-w-[28px] h-[26px] inline-flex items-center justify-center text-red-500"
                    title="Eliminar permanentemente"
                  >
                    {deletingId === appt.id ? <Loader2 size={12} className="animate-spin" /> : "🗑"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL POSPONER ================= */}
      <AnimatePresence>
        {isRescheduling && currentAppt && (
          <RescheduleModal
            appt={currentAppt}
            onClose={closeReschedule}
            onSuccess={() => {
              closeReschedule();
              fetchData();
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ label, value }) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl border border-white/5 shadow-md">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

/* ================= STATUS BADGE ================= */
function StatusBadge({ status }) {
  const colors = {
    pendiente: "bg-yellow-500/20 text-yellow-400",
    confirmada: "bg-green-500/20 text-green-400",
    completada: "bg-blue-500/20 text-blue-400",
    cancelada: "bg-red-500/20 text-red-400"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${colors[status] || "bg-gray-700"}`}
    >
      {status}
    </span>
  );
}