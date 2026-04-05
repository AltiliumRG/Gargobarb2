import React from "react";
import { Building2, Globe, MapPin, Save, Loader2 } from "lucide-react";
import LocationPickerGoogle from "../../../components/Maps/LocationPickerGoogle";
import { SwitchPro } from "../../../components/builder/PropertyEditors/Shared/SwitchPro";
import { UploadDropzone } from "../../../components/builder/PropertyEditors/Shared/UploadDropzone";

export default function BarbershopSection({
  formData,
  updateData,
  handleSave,
  saving,
  departments,
  cities,
}) {
  return (
    <div className="space-y-8">
      {/* HEADER ACTIONS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Mi Barbería</h2>
          <p className="text-gray-400 text-sm">Administra los datos básicos y la visibilidad de tu negocio.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 active:scale-95 min-w-[180px]"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save size={18} />
              Guardar cambios
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: DATOS Y VISIBILIDAD */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* VISIBILIDAD CARD */}
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                  <Globe size={20} />
                </div>
                <h3 className="font-bold text-white">Estado del sitio</h3>
             </div>
             
             <SwitchPro 
               label="Barbería Visible (Pública)"
               checked={formData.is_active}
               onChange={(val) => updateData({ is_active: val })}
             />
             <p className="text-xs text-gray-500 italic leading-relaxed">
               Si desactivas esta opción, tu sitio web no será accesible para los clientes y no aparecerá en los listados.
             </p>
          </div>
          
          {/* LOGO CARD */}
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                  <Building2 size={20} />
                </div>
                <h3 className="font-bold text-white">Identidad Visual</h3>
             </div>
             
             <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="shrink-0">
                   {formData.logo_url ? (
                     <img 
                       src={formData.logo_url} 
                       alt="Logo" 
                       className="w-32 h-32 rounded-2xl object-cover border-2 border-yellow-500/30 shadow-2xl"
                     />
                   ) : (
                     <div className="w-32 h-32 rounded-2xl bg-zinc-800 flex items-center justify-center border-2 border-dashed border-white/10 text-gray-500">
                        <Building2 size={40} />
                     </div>
                   )}
                </div>
                <div className="flex-1 w-full">
                   <UploadDropzone 
                     label="Sube tu Logo"
                     sublabel="PNG, JPG o WEBP recomendados (1:1)"
                     onUpload={(url) => updateData({ logo_url: url })}
                     onRemove={() => updateData({ logo_url: null })}
                     currentImage={formData.logo_url}
                   />
                </div>
             </div>
          </div>

          {/* DATOS BASICOS CARD */}
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                  <Building2 size={20} />
                </div>
                <h3 className="font-bold text-white">Información General</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2 block">Nombre del Negocio</label>
                <input
                  className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-yellow-500 outline-none transition"
                  placeholder="Ej: Empire Barber Studio"
                  value={formData.name}
                  onChange={(e) => updateData({ name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-gray-500 mb-2 block">País</label>
                  <select
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
                    value={formData.country}
                    onChange={(e) => updateData({ country: e.target.value })}
                  >
                    <option value="Colombia">Colombia</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-gray-500 mb-2 block">Departamento</label>
                  <select
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
                    value={formData.department}
                    onChange={(e) => {
                      const selected = departments.find(d => d.name === e.target.value);
                      updateData({
                        department: selected?.name || "",
                        departmentId: selected?.id || null,
                        city: ""
                      });
                    }}
                  >
                    <option value="">Selecciona...</option>
                    {departments.map(dep => (
                      <option key={dep.id} value={dep.name}>{dep.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-gray-500 mb-2 block">Ciudad</label>
                  <select
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white outline-none"
                    disabled={!formData.department}
                    value={formData.city}
                    onChange={(e) => updateData({ city: e.target.value })}
                  >
                    <option value="">Selecciona...</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.name}>{city.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: MAPA Y DIRECCION */}
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-6 h-full">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
                  <MapPin size={20} />
                </div>
                <h3 className="font-bold text-white">Ubicación Geográfica</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase text-gray-500 mb-2 block flex items-center gap-2">
                   Dirección Exacta
                </label>
                <LocationPickerGoogle
                  data={formData}
                  updateData={updateData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
