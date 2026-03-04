import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
    Search,
    ChevronUp,
    ChevronDown,
    Filter,
    Download,
    AlertCircle,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Plus,
    Upload
} from "lucide-react";
import toast from "react-hot-toast";
import SaleModal from "../../../components/barber/dashboard/SaleModal";

export default function SalesHistory({ data }) {
    const { allSales, BARBERS, SERVICES, availableBarbers, availableServices, addNewSale, importSales } = data;

    // States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
    const [filters, setFilters] = useState({
        barber: "",
        service: "",
        method: "",
        status: ""
    });

    // Filtering Logic
    const filteredData = useMemo(() => {
        return allSales.filter(sale => {
            const barberName = sale.barber?.full_name || sale.barber?.username || "N/A";
            const serviceName = sale.service?.name || "N/A";
            const saleIdStr = String(sale.id);

            const matchesSearch =
                saleIdStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                sale.client_name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesBarber = !filters.barber || barberName === filters.barber;
            const matchesService = !filters.service || serviceName === filters.service;
            const matchesMethod = !filters.method || sale.payment_method === filters.method;
            const matchesStatus = !filters.status || sale.status === filters.status;

            return matchesSearch && matchesBarber && matchesService && matchesMethod && matchesStatus;
        });
    }, [allSales, searchTerm, filters]);

    // Sorting Logic
    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "asc" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "completada": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "cancelada": return "bg-red-500/10 text-red-400 border-red-500/20";
            case "reembolsada": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            case "pendiente": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "completada": return <CheckCircle2 size={12} />;
            case "cancelada": return <XCircle size={12} />;
            case "reembolsada": return <RotateCcw size={12} />;
            case "pendiente": return <AlertCircle size={12} />;
            default: return null;
        }
    };

    const exportToCSV = () => {
        if (sortedData.length === 0) return;

        const headers = ["ID Venta", "Fecha", "Hora", "Cliente", "Servicio", "Barbero", "Precio", "Metodo Pago", "Estado"];
        const rows = sortedData.map(sale => [
            `#${sale.id}`,
            sale.date,
            sale.time,
            sale.client_name,
            sale.service?.name || "N/A",
            sale.barber?.full_name || sale.barber?.username || "N/A",
            sale.price,
            sale.payment_method,
            sale.status
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);

        link.setAttribute("href", url);
        link.setAttribute("download", `historial_ventas_${format(new Date(), "yyyy-MM-dd")}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const text = event.target.result;
                const lines = text.split("\n").filter(l => l.trim().length > 0);
                if (lines.length < 2) {
                    toast.error("Archivo CSV vacío o inválido");
                    return;
                }

                const salesToImport = lines.slice(1).map(line => {
                    const values = line.split(",").map(v => v.trim());
                    // Expected structure (matching export): ID, Fecha, Hora, Cliente, Servicio, Barbero, Precio, Metodo, Estado
                    const serviceName = values[4];
                    const barberName = values[5];

                    const service = availableServices.find(s => s.name.toLowerCase() === serviceName?.toLowerCase());
                    const barber = availableBarbers.find(b =>
                        (b.full_name?.toLowerCase() === barberName?.toLowerCase()) ||
                        (b.username?.toLowerCase() === barberName?.toLowerCase())
                    );

                    if (!service || !barber) return null;

                    return {
                        date: values[1],
                        time: values[2],
                        client_name: values[3],
                        service_id: service.id,
                        barber_id: barber.id,
                        price: parseFloat(values[6]),
                        payment_method: values[7]?.toLowerCase() || "efectivo",
                        status: values[8]?.toLowerCase() || "completada"
                    };
                }).filter(s => s !== null);

                if (salesToImport.length > 0) {
                    await importSales(salesToImport);
                    e.target.value = ""; // Clear input
                } else {
                    toast.error("No se encontraron registros válidos (Verifica que los servicios y barberos existan)");
                }
            } catch (err) {
                console.error("CSV Parse Error:", err);
                toast.error("Error al procesar el archivo CSV");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Historial de Ventas</h2>
                <p className="text-gray-500">Listado detallado de todas las transacciones históricas</p>
            </div>

            {/* Filters Bar */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 lg:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por ID o Cliente..."
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-gray-600 focus:border-yellow-500/50 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <select
                        className="bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-sm text-gray-300 outline-none focus:border-yellow-500/50 transition-all uppercase font-bold tracking-widest cursor-pointer"
                        value={filters.barber}
                        onChange={(e) => setFilters({ ...filters, barber: e.target.value })}
                    >
                        <option value="">Todos los Barberos</option>
                        {BARBERS.map(b => <option key={b} value={b}>{b.toUpperCase()}</option>)}
                    </select>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 border border-yellow-500/20 rounded-2xl py-3 px-6 text-xs font-black text-black uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/10"
                    >
                        <Plus size={16} /> Nueva Venta
                    </button>

                    <button
                        onClick={() => setFilters({ barber: "", service: "", method: "", status: "" })}
                        className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl py-3 px-4 text-xs font-black text-white uppercase tracking-widest transition-all"
                    >
                        <RotateCcw size={14} /> Limpiar Filtros
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <select
                        className="bg-zinc-900 border border-white/5 rounded-xl py-2 px-3 text-[10px] text-gray-400 outline-none"
                        value={filters.service}
                        onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                    >
                        <option value="">Cualquier Servicio</option>
                        {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                    <select
                        className="bg-zinc-900 border border-white/5 rounded-xl py-2 px-3 text-[10px] text-gray-400 outline-none uppercase font-bold"
                        value={filters.method}
                        onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                    >
                        <option value="">Método de Pago</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                    <select
                        className="bg-zinc-900 border border-white/5 rounded-xl py-2 px-3 text-[10px] text-gray-400 outline-none uppercase font-bold"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">Estado</option>
                        <option value="completada">Completada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="reembolsada">Reembolsada</option>
                        <option value="pendiente">Pendiente</option>
                    </select>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">
                            <Upload size={12} /> Importar CSV
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleImportCSV}
                            />
                        </label>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-yellow-400 transition-colors"
                        >
                            <Download size={12} /> Exportar CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-white/5">
                                {[
                                    { key: "id", label: "ID Venta" },
                                    { key: "date", label: "Fecha/Hora" },
                                    { key: "client", label: "Cliente" },
                                    { key: "service", label: "Servicio" },
                                    { key: "barber", label: "Barbero" },
                                    { key: "price", label: "Precio" },
                                    { key: "method", label: "Pago" },
                                    { key: "status", label: "Estado" },
                                ].map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => requestSort(col.key)}
                                        className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer hover:text-white transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {col.label}
                                            {sortConfig.key === col.key ? (
                                                sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                                            ) : null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {sortedData.slice(0, 50).map((sale) => (
                                <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono text-gray-500 font-bold">#{sale.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white uppercase">{sale.date}</span>
                                            <span className="text-[10px] text-gray-500">{sale.time}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-white uppercase tracking-tight">{sale.client_name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-300">{sale.service?.name || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-gray-400 font-bold uppercase">{sale.barber?.full_name || sale.barber?.username || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-yellow-500 tracking-tighter">${sale.price}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{sale.payment_method}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(sale.status)}`}>
                                            {getStatusIcon(sale.status)}
                                            {sale.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {sortedData.length === 0 && (
                        <div className="py-20 text-center">
                            <AlertCircle size={40} className="mx-auto text-gray-800 mb-4" />
                            <p className="text-gray-500 font-medium italic">No se encontraron ventas con los filtros aplicados</p>
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="p-4 border-t border-white/5 bg-white/5 flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                        Mostrando {Math.min(sortedData.length, 50)} de {sortedData.length} registros
                    </p>
                    <div className="flex gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                        <span>Resumen Página:</span>
                        <span className="text-white">${sortedData.slice(0, 50).reduce((s, a) => s + (a.status === 'completada' ? parseFloat(a.price) : 0), 0).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <SaleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                barbers={availableBarbers}
                services={availableServices}
                onSubmit={addNewSale}
            />
        </div>
    );
}
