import { useWizard } from "../../context/WizardContext";
import { locationData } from "../../data/LocationData";
import { Globe, Building2, Home } from "lucide-react";

export default function StepBasicInfo() {
  const { data, updateData } = useWizard();

  /* 🏗️ LÓGICA DE FILTRADO JERÁRQUICO
     Obtenemos las opciones dependientes basadas en la selección actual.
  */

  /* 🏗️ LÓGICA DE FILTRADO JERÁRQUICO
     Obtenemos las opciones dependientes basadas en la selección actual.
  */
  const currentCountry = locationData.find((c) => c.country === data.country);
  const departments = currentCountry?.departments || [];
  const cities = departments.find((d) => d.name === data.department)?.cities || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* SECCIÓN: IDENTIDAD */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
        <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 flex items-center gap-2">
          <Building2 size={12} /> Nombre de tu Negocio
        </label>
        <input
          className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-yellow-500 transition outline-none font-bold"
          placeholder="Ej: Empire Barber Studio"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
        />
      </div>

      {/* SECCIÓN: UBICACIÓN JERÁRQUICA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* País */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 flex items-center gap-2">
            <Globe size={12} /> País
          </label>
          <select
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-yellow-500 outline-none"
            value={data.country}
            onChange={(e) => updateData({ country: e.target.value, department: "", city: "" })}
          >
            {locationData.map(c => <option key={c.country} value={c.country}>{c.country}</option>)}
          </select>
        </div>

        {/* Departamento */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Departamento</label>
          <select
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-yellow-500 outline-none disabled:opacity-30"
            value={data.department}
            disabled={!data.country}
            onChange={(e) => updateData({ department: e.target.value, city: "" })}
          >
            <option value="">Selecciona...</option>
            {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
        </div>

        {/* Ciudad */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-black text-gray-500">Ciudad</label>
          <select
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-yellow-500 outline-none disabled:opacity-30"
            value={data.city}
            disabled={!data.department}
            onChange={(e) => updateData({ city: e.target.value })}
          >
            <option value="">Selecciona...</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* SECCIÓN: DIRECCIÓN */}
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 flex items-center gap-2">
          <Home size={12} /> Dirección Exacta
        </label>
        <input
          className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-yellow-500 outline-none font-medium"
          placeholder="Calle 123 #45-67..."
          value={data.address}
          onChange={(e) => updateData({ address: e.target.value })}
        />
      </div>
    </div>
  );
}
