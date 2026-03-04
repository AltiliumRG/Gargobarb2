import {
    Users,
    Scissors,
    CalendarCheck,
    UserCheck,
    Clock,
    ChevronRight,
    TrendingUp,
    AlertCircle
} from "lucide-react";
import { format } from "date-fns";

export default function Overview({ data }) {
    const { stats, BARBERS } = data;

    const kpiCards = [
        { label: "Total Clientes", value: stats.uniqueClients, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Servicios Activos", value: data.SERVICES.length, icon: Scissors, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Citas Hoy", value: stats.todayAppointmentsCount, icon: CalendarCheck, color: "text-yellow-500", bg: "bg-yellow-500/10" },
        { label: "Empleados", value: stats.activeBarbers, icon: UserCheck, color: "text-green-500", bg: "bg-green-500/10" },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Vista General</h2>
                <p className="text-gray-500">Resumen de actividad para hoy, {format(new Date(), "dd 'de' MMMM, yyyy")}</p>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, i) => (
                    <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.bg} ${card.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                <card.icon size={20} />
                            </div>
                            <TrendingUp size={16} className="text-green-500" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                        <h3 className="text-2xl font-black text-white mt-1 uppercase tracking-tighter">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Working Today */}
                <div className="lg:col-span-1 bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-tight">
                        <UserCheck size={18} className="text-yellow-500" />
                        Operadores Hoy
                    </h3>
                    <div className="space-y-4">
                        {BARBERS.map((barber, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5">
                                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-yellow-500 font-bold">
                                    {barber[0]}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white leading-none">{barber}</p>
                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">En Servicio</p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Appointments Breakdown */}
                <div className="lg:col-span-2 bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                            <Clock size={18} className="text-blue-500" />
                            Citas Pendientes por Barbero
                        </h3>
                        <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                            {stats.pendingToday} Total
                        </span>
                    </div>

                    <div className="space-y-6">
                        {stats.pendingByBarber.map((p, i) => (
                            <div key={i}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-bold text-gray-300 uppercase tracking-tighter">{p.name}</span>
                                    <span className="text-sm font-black text-white">{p.count} citas</span>
                                </div>
                                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${(p.count / (stats.pendingToday || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        {stats.pendingToday === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <AlertCircle size={48} className="text-gray-700 mb-4" />
                                <p className="text-gray-500 font-medium italic">No hay citas pendientes para hoy</p>
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-sm font-black text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 group border border-white/5">
                        Ver Agenda Completa
                        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
