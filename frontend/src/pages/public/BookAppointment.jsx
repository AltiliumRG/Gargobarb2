import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

export default function BookAppointment() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [barbershop, setBarbershop] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    service_id: "",
    date: "",
    time: "",
    notes: "",
  });

  /* =========================
     CARGA
  ========================= */
  useEffect(() => {
  if (!slug) return;

  const loadData = async () => {
    try {
      console.log("Slug recibido:", slug);

      const shopRes = await api.get(`/barbershops/public/${slug}`);
      console.log("Barbería:", shopRes.data);

      setBarbershop(shopRes.data);

      if (!shopRes.data?.id) {
        toast.error("Barbería inválida");
        return;
      }

      const servicesRes = await api.get(
        `/services/barbershop/${shopRes.data.id}`
      );

      console.log("Servicios:", servicesRes.data);

      setServices(servicesRes.data || []);

    } catch (err) {
      console.error(err);
      toast.error("Error cargando información");
    }
  };

  loadData();
}, [slug]);
  /* =========================
     SELECCIONAR SERVICIO
  ========================= */
  const handleServiceChange = (id) => {
    const service = services.find(s => s.id == id);
    setSelectedService(service);
    setForm({ ...form, service_id: id });
  };

  /* =========================
     ENVIAR
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService) {
      toast.error("Selecciona un servicio");
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
      toast.error("Error creando cita");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">

      <div className="max-w-2xl mx-auto">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 opacity-60 hover:opacity-100 mb-6"
        >
          <ArrowLeft size={16} />
          Volver
        </button>

        <h1 className="text-4xl font-black mb-2">
          Reservar en {barbershop?.name}
        </h1>

        <p className="opacity-50 mb-10">
          Elige tu servicio y horario disponible
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/50 border border-white/10 p-10 rounded-3xl backdrop-blur-xl space-y-8"
        >

          {/* SERVICIOS */}
          <div>
            <label className="text-sm opacity-70">Servicio</label>
            <select
              className="w-full mt-2 p-4 bg-black border border-white/10 rounded-xl focus:border-yellow-500"
              onChange={(e) => handleServiceChange(e.target.value)}
              required
            >
              <option value="">Selecciona servicio</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ${s.price}
                </option>
              ))}
            </select>
          </div>

          {/* INFO DINÁMICA */}
          {selectedService && (
            <div className="bg-black border border-yellow-500/30 p-6 rounded-2xl">
              <p className="text-yellow-400 font-bold">
                ${selectedService.price}
              </p>
              <p className="text-sm opacity-60">
                Duración: {selectedService.duration_minutes} minutos
              </p>
            </div>
          )}

          {/* FECHA */}
          <div>
            <label className="flex items-center gap-2 text-sm opacity-70">
              <Calendar size={16} /> Fecha
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              className="w-full mt-2 p-4 bg-black border border-white/10 rounded-xl"
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />
          </div>

          {/* HORA */}
          <div>
            <label className="flex items-center gap-2 text-sm opacity-70">
              <Clock size={16} /> Hora
            </label>
            <input
              type="time"
              className="w-full mt-2 p-4 bg-black border border-white/10 rounded-xl"
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
              required
            />
          </div>

          {/* NOTAS */}
          <textarea
            placeholder="Notas opcionales"
            className="w-full p-4 bg-black border border-white/10 rounded-xl"
            onChange={(e) =>
              setForm({ ...form, notes: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-black bg-yellow-500 hover:scale-[1.02] transition"
          >
            Confirmar cita
          </button>
        </form>

      </div>
    </div>
  );
}