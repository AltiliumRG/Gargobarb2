import { useNavigate } from "react-router-dom";
import { createBarbershop } from "../../api/barber.api";
import { useWizard } from "../../context/WizardContext";

export default function StepConfirm() {
  const navigate = useNavigate();
  const { data } = useWizard();

  const handleCreate = async () => {
    // 🛑 Validación defensiva (evita 400 innecesarios)
    if (!data?.name || !data?.address || !data?.city) {
      console.error("❌ Datos incompletos para crear la barbería", data);
      return;
    }

    // ✅ Payload EXACTO que espera el backend
    const payload = {
      name: data.name.trim(),
      address: data.address.trim(),
      city: data.city.trim(),
    };

    console.log("📤 ENVIANDO SOLO BARBERÍA:", payload);

    try {
      const res = await createBarbershop(payload);

      const { barbershopId } = res.data;

      if (!barbershopId) {
        throw new Error("No se recibió barbershopId desde el backend");
      }

      // 🚀 Redirigir directo al builder del sitio
      navigate(`/barber/builder/${barbershopId}`);
    } catch (error) {
      console.error(
        "❌ Error creando la barbería:",
        error.response?.data || error.message
      );
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
