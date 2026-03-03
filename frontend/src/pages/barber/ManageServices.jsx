import { useEffect, useState } from "react";
import { getServicesByBarbershop, createService, updateService, deleteService } from "../../api/services.api";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function ManageServices() {
  const [barbershop, setBarbershop] = useState(null);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
  });

  /* =========================
     CARGAR BARBERÍA + SERVICIOS
  ========================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        // ⚠️ Ajusta si tu endpoint es diferente
        const shopRes = await api.get("/barbershops/my");
        setBarbershop(shopRes.data);

        const servicesRes = await getServicesByBarbershop(shopRes.data.id);
        setServices(servicesRes.data);

      } catch (err) {
        console.error(err);
        toast.error("Error cargando servicios");
      }
    };

    loadData();
  }, []);

  /* =========================
     MANEJAR INPUTS
  ========================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     CREAR / ACTUALIZAR
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!barbershop) return;

    try {
      if (editingService) {
        await updateService(editingService.id, form);
        toast.success("Servicio actualizado");
      } else {
        await createService({
          ...form,
          barbershop_id: barbershop.id,
        });
        toast.success("Servicio creado");
      }

      // Reset
      setForm({
        name: "",
        description: "",
        price: "",
        duration_minutes: "",
      });
      setEditingService(null);

      const updated = await getServicesByBarbershop(barbershop.id);
      setServices(updated.data);

    } catch (err) {
      console.error(err);
      toast.error("Error guardando servicio");
    }
  };

  /* =========================
     EDITAR
  ========================= */
  const handleEdit = (service) => {
    setEditingService(service);
    setForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration_minutes: service.duration_minutes,
    });
  };

  /* =========================
     ELIMINAR
  ========================= */
  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      toast.success("Servicio eliminado");

      const updated = await getServicesByBarbershop(barbershop.id);
      setServices(updated.data);

    } catch (err) {
      console.error(err);
      toast.error("Error eliminando servicio");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-black mb-10">
        Gestionar Servicios
      </h1>

      {/* FORMULARIO */}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-2xl border border-white/10 space-y-6 mb-12"
      >
        <input
          name="name"
          placeholder="Nombre del servicio"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-4 bg-black border border-white/10 rounded-xl"
        />

        <textarea
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          className="w-full p-4 bg-black border border-white/10 rounded-xl"
        />

        <input
          name="price"
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full p-4 bg-black border border-white/10 rounded-xl"
        />

        <input
          name="duration_minutes"
          type="number"
          placeholder="Duración en minutos"
          value={form.duration_minutes}
          onChange={handleChange}
          required
          className="w-full p-4 bg-black border border-white/10 rounded-xl"
        />

        <button
          type="submit"
          className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:scale-[1.02] transition"
        >
          {editingService ? "Actualizar Servicio" : "Crear Servicio"}
        </button>
      </form>

      {/* LISTA */}
      <div className="grid md:grid-cols-2 gap-6">
        {services.map((s) => (
          <div
            key={s.id}
            className="bg-zinc-900 p-6 rounded-2xl border border-white/10"
          >
            <h3 className="text-xl font-bold">{s.name}</h3>
            <p className="opacity-60 text-sm">{s.description}</p>
            <p className="mt-2 font-bold text-yellow-400">
              ${s.price}
            </p>
            <p className="text-sm opacity-50">
              {s.duration_minutes} min
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEdit(s)}
                className="px-4 py-2 bg-blue-500 rounded-lg"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(s.id)}
                className="px-4 py-2 bg-red-500 rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}