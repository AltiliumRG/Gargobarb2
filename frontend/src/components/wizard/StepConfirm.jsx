import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBarbershop } from "../../api/barber.api";
import { useWizard } from "../../context/WizardContext";
import toast from "react-hot-toast";

export default function StepConfirm() {
  const navigate = useNavigate();
  const { data } = useWizard();
  const [showModal, setShowModal] = useState(false);

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
      features: { ...data.features, cart: true },
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
    <div className="flex flex-col items-center justify-center p-8 mt-6 bg-gradient-to-b from-gray-900 to-black backdrop-blur-xl border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(250,204,21,0.05)] text-center relative overflow-hidden group">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none transition duration-700 group-hover:bg-yellow-500/20"></div>

      <div className="w-24 h-24 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(250,204,21,0.2)] transform hover:scale-110 hover:rotate-12 transition duration-500 cursor-pointer">
         <span className="text-5xl drop-shadow-md">💈</span>
      </div>
      
      <h2 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-sm">¿Todo listo para crear tu barbería?</h2>
      <p className="text-gray-400 mb-10 max-w-md text-lg leading-relaxed">
        Estás a un paso de crear tu barbería digital de forma profesional. Revísalo todo y comienza a recibir clientes hoy mismo.
      </p>

      <button
        onClick={() => setShowModal(true)}
        className="relative overflow-hidden group/btn bg-yellow-500 text-black px-12 py-4 rounded-full font-black text-xl shadow-[0_10px_40px_rgba(250,204,21,0.3)] hover:shadow-[0_10px_60px_rgba(250,204,21,0.5)] transition-all duration-300 hover:-translate-y-1"
      >
        <span className="relative z-10 flex items-center gap-3">
          Crear mi Barbería
          <svg className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
          </svg>
        </span>
        <div className="absolute inset-0 bg-yellow-400 scale-x-0 group-hover/btn:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
      </button>

      {/* CONFIRMATION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-gray-900 border border-yellow-500/30 w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative text-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="w-20 h-20 bg-yellow-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <span className="text-4xl">💈</span>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3 tracking-wide">¿Confirmar creación?</h3>
            <p className="text-gray-400 mb-8 max-w-[260px] mx-auto text-sm">
              El sistema generará tu espacio de trabajo y la plantilla inicial. ¿Seguro que quieres continuar?
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowModal(false); handleCreate(); }}
                className="w-full bg-yellow-500 text-black font-black py-4 px-6 rounded-2xl hover:bg-yellow-400 transition hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                Sí, crearla ahora
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="w-full bg-transparent text-gray-500 font-bold py-3 px-6 rounded-2xl hover:text-white hover:bg-white/5 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
