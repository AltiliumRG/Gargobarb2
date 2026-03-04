import { useState, useEffect } from "react";
import { X, Save, DollarSign, User, Scissors, Calendar, Clock, CreditCard } from "lucide-react";
import { format } from "date-fns";

export default function SaleModal({ isOpen, onClose, services, barbers, onSubmit }) {
    const [formData, setFormData] = useState({
        client_name: "",
        service_id: "",
        barber_id: "",
        price: "",
        payment_method: "efectivo",
        status: "completada",
        date: format(new Date(), "yyyy-MM-dd"),
        time: format(new Date(), "HH:mm"),
    });

    useEffect(() => {
        if (formData.service_id) {
            const selected = services.find(s => s.id === parseInt(formData.service_id));
            if (selected) {
                setFormData(prev => ({ ...prev, price: selected.price }));
            }
        }
    }, [formData.service_id, services]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0c0c0e] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-2 rounded-xl">
                            <DollarSign size={20} className="text-black" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nueva Venta</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Cliente */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} /> Cliente
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Nombre del cliente"
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all placeholder:text-gray-600"
                                value={formData.client_name}
                                onChange={e => setFormData({ ...formData, client_name: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Servicio */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Scissors size={12} /> Servicio
                                </label>
                                <select
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.service_id}
                                    onChange={e => setFormData({ ...formData, service_id: e.target.value })}
                                >
                                    <option value="" className="bg-zinc-900">Seleccionar</option>
                                    {services.map(s => <option key={s.id} value={s.id} className="bg-zinc-900">{s.name}</option>)}
                                </select>
                            </div>

                            {/* Barbero */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <User size={12} /> Barbero
                                </label>
                                <select
                                    required
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.barber_id}
                                    onChange={e => setFormData({ ...formData, barber_id: e.target.value })}
                                >
                                    <option value="" className="bg-zinc-900">Seleccionar</option>
                                    {barbers.map(b => <option key={b.id} value={b.id} className="bg-zinc-900">{b.full_name || b.username}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Fecha */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={12} /> Fecha
                                </label>
                                <input
                                    required
                                    type="date"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>

                            {/* Hora */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={12} /> Hora
                                </label>
                                <input
                                    required
                                    type="time"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Precio */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign size={12} /> Precio Final
                                </label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            {/* Método de Pago */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <CreditCard size={12} /> Método Pago
                                </label>
                                <select
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all appearance-none cursor-pointer"
                                    value={formData.payment_method}
                                    onChange={e => setFormData({ ...formData, payment_method: e.target.value })}
                                >
                                    <option value="efectivo" className="bg-zinc-900">Efectivo</option>
                                    <option value="tarjeta" className="bg-zinc-900">Tarjeta</option>
                                    <option value="transferencia" className="bg-zinc-900">Transferencia</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-4 bg-yellow-500 hover:bg-yellow-400 text-black rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Registrar Venta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
