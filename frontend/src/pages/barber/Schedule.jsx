// src/pages/barber/Schedule.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSchedules, saveSchedules } from "./Services";

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
  const { id } = useParams(); // id de la barbería
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const res = await getSchedules(id);
      setSchedules(res.data);
    } catch (error) {
      console.error("Error cargando horarios", error);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...schedules];
    updated[index][field] = value;
    setSchedules(updated);
  };

  const handleSave = async () => {
    try {
      await saveSchedules(id, schedules);
      alert("Horarios guardados correctamente");
    } catch (error) {
      console.error("Error guardando horarios", error);
      alert("Error al guardar horarios");
    }
  };

  // Si no hay horarios aún, los inicializa
  useEffect(() => {
    if (schedules.length === 0) {
      setSchedules(
        days.map((day) => ({
          day,
          open_time: "08:00",
          close_time: "18:00",
          is_closed: false,
        }))
      );
    }
  }, [schedules]);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Horarios de atención
      </h2>

      <div className="space-y-4">
        {schedules.map((s, i) => (
          <div
            key={s.day}
            className="flex items-center gap-4 bg-gray-800 p-4 rounded"
          >
            <span className="w-24 capitalize">{s.day}</span>

            <input
              type="time"
              value={s.open_time}
              disabled={s.is_closed}
              onChange={(e) =>
                handleChange(i, "open_time", e.target.value)
              }
              className="bg-gray-700 p-2 rounded"
            />

            <input
              type="time"
              value={s.close_time}
              disabled={s.is_closed}
              onChange={(e) =>
                handleChange(i, "close_time", e.target.value)
              }
              className="bg-gray-700 p-2 rounded"
            />

            <label className="flex items-center gap-2">
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
        className="mt-6 bg-yellow-500 text-black px-6 py-2 rounded"
      >
        Guardar horarios
      </button>
    </div>
  );
}
