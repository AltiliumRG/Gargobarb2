import React from "react";
import { InputPro } from "../Shared/InputPro";
import { TextareaPro } from "../Shared/TextareaPro";
import { updateService, deleteService } from "../../../../api/services.api";
import { uploadSiteImage } from "../../../../api/upload.api";
import toast from "react-hot-toast";

export default function ServiceCardEditor({ srv, index, services, setServices, setSavingId, savingId }) {
  const updateLocalSrv = (field, val) => {
    const updated = [...services];
    updated[index] = { ...updated[index], [field]: val };
    setServices(updated);
  };

  const handleSave = async (s) => {
    setSavingId(s.id);
    try {
      await updateService(s.id, s);
      toast.success("Servicio guardado");
    } catch (err) {
      toast.error("Error al guardar");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar servicio?")) return;
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
      toast.success("Servicio eliminado");
    } catch (err) {
      toast.error("Error al eliminar");
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      const res = await uploadSiteImage(file);
      updateLocalSrv("image", res.data.url);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  return (
    <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-4 hover:border-yellow-400/50 transition">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Servicio #{index + 1}</span>
        <button onClick={() => handleDelete(srv.id)} className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase transition">Eliminar</button>
      </div>

      <InputPro placeholder="Nombre" value={srv.name} onChange={(val) => updateLocalSrv("name", val)} />
      <TextareaPro placeholder="Descripción" value={srv.description} onChange={(val) => updateLocalSrv("description", val)} />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Precio</label>
          <InputPro type="number" value={srv.price} onChange={(val) => updateLocalSrv("price", val)} />
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Minutos</label>
          <InputPro type="number" value={srv.duration_minutes} onChange={(val) => updateLocalSrv("duration_minutes", val)} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-gray-500 uppercase block">Imagen</label>
        <div className="flex gap-4 items-center">
            {srv.image && <img src={srv.image} className="w-12 h-12 rounded-lg object-cover" alt="Service" />}
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files[0])} className="text-xs text-gray-400" />
        </div>
      </div>

      <button
        onClick={() => handleSave(srv)}
        disabled={savingId === srv.id}
        className={`w-full py-2 rounded-lg font-bold text-xs transition active:scale-95 ${
          savingId === srv.id ? "bg-gray-700 text-gray-500" : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
        }`}
      >
        {savingId === srv.id ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
