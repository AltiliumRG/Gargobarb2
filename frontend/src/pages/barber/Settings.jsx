import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBarbershopById, updateBarbershop } from "../../api/barber.api";
import { Building2, Home, Globe, MapPin, Save } from "lucide-react";
import LocationPickerGoogle from "../../components/Maps/LocationPickerGoogle";
import { SwitchPro } from "../../components/builder/PropertyEditors/Shared/SwitchPro";
import toast from "react-hot-toast";

export default function Settings() {
  const { barbershopId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [formData, setFormData] = useState({
    name: "",
    country: "Colombia",
    department: "",
    departmentId: null,
    city: "",
    address: "",
    latitude: null,
    longitude: null,
    is_active: true
  });

  // Load Barbershop Data
  useEffect(() => {
    const fetchBarbershop = async () => {
      try {
        const res = await getBarbershopById(barbershopId);
        setFormData({
          name: res.data.name || "",
          country: res.data.country || "Colombia",
          department: res.data.department || "",
          city: res.data.city || "",
          address: res.data.address || "",
          latitude: res.data.latitude,
          longitude: res.data.longitude,
          is_active: res.data.is_active
        });
      } catch (err) {
        console.error("❌ Error loading barbershop:", err);
        toast.error("Error al cargar los datos de la barbería");
      } finally {
        setLoading(false);
      }
    };
    fetchBarbershop();
  }, [barbershopId]);

  // Load Departments
  useEffect(() => {
    fetch("/api/geo/departments")
      .then(res => res.json())
      .then(res => setDepartments(res))
      .catch(err => console.error("Error cargando departamentos", err));
  }, []);

  // Load Cities when department changes
  useEffect(() => {
    if (!formData.department) return;
    
    // Find department ID if not set (on initial load)
    const depObj = departments.find(d => d.name === formData.department);
    const depId = depObj?.id || formData.departmentId;

    if (depId) {
      fetch(`/api/geo/cities/${depId}`)
        .then(res => res.json())
        .then(res => setCities(res))
        .catch(err => console.error("Error cargando ciudades", err));
    }
  }, [formData.department, departments]);

  const updateData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateBarbershop(barbershopId, formData);
      toast.success("Configuración guardada correctamente");
    } catch (err) {
      console.error("❌ Error saving settings:", err);
      toast.error(err.response?.data?.error || "Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-400 font-medium">Cargando configuración...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Configuración</h1>
          <p className="text-gray-400 mt-1">Administra los datos básicos y la visibilidad de tu negocio.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 active:scale-95"
        >
          <Save size={18} />
          {saving ? "Guardando..." : "Guardar cambios"}
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
                  <Home size={12} /> Dirección Exacta
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
