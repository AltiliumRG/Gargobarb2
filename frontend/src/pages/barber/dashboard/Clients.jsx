import { UserSquare2, TrendingUp, DollarSign, Users, Award, Zap } from "lucide-react";

export default function Clients({ data }) {
    const { stats, allSales } = data;

    // New vs Returning logic (mock simulation based on frequency)
    const returningClients = stats.loyalClients.filter(c => c.count > 1);
    const newClients = stats.loyalClients.filter(c => c.count === 1);

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Análisis de Clientes</h2>
                <p className="text-gray-500">Segmentación, lealtad e ingresos por cliente</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Users size={18} className="text-blue-500" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Base de Datos</span>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tighter">{stats.uniqueClients}</p>
                    <p className="text-xs text-gray-500 mt-2 uppercase font-bold tracking-widest">Clientes únicos totales</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-500 p-2 rounded-xl text-black inline-flex">
                            <TrendingUp size={18} />
                        </div>
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em]">Retención</span>
                    </div>
                    <p className="text-3xl font-black text-white tracking-tighter">
                        {stats.uniqueClients > 0 ? Math.round((returningClients.length / stats.uniqueClients) * 100) : 0}%
                    </p>
                    <p className="text-xs text-yellow-500/70 mt-1 uppercase font-bold tracking-widest">Tasa de Clientes Recurrentes</p>
                </div>

                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Zap size={18} className="text-indigo-500" />
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Adquisición</span>
                    </div>
                    <p className="text-3xl font-black text-white tracking-tighter">{newClients.length}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-widest">Nuevos este periodo (Frecuencia 1)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Most Loyal */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
                        <Star size={18} className="text-yellow-500" />
                        Clientes más fieles (Frecuencia)
                    </h3>
                    <div className="space-y-4">
                        {stats.loyalClients.slice(0, 5).map((c, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-yellow-500 border border-white/10">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-white uppercase tracking-tight">{c.name}</p>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">{c.count} visitas totales</p>
                                </div>
                                <div className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Frecuente</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Highest Revenue */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-8">
                    <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
                        <DollarSign size={18} className="text-green-500" />
                        Clientes de Mayor Valor (Revenue)
                    </h3>
                    <div className="space-y-4">
                        {[...stats.loyalClients].sort((a, b) => b.revenue - a.revenue).slice(0, 5).map((c, i) => (
                            <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-green-500 border border-white/10">
                                    <DollarSign size={16} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-black text-white uppercase tracking-tight">{c.name}</p>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Generado: ${c.revenue.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Inversión Total</p>
                                    <p className="text-sm font-black text-white">${c.revenue}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
