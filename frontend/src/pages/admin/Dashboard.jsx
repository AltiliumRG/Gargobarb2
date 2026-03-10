// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Users, Store, Sparkles } from "lucide-react";
import { getDashboardStats } from "../../api/admin.api";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("🔄 Obteniendo estadísticas del dashboard...");
        const data = await getDashboardStats();
        console.log("✅ Datos recibidos:", data);
        setStats(data);
        setError(null);
      } catch (error) {
        console.error("❌ Error obteniendo estadísticas:", error);
        setError(error.message);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#0f0f0f] text-zinc-100 flex flex-col px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-emerald-900/40 animate-pulse"></div>
          <div className="h-8 w-48 bg-zinc-800 rounded-lg animate-pulse"></div>
        </div>

        {/* Skeleton Grid for KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-[#1a1a1a] border border-zinc-800/50 p-6 rounded-2xl h-36 animate-pulse"></div>
          ))}
        </div>

        {/* Skeleton for Table */}
        <div className="bg-[#1a1a1a] border border-zinc-800/50 p-6 rounded-2xl h-80 animate-pulse"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#0f0f0f] text-zinc-100 flex flex-col px-4 md:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-amber-500">
          <Sparkles size={28} className="text-amber-400" />
          <span className="text-zinc-50">Resumen General</span>
        </h1>
        
        <div className="bg-red-950/30 border border-red-800/60 p-6 rounded-2xl">
          <p className="text-red-400 font-semibold">❌ Error cargando datos:</p>
          <p className="text-red-300 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const kpis = stats?.kpis || {};
  const recentUsers = stats?.recentUsers || [];

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-zinc-100 flex flex-col px-4 md:px-8 py-8 font-sans">

      {/* Header */}
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-amber-500">
        <Sparkles size={28} className="text-amber-400" />
        <span className="text-zinc-50">Resumen General</span>
      </h1>

      {/* KPI Section - Now simplified to 2 main cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 drop-shadow-xl">

        {/* KPI 1: Total Usuarios */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-zinc-800/60 p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute -right-4 -top-4 bg-amber-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 border border-amber-900/30 bg-amber-950/30 rounded-xl text-amber-500">
              <Users size={24} />
            </div>
            <h2 className="text-lg font-medium text-zinc-400">Total Usuarios</h2>
          </div>
          <p className="text-5xl font-extrabold text-zinc-50 tracking-tight">{kpis.totalUsers ?? "—"}</p>
          <div className="mt-4 text-xs text-amber-500/60 font-medium uppercase tracking-widest">Registrados en la plataforma</div>
        </div>

        {/* KPI 2: Barberías Activas */}
        <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-zinc-800/60 p-8 rounded-2xl shadow-lg relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute -right-4 -top-4 bg-amber-500/10 w-32 h-32 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 border border-amber-900/30 bg-amber-950/30 rounded-xl text-amber-500">
              <Store size={24} />
            </div>
            <h2 className="text-lg font-medium text-zinc-400">Barberías Activas</h2>
          </div>
          <p className="text-5xl font-extrabold text-zinc-50 tracking-tight">{kpis.totalBarbershops ?? "—"}</p>
          <div className="mt-4 text-xs text-amber-500/60 font-medium uppercase tracking-widest">Negocios vinculados</div>
        </div>

      </div>

      {/* Usuarios Recientes - Compact section */}
      <div className="bg-[#1a1a1a]/80 backdrop-blur-sm border border-zinc-800/60 p-6 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Users className="text-amber-500" size={18} />
          </div>
          <h2 className="text-lg font-bold text-zinc-100">Últimos Registros</h2>
        </div>

        <div className="space-y-2">
          {recentUsers.length > 0 ? (
            recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3 bg-zinc-800/20 rounded-lg hover:bg-zinc-800/40 transition-colors">
                <span className="text-sm text-zinc-100 font-medium">{u.username}</span>
                <span className="text-xs text-zinc-500">{format(new Date(u.createdAt), "dd MMM, yyyy", { locale: es })}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-zinc-500 italic py-4">No hay registros recientes</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
