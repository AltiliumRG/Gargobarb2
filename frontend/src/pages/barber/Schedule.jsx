// src/pages/barber/Schedule.jsx

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function Schedule() {
  const { barbershopId } = useParams(); // 🔥 UNIFICADO
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD ================= */
  const loadSchedules = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/barbershops/${barbershopId}/schedules`
      );

      if (res.data && res.data.length > 0) {
        setSchedules(res.data);
      } else {
        // Si no existen en DB, crea base inicial
        setSchedules(
          days.map((day) => ({
            day,
            open_time: "08:00",
            close_time: "18:00",
            is_closed: false,
          }))
        );
      }

    } catch (error) {
      console.error("Error cargando horarios:", error);
      toast.error("Error cargando horarios");
    } finally {
      setLoading(false);
    }
  }, [barbershopId]);

  useEffect(() => {
    if (barbershopId) loadSchedules();
  }, [barbershopId, loadSchedules]);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index, field, value) => {
    setSchedules((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      await api.post(
        `/barbershops/${barbershopId}/schedules`,
        schedules
      );

      toast.success("Horarios guardados correctamente");
    } catch (error) {
      console.error("Error guardando horarios:", error);
      toast.error("Error guardando horarios");
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Cargando horarios...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="max-w-3xl mx-auto text-white p-6">

      <h2 className="text-2xl font-bold mb-6">
        Horarios de atención
      </h2>

      <div className="space-y-4">
        {schedules.map((s, i) => (
          <div
            key={s.day}
            className="flex flex-col md:flex-row items-center gap-4 bg-zinc-900 p-4 rounded-2xl border border-white/5"
          >
            <span className="w-28 capitalize font-semibold text-gray-300">
              {s.day}
            </span>

            <input
              type="time"
              value={s.open_time}
              disabled={s.is_closed}
              onChange={(e) =>
                handleChange(i, "open_time", e.target.value)
              }
              className="bg-zinc-800 p-2 rounded-lg"
            />

            <input
              type="time"
              value={s.close_time}
              disabled={s.is_closed}
              onChange={(e) =>
                handleChange(i, "close_time", e.target.value)
              }
              className="bg-zinc-800 p-2 rounded-lg"
            />

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.is_closed}
                onChange={(e) =>
                  handleChange(i, "is_closed", e.target.checked)
                }
              />
              Cerrado
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-xl font-bold transition active:scale-95"
      >
        Guardar horarios
      </button>
    </div>
  );
}