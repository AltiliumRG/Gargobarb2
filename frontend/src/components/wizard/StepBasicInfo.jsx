import { useEffect, useState } from "react";
import { useWizard } from "../../context/WizardContext";
import { Building2, Home } from "lucide-react";
import LocationPickerGoogle from "../Maps/LocationPickerGoogle";

export default function StepBasicInfo() {

  const { data, updateData } = useWizard();

  const [departments, setDepartments] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  /* ============================================================
     📍 Cargar departamentos
  ============================================================ */
  useEffect(() => {
    fetch("/api/geo/departments")
      .then(res => res.json())
      .then(res => {
        setDepartments(res);
        setLoadingDepartments(false);
      })
      .catch(err => {
        console.error("Error cargando departamentos", err);
        setLoadingDepartments(false);
      });
  }, []);

  /* ============================================================
     📍 Cargar ciudades
  ============================================================ */
  useEffect(() => {

    if (!data.departmentId) return;

    setLoadingCities(true);

    fetch(`/api/geo/cities/${data.departmentId}`)
      .then(res => res.json())
      .then(res => {
        setCities(res);
        setLoadingCities(false);
      })
      .catch(err => {
        console.error("Error cargando ciudades", err);
        setLoadingCities(false);
      });

  }, [data.departmentId]);

  return (
    <div className="space-y-6">

      {/* ======================================================
          🧾 NOMBRE
      ====================================================== */}
      <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-3">
        <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 flex items-center gap-2">
          <Building2 size={12} /> Nombre de tu Negocio
        </label>

        <input
          className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white"
          placeholder="Ej: Empire Barber Studio"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
        />
      </div>

      {/* ======================================================
          🌍 UBICACIÓN JERÁRQUICA
      ====================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* País */}
        <div>
          <label className="text-[10px] uppercase text-gray-500">País</label>
          <select
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white"
            value={data.country}
            onChange={(e) => updateData({ country: e.target.value })}
          >
            <option value="Colombia">Colombia</option>
          </select>
        </div>

        {/* Departamento */}
        <div>
          <label className="text-[10px] uppercase text-gray-500">Departamento</label>

          <select
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white"
            disabled={loadingDepartments}
            value={data.department}
            onChange={(e) => {
              const selected = departments.find(d => d.name === e.target.value);

              updateData({
                department: selected.name,
                departmentId: selected.id,
                city: "",
                latitude: null,
                longitude: null,
                address: ""
              });
            }}
          >
            <option value="">Selecciona...</option>
            {departments.map(dep => (
              <option key={dep.id} value={dep.name}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        {/* Ciudad */}
        <div>
          <label className="text-[10px] uppercase text-gray-500">Ciudad</label>

          <select
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white"
            disabled={!data.department || loadingCities}
            value={data.city}
            onChange={(e) =>
              updateData({
                city: e.target.value,
                latitude: null,
                longitude: null,
                address: ""
              })
            }
          >
            <option value="">Selecciona...</option>
            {cities.map(city => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* ======================================================
          📍 DIRECCIÓN GOOGLE MAPS
      ====================================================== */}
      <div>
        <label className="text-[10px] uppercase text-gray-500 flex items-center gap-2">
          <Home size={12} /> Dirección Exacta
        </label>

        <LocationPickerGoogle
          data={data}
          updateData={updateData}
        />
      </div>

    </div>
  );
}