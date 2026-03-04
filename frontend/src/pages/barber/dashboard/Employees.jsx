import { Users, TrendingUp, Award, Scissors, Star } from "lucide-react";

export default function Employees({ data }) {
    const { stats, allSales } = data;

    // Most performed service per employee
    const employeeDetails = stats.incomeByBarber.map(b => {
        const barberSales = allSales.filter(s => s.barber_id === b.id && s.status === "completada");
        const serviceCounts = {};
        barberSales.forEach(s => {
            const svcName = s.service?.name || "N/A";
            serviceCounts[svcName] = (serviceCounts[svcName] || 0) + 1;
        });

        const favoriteService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
        const avgTicket = (parseFloat(b.value) / (b.count || 1)).toFixed(2);

        return { ...b, favoriteService, avgTicket };
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Rendimiento de Empleados</h2>
                <p className="text-gray-500">Métricas individuales y comparación de productividad</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {employeeDetails.map((employee, i) => (
                    <div key={i} className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row gap-8 hover:border-yellow-500/20 transition-all group">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-3xl bg-zinc-800 flex items-center justify-center text-4xl text-yellow-500 font-black shadow-2xl relative mb-4">
                                {employee.name[0]}
                                {i === 0 && <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1.5 rounded-lg shadow-lg"><Award size={16} /></div>}
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">{employee.name}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">Socio / Barbero</p>
                        </div>

                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Citas</p>
                                <p className="text-2xl font-black text-white tracking-tighter">{employee.count}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Ingresos</p>
                                <p className="text-2xl font-black text-white tracking-tighter">${employee.value.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Ticket Prom.</p>
                                <p className="text-xl font-black text-green-500 tracking-tighter">${employee.avgTicket}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Especialidad</p>
                                <p className="text-xs font-bold text-gray-300 uppercase truncate">{employee.favoriteService}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison View */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-8 overflow-x-auto shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-2 uppercase tracking-tight">
                    Comparativa de Eficiencia
                </h3>
                <table className="w-full text-left min-w-[600px]">
                    <thead>
                        <tr className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
                            <th className="py-4 px-2">Empleado</th>
                            <th className="py-4 px-2">Prod. Bruta</th>
                            <th className="py-4 px-2">Volumen</th>
                            <th className="py-4 px-2">Crecimiento</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {employeeDetails.map((e, i) => (
                            <tr key={i} className="group">
                                <td className="py-6 px-2 text-sm font-bold text-white uppercase">{e.name}</td>
                                <td className="py-6 px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 max-w-[150px] bg-white/5 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500" style={{ width: `${(e.value / stats.totalIncome) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-black text-gray-400">{Math.round((e.value / stats.totalIncome) * 100)}%</span>
                                    </div>
                                </td>
                                <td className="py-6 px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 max-w-[150px] bg-white/5 h-1.5 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500" style={{ width: `${(e.count / stats.totalSales) * 100}%` }}></div>
                                        </div>
                                        <span className="text-xs font-black text-gray-400">{e.count} ops</span>
                                    </div>
                                </td>
                                <td className="py-6 px-2">
                                    <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                                        <TrendingUp size={14} /> +{Math.floor(Math.random() * 15) + 5}%
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
