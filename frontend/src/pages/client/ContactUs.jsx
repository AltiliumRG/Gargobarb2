import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

const ContactUs = () => {
    const { theme } = useTheme();
    const isClassic = theme === "classic";
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            toast.success("Mensaje enviado con éxito. Te contactaremos pronto.");
            setLoading(false);
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Contacto</h1>
                <p className={`text-lg ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                    Estamos a un clic de distancia. Cuéntanos cómo podemos ayudarte.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Nombre Completo</label>
                        <input
                            required
                            className={`w-full p-4 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-yellow-500 ${isClassic ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-gray-200"}`}
                            placeholder="Juan Pérez"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Correo</label>
                        <input
                            required
                            type="email"
                            className={`w-full p-4 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-yellow-500 ${isClassic ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-gray-200"}`}
                            placeholder="juan@ejemplo.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Mensaje</label>
                        <textarea
                            required
                            rows="5"
                            className={`w-full p-4 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-yellow-500 resize-none ${isClassic ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-gray-200"}`}
                            placeholder="¿En qué podemos ayudarte?"
                        />
                    </div>
                    <button
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-tighter shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20"}`}
                    >
                        {loading ? "Enviando..." : <><Send size={20} /> Enviar Mensaje</>}
                    </button>
                </form>

                <div className="space-y-8">
                    <div className={`p-8 rounded-[2.5rem] border ${isClassic ? "bg-zinc-900/40 border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
                        <h3 className="text-xl font-bold mb-6 italic uppercase tracking-tight">Información de contacto</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500">
                                    <MapPin size={24} />
                                </div>
                                <p className="font-medium">Calle 123 #45-67, Medellín, Colombia</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400">
                                    <Mail size={24} />
                                </div>
                                <p className="font-medium">hola@gargobarb.com</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400">
                                    <Phone size={24} />
                                </div>
                                <p className="font-medium">+57 321 000 0000</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
