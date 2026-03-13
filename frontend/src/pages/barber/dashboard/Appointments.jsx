import { Calendar, AlertCircle, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

export default function Appointments({ data }) {
    const { allSales, stats } = data;

    const pending = allSales.filter(s => s.status === "pendiente");
    const cancelled = allSales.filter(s => s.status === "cancelada");
    const completed = allSales.filter(s => s.status === "completada");

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Gestión de Citas</h2>
                <p className="text-gray-500">Control de agenda, cancelaciones y efectividad</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar size={18} className="text-yellow-500" />
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Pendientes</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">{pending.length}</p>
                    <p className="text-xs text-gray-400 mt-2 uppercase font-bold tracking-widest">Esperando atención</p>
                </div>

                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <XCircle size={18} className="text-red-500" />
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Canceladas</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">{cancelled.length}</p>
                    <p className="text-xs text-red-500/80 mt-2 uppercase font-bold tracking-widest">{stats.cancellationRate}% de tasa</p>
                </div>

                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 size={18} className="text-green-500" />
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Efectividad</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">
                        {Math.round((completed.length / (allSales.length || 1)) * 100)}%
                    </p>
                    <p className="text-xs text-green-500/80 mt-2 uppercase font-bold tracking-widest">Conversión a venta</p>
                </div>
            </div>

            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-8">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
                    Ranking de Mayores Ganancias por Barbero
                </h3>
                <div className="space-y-6">
                    {stats.incomeByBarber.map((b, i) => (
                        <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-black ${i === 0 ? "bg-yellow-500" : "bg-zinc-700 text-zinc-400"}`}>
                                {i + 1}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-white uppercase">{b.name}</p>
                                <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div
                                        className="h-full bg-yellow-500 transition-all duration-1000"
                                        style={{ width: `${(b.value / (stats.incomeByBarber[0].value || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-black text-white">${b.value.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{b.count} citas</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
