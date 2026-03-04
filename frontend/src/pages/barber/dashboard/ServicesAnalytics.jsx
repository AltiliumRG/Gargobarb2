import { useState } from "react";
import { Scissors, TrendingUp, DollarSign, BarChart3, PieChart, Info, Plus, Settings2 } from "lucide-react";
import ServiceModal from "../../../components/barber/dashboard/ServiceModal";

export default function ServicesAnalytics({ data }) {
    const { stats, addService } = data;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const mostRequested = [...stats.incomeByService].sort((a, b) => b.count - a.count)[0];
    const leastRequested = [...stats.incomeByService].sort((a, b) => a.count - b.count)[0];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Análisis de Servicios</h2>
                    <p className="text-gray-500">Popularidad y rentabilidad por tipo de servicio</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/10"
                >
                    <Plus size={16} /> Nuevo Servicio
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp size={18} className="text-yellow-500" />
                        <span className="text-xs font-black text-yellow-500 uppercase tracking-widest">Estrella</span>
                    </div>
                    <p className="text-2xl font-black text-white tracking-tighter uppercase">{mostRequested?.name || "N/A"}</p>
                    <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-widest">{mostRequested?.count} solicitudes</p>
                </div>

                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Info size={18} className="text-blue-500" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">A Reforzar</span>
                    </div>
                    <p className="text-2xl font-black text-white tracking-tighter uppercase">{leastRequested?.name || "N/A"}</p>
                    <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-widest">{leastRequested?.count} solicitudes</p>
                </div>

                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign size={18} className="text-green-500" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Más Rentable</span>
                    </div>
                    <p className="text-2xl font-black text-white tracking-tighter uppercase">{stats.incomeByService[0]?.name || "N/A"}</p>
                    <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-widest">${stats.incomeByService[0]?.value.toLocaleString()} generados</p>
                </div>
            </div>

            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-8 overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
                    <BarChart3 size={18} className="text-yellow-500" />
                    Ingresos y Volumen por Servicio
                </h3>
                <div className="space-y-8">
                    {stats.incomeByService.map((service, i) => (
                        <div key={i} className="group">
                            <div className="flex justify-between items-end mb-3">
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-tighter group-hover:text-yellow-500 transition-colors">{service.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{service.count} citas completadas</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-white">${service.value.toLocaleString()}</p>
                                    <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">
                                        {stats.totalIncome > 0 ? Math.round((service.value / stats.totalIncome) * 100) : 0}% del total
                                    </p>
                                </div>
                            </div>
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 group-hover:from-yellow-500 group-hover:to-yellow-300"
                                    style={{ width: `${stats.incomeByService[0]?.value > 0 ? (service.value / stats.incomeByService[0].value) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addService}
            />
        </div>
    );
}
