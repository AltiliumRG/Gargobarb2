import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from "recharts";
import {
    Calendar,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Filter,
    Download,
    Award
} from "lucide-react";
import { format, startOfDay, subDays, startOfWeek, startOfMonth, startOfYear } from "date-fns";

const COLORS = ["#eab308", "#3b82f6", "#a855f7", "#22c55e", "#ef4444", "#f97316"];

export default function Income({ data }) {
    const { stats, incomeSeries, setDateRange, filteredSales } = data;

    const setRangeType = (type) => {
        const today = new Date();
        switch (type) {
            case "today": setDateRange({ start: startOfDay(today), end: today }); break;
            case "week": setDateRange({ start: startOfWeek(today), end: today }); break;
            case "month": setDateRange({ start: startOfMonth(today), end: today }); break;
            case "year": setDateRange({ start: startOfYear(today), end: today }); break;
        }
    };

    const highestDay = [...incomeSeries].sort((a, b) => b.income - a.income)[0];
    const lowestDay = [...incomeSeries].filter(d => d.income > 0).sort((a, b) => a.income - b.income)[0];

    const exportData = () => {
        if (filteredSales.length === 0) return;

        const headers = ["Fecha", "Cliente", "Servicio", "Ingreso", "Metodo"];
        const rows = filteredSales.map(s => [
            s.date,
            s.client_name,
            s.service?.name || "N/A",
            s.price,
            s.payment_method
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const URL_blob = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", URL_blob);
        link.setAttribute("download", `analisis_ingresos_${format(new Date(), "yyyy-MM-dd")}.csv`);
        link.click();
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header & Quick Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Análisis de Ingresos</h2>
                    <p className="text-gray-500">Visualiza el rendimiento financiero de tu negocio</p>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/5 overflow-x-auto whitespace-nowrap">
                    {["today", "week", "month", "year"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setRangeType(t)}
                            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-all uppercase"
                        >
                            {t === "today" ? "Hoy" : t === "week" ? "Semana" : t === "month" ? "Mes" : "Año"}
                        </button>
                    ))}
                    <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                    <button className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-yellow-500 hover:bg-yellow-500/10 transition-all flex items-center gap-2">
                        <Filter size={14} /> Personalizar
                    </button>
                </div>
            </div>

            {/* Main Income Chart */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Ingresos Totales</p>
                        <h3 className="text-4xl font-black text-white mt-1 tracking-tighter">${stats.totalIncome.toLocaleString()}</h3>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Venta Promedio</p>
                            <p className="text-lg font-bold text-green-500">${stats.averageTicket}</p>
                        </div>
                        <button
                            onClick={exportData}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 border border-white/5 transition-all"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={incomeSeries}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 10 }}
                                tickFormatter={(val) => `$${val}`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0c0c0e', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                itemStyle={{ color: '#eab308', fontWeight: 800 }}
                                labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="income"
                                stroke="#eab308"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorIncome)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Breakdown by Employee */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
                        <Award size={18} className="text-yellow-500" />
                        Ingresos por Barbero
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.incomeByBarber} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#ffffff', fontSize: 11, fontWeight: 700 }}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: '#ffffff05' }}
                                    contentStyle={{ backgroundColor: '#0c0c0e', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {stats.incomeByBarber.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Breakdown by Service */}
                <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
                        <DollarSign size={18} className="text-blue-500" />
                        Ingresos por Servicio
                    </h3>
                    <div className="h-[300px] flex items-center">
                        <div className="flex-1 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.incomeByService}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.incomeByService.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0c0c0e', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-48 space-y-3">
                            {stats.incomeByService.map((item, i) => (
                                <div key={i} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                                        <span className="text-[10px] font-bold text-gray-400 truncate uppercase">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-white">${item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-500 p-2 rounded-xl text-black">
                            <TrendingUp size={18} />
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Pico de Ganancias</h4>
                    </div>
                    <p className="text-2xl font-black text-white tracking-tighter">${highestDay?.income || 0}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">{highestDay ? format(parseISO(highestDay.fullDate), "PPPP") : "---"}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-500 p-2 rounded-xl text-white">
                            <TrendingDown size={18} />
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Punto Bajo</h4>
                    </div>
                    <p className="text-2xl font-black text-white tracking-tighter">${lowestDay?.income || 0}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">{lowestDay ? format(parseISO(lowestDay.fullDate), "PPPP") : "---"}</p>
                </div>

                <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-white/10 p-2 rounded-xl text-white">
                            <DollarSign size={18} />
                        </div>
                        <h4 className="text-sm font-black text-white uppercase tracking-widest">Ticket Promedio</h4>
                    </div>
                    <p className="text-2xl font-black text-white tracking-tighter">${stats.averageTicket}</p>
                    <p className="text-xs text-gray-400 mt-1 uppercase font-bold tracking-widest">Por cada servicio completado</p>
                </div>
            </div>
        </div>
    );
}

// Simple helper for dates
const parseISO = (str) => new Date(str + "T00:00:00");
