import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBarbershopById, updateBarbershop } from "../../api/barber.api";
import { 
    LayoutDashboard, 
    User, 
    ShieldCheck, 
    Store, 
    ArrowLeft,
    Settings as SettingsIcon,
    CreditCard
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-hot-toast";

// Modular Sections
import BarbershopSection from "./SettingsSections/BarbershopSection";
import ProfileSection from "./SettingsSections/ProfileSection";
import SecuritySection from "./SettingsSections/SecuritySection";
import PaymentSection from "./SettingsSections/PaymentSection";

export default function Settings() {
  const { barbershopId } = useParams();
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [activeTab, setActiveTab] = useState("barberia");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Barbershop State
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
    logo_url: null,
    is_active: true,
    payment_method: "",
    payment_data: null
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
          logo_url: res.data.logo_url,
          is_active: res.data.is_active,
          payment_method: res.data.site?.payment_method || "",
          payment_data: res.data.site?.payment_data || null
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

  const handleSaveBarbershop = async () => {
    setSaving(true);
    try {
      await updateBarbershop(barbershopId, formData);
      toast.success("Configuración de barbería guardada");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al guardar cambios");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-gray-500 gap-4">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
        <p className="font-bold animate-pulse uppercase tracking-widest text-xs">Cargando Configuración...</p>
      </div>
    );
  }

  const tabs = [
    { id: "barberia", label: "Mi Barbería", icon: <Store size={18} /> },
    { id: "pagos", label: "Finanzas y Pagos", icon: <CreditCard size={18} /> },
    { id: "perfil", label: "Mi Perfil", icon: <User size={18} /> },
    { id: "seguridad", label: "Seguridad", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate(-1)}
                className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition hover:bg-white/10"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3">
                    Configuración <SettingsIcon className="text-yellow-500 animate-spin-slow" />
                </h1>
                <p className="text-gray-500 font-medium">Gestiona tu negocio y cuenta personal desde un solo lugar.</p>
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* SIDEBAR TABS */}
        <aside className="lg:w-72 shrink-0">
            <nav className="flex flex-col gap-2 p-2 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all
                            ${activeTab === tab.id 
                                ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20 scale-105 z-10" 
                                : "text-gray-500 hover:text-white hover:bg-white/5"}
                        `}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </nav>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
            {activeTab === "barberia" && (
                <BarbershopSection 
                    formData={formData}
                    updateData={updateData}
                    handleSave={handleSaveBarbershop}
                    saving={saving}
                    departments={departments}
                    cities={cities}
                />
            )}
            
            {activeTab === "perfil" && (
                <ProfileSection user={user} login={login} />
            )}

            {activeTab === "seguridad" && (
                <SecuritySection user={user} />
            )}
            
            {activeTab === "pagos" && (
                <PaymentSection 
                    barbershopId={barbershopId}
                    initialMethod={formData.payment_method}
                    initialData={formData.payment_data}
                />
            )}
        </main>

      </div>
    </div>
  );
}

