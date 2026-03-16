import { useNavigate } from "react-router-dom";
import { createBarbershop } from "../../api/barber.api";
import { useWizard } from "../../context/WizardContext";
import toast from "react-hot-toast";

export default function StepConfirm() {
  const navigate = useNavigate();
  const { data } = useWizard();

  const handleCreate = async () => {
    // 🛑 VALIDACIÓN VISIBLE PARA EL USUARIO
    if (!data?.name || !data?.address || !data?.city) {
      toast.error("Por favor completa el nombre, dirección y ciudad en el paso 1.");
      console.error("❌ Datos incompletos:", data);
      return;
    }

    // ✅ Payload ENRIQUECIDO
    const payload = {
      name: data.name.trim(),
      country: data.country,
      department: data.department,
      city: data.city.trim(),
      address: data.address.trim(),
      features: data.features,
    };

    const loadingToast = toast.loading("Creando tu barbería...");

    try {
      const res = await createBarbershop(payload);
      const { barbershopId } = res.data;

      if (!barbershopId) {
        throw new Error("No se recibió el ID de la barberia");
      }

      toast.success("¡Barbería creada con éxito!", { id: loadingToast });

      // 🚀 REDIRIGIR AL EDITOR
      setTimeout(() => navigate(`/barber/builder/${barbershopId}`), 1500);

    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al conectar con el servidor";
      toast.error(errorMsg, { id: loadingToast });
      console.error("❌ Error API:", error);
    }
  };

  return (
    <div className="flex justify-end mt-6">
      <button
        onClick={handleCreate}
        className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded font-bold transition"
      >
        Crear barbería
      </button>
    </div>
  );
}
