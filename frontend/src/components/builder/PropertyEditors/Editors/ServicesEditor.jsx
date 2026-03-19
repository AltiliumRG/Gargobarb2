import React from "react";
import { InputPro } from "../Shared/InputPro";
import { createService } from "../../../../api/services.api";
import ServiceCardEditor from "./ServiceCardEditor";

export default function ServicesEditor({ 
  content, 
  handleContent, 
  activeBarbershop, 
  services, 
  setServices, 
  loadingServices,
  savingId,
  setSavingId
}) {
  const handleAddService = async () => {
    if (!activeBarbershop?.id) return;
    try {
      const res = await createService({
        barbershop_id: activeBarbershop.id,
        name: "Nuevo servicio",
        description: "",
        price: 0,
        duration_minutes: 30,
        image: ""
      });
      setServices(prev => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Error adding service:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">Configuración de sección</h3>
        <InputPro
          placeholder="Título de sección"
          value={content.title}
          onChange={(val) => handleContent("title", val)}
        />
      </div>

      {loadingServices ? (
        <div className="text-center text-gray-500 text-sm py-10">Cargando servicios...</div>
      ) : services.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-10 border border-gray-800 rounded-2xl bg-[#0b1220]">
          No hay servicios aún
        </div>
      ) : (
        services.map((srv, i) => (
          <ServiceCardEditor
            key={srv.id}
            srv={srv}
            index={i}
            services={services}
            setServices={setServices}
            setSavingId={setSavingId}
            savingId={savingId}
          />
        ))
      )}

      <button
        onClick={handleAddService}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black py-3 rounded-xl font-bold transition shadow-lg active:scale-95"
      >
        + Agregar servicio
      </button>
    </div>
  );
}
