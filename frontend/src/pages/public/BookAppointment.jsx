import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function BookAppointment() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [barbershop, setBarbershop] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);

  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split("T")[0];

  const [selectedDate, setSelectedDate] = useState(null);

const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 30);

const maxDateString = maxDate.toISOString().split("T")[0];

  const [form, setForm] = useState({
    service_id: "",
    date: "",
    time: "",
    notes: "",
  });

  /* ========================
     CARGAR BARBERÍA
  ======================== */
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        const shopRes = await api.get(`/barbershops/public/${slug}`);
        setBarbershop(shopRes.data);

        const servicesRes = await api.get(
          `/services/barbershop/${shopRes.data.id}`
        );

        setServices(servicesRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Error cargando información");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  /* ========================
     SELECCIONAR SERVICIO
  ======================== */
  const handleServiceChange = (service) => {
    setSelectedService(service);

    setForm((prev) => ({
  ...prev,
  service_id: service.id,
}));
  };

  /* ========================
     SELECCIONAR FECHA
  ======================== */
  const handleDateChange = async (date) => {

  setForm((prev) => ({
  ...prev,
  date,
  time: ""
}));

  try {

    const res = await api.get(
  `/availability/${barbershop.id}?date=${date}&duration=${selectedService?.duration_minutes || 30}`
);

    setAvailableSlots(res.data || []);

  } catch (err) {

    console.error(err);
    toast.error("Error cargando horarios");

  }

};

  /* ========================
     RESERVAR
  ======================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService) {
      toast.error("Selecciona un servicio");
      return;
    }

    if (!form.time) {
      toast.error("Selecciona un horario");
      return;
    }

    try {
      await api.post("/appointments", {
        barbershop_id: barbershop.id,
        service_id: selectedService.id,
        date: form.date,
        time: form.time,
        notes: form.notes,
      });

      toast.success("Cita reservada 🎉");

      navigate(`/b/${slug}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Error creando cita");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Cargando agenda...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white px-6 py-16">

    <div className="max-w-4xl mx-auto">

      {/* BOTON VOLVER */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 opacity-60 hover:opacity-100 mb-8 transition"
      >
        <ArrowLeft size={16} />
        Volver
      </button>

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black mb-2">
          Reservar cita
        </h1>

        <p className="text-yellow-400 font-semibold text-lg">
          {barbershop?.name}
        </p>

        <p className="opacity-50 mt-2">
          Elige un servicio, fecha y horario disponible
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/60 backdrop-blur border border-white/10 p-10 rounded-3xl space-y-12 shadow-2xl"
      >

        {/* SERVICIOS */}
        <div>

          <label className="text-sm uppercase tracking-wide opacity-60">
            1. Selecciona servicio
          </label>

          <div className="grid md:grid-cols-2 gap-4 mt-4">

            {services.map((service) => (

              <div
                key={service.id}
                onClick={() => handleServiceChange(service)}
                className={`p-6 rounded-2xl cursor-pointer border transition-all duration-200
                ${
                  selectedService?.id === service.id
                    ? "border-yellow-500 bg-yellow-500/10 shadow-lg"
                    : "border-white/10 hover:border-yellow-500 hover:-translate-y-1"
                }`}
              >

                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-bold text-lg">
                      {service.name}
                    </h3>

                    <p className="text-sm opacity-60 mt-1">
                      {service.duration_minutes} minutos
                    </p>
                  </div>

                  <p className="text-yellow-400 font-bold text-lg">
                    ${Number(service.price).toLocaleString()}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* FECHA */}
        <div>

          <label className="flex items-center gap-2 text-sm uppercase tracking-wide opacity-60">
            <Calendar size={16} />
            2. Selecciona fecha
          </label>

          <ReactCalendar
  onChange={(date) => {
    const formatted = date.toISOString().split("T")[0];

    setSelectedDate(date);
    handleDateChange(formatted);
  }}
  value={selectedDate}
  minDate={new Date()}
  maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
  className="mt-4 rounded-xl overflow-hidden"
/>

        </div>

        {/* HORARIOS */}
        {form.date && (
          
          <div>
            <p className="text-lg font-semibold">
  {(() => {
    if (!form.date) return "";
    const [y, m, d] = form.date.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });
  })()}
</p>
            <div className="text-sm text-yellow-400">
    Horarios disponibles para {form.date}
  </div>
            <label className="flex items-center gap-2 text-sm uppercase tracking-wide opacity-60">
              <Clock size={16} />
              3. Horarios disponibles
            </label>

            {availableSlots.length === 0 ? (

              <div className="mt-4 text-sm opacity-60">
                No hay horarios disponibles para esta fecha
              </div>

            ) : (

              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">

                {availableSlots.map((slot) => {

  const isBooked = slot.booked;
  const isSelected = form.time === slot.time;

  return (
    <button
      key={new Date(`1970-01-01T${slot.time}`).toLocaleTimeString("es-CO", {
  hour: "2-digit",
  minute: "2-digit"
})}
      type="button"
      disabled={isBooked}
      onClick={() =>
        setForm((prev) => ({
  ...prev,
  time: slot.time,
}))
      }
      className={`p-3 rounded-xl border transition
        ${
          isBooked
            ? "bg-red-600 text-white border-red-600 cursor-not-allowed"
            : isSelected
            ? "bg-yellow-500 text-black border-yellow-500"
            : "border-white/10 hover:border-yellow-500"
        }`}
    >
      {new Date(`1970-01-01T${slot.time}`).toLocaleTimeString("es-CO", {
  hour: "2-digit",
  minute: "2-digit"
})}
    </button>
  );

})}

              </div>

            )}

          </div>

        )}

        {/* NOTAS */}
        <div>

          <label className="text-sm uppercase tracking-wide opacity-60">
            Notas (opcional)
          </label>

          <textarea
            placeholder="Ej: corte degradado alto"
            className="w-full mt-3 p-4 bg-black border border-white/10 rounded-xl focus:border-yellow-500"
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

        </div>

        {/* BOTON */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl font-bold text-black bg-yellow-500 hover:bg-yellow-400 hover:scale-[1.02] transition"
        >
          Confirmar cita
        </button>

      </form>

    </div>

  </div>
);
}