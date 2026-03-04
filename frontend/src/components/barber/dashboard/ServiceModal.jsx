import { useState } from "react";
import { X, Save, Scissors, DollarSign, Clock, AlignLeft } from "lucide-react";

export default function ServiceModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        duration_minutes: "30",
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        setFormData({ name: "", description: "", price: "", duration_minutes: "30" });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#0c0c0e] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-500 p-2 rounded-xl">
                            <Scissors size={20} className="text-black" />
                        </div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Nuevo Servicio</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                Nombre del Servicio
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="Ej. Corte Normal, Barba Express..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all placeholder:text-gray-600"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Descripción */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                Descripción
                            </label>
                            <textarea
                                placeholder="Breve descripción del servicio..."
                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all placeholder:text-gray-600 h-24 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Precio */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <DollarSign size={12} /> Precio
                                </label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            {/* Duración */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock size={12} /> Duración (min)
                                </label>
                                <input
                                    required
                                    type="number"
                                    placeholder="30"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-yellow-500/50 outline-none transition-all"
                                    value={formData.duration_minutes}
                                    onChange={e => setFormData({ ...formData, duration_minutes: e.target.value })}
                                />
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
                            <Save size={18} /> Crear Servicio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
