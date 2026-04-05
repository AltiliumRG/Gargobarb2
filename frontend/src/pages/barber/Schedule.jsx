// src/pages/barber/Schedule.jsx

import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";

/* =========================
   DÍAS BASE
========================= */

const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday"
];

const DAY_LABELS = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo"
};

export default function Schedule() {

  const { barbershopId } = useParams();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  /* ================= LOAD ================= */

  const loadSchedules = useCallback(async () => {

    try {

      setLoading(true);

      const res = await api.get(`/barbershops/${barbershopId}/schedules`);

      const dbSchedules = res.data || [];

      const normalized = WEEK_DAYS.map((day) => {

        const existing = dbSchedules.find((s) => s.day === day);

        return existing || {
          day,
          open_time: "08:00",
          close_time: "18:00",
          is_closed: false
        };

      });

      setSchedules(normalized);

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
        [field]: value
      };

      return updated;

    });

  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post(
        `/barbershops/${barbershopId}/schedules`,
        { schedules }
      );
      toast.success("Horarios guardados correctamente");
    } catch (error) {
      console.error("Error guardando horarios:", error);
      toast.error("Error guardando horarios");
    } finally {
      setIsSaving(false);
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

            <span className="w-28 font-semibold text-gray-300">
              {DAY_LABELS[s.day]}
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
        disabled={isSaving}
        className="mt-8 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-4 rounded-xl font-bold transition active:scale-95 flex items-center justify-center gap-2 min-w-[200px] disabled:opacity-50"
      >
        {isSaving ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar horarios"
        )}
      </button>

    </div>

  );

}