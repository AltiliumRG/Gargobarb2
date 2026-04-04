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
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const email = formData.get("email");
        const userSubject = formData.get("subject");
        const message = formData.get("message");

        const subject = encodeURIComponent(`${userSubject} - de ${name}`);
        const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);
        
        // Gmail web compose URL
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=leiderquirama@gmail.com&su=${subject}&body=${body}`;
        
        window.open(gmailUrl, '_blank');
        toast.success("Abriendo Gmail para completar el envío...");
        e.target.reset();
    };

    return (
        <div className="max-w-6xl mx-auto p-8 lg:p-16">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-500 font-bold mb-6">
                    <Send size={16} /> Hablemos
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4">Contacto</h1>
                <p className={`text-xl max-w-2xl font-medium ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                    ¿Tienes una idea en mente o necesitas soporte personalizado? Estamos a un clic de distancia.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-3">Nombre Completo</label>
                            <input
                                name="name"
                                required
                                className={`w-full p-5 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-yellow-500/50 ${isClassic ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-gray-200"}`}
                                placeholder="Tu nombre"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-3">Correo Electrónico</label>
                            <input
                                name="email"
                                required
                                type="email"
                                className={`w-full p-5 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-yellow-500/50 ${isClassic ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-gray-200"}`}
                                placeholder="tu@correo.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-3">Asunto</label>
                        <input
                            name="subject"
                            required
                            className={`w-full p-5 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-yellow-500/50 ${isClassic ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-gray-200"}`}
                            placeholder="¿De qué trata tu mensaje?"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-3">Tu Mensaje</label>
                        <textarea
                            name="message"
                            required
                            rows="6"
                            className={`w-full p-5 rounded-2xl border transition-all outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none ${isClassic ? "bg-zinc-900 border-white/5 text-white" : "bg-white border-gray-200"}`}
                            placeholder="¿En qué podemos ayudarte?"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black shadow-yellow-500/20`}
                    >
                        Abrir en Gmail <Send size={20} />
                    </button>
                </form>

                <div className="space-y-10">
                    <div className={`p-10 rounded-[3rem] border ${isClassic ? "bg-zinc-900 border-white/5" : "bg-white border-gray-100 shadow-xl"}`}>
                        <h3 className="text-2xl font-black mb-10 italic uppercase tracking-tight">Canales oficiales</h3>
                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-[#C6A75E]">Ubicación</p>
                                    <p className="text-lg font-bold">Medellín, Colombia</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                    <Mail size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-400">Escríbenos</p>
                                    <p className="text-lg font-bold">leiderquirama@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 group">
                                <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-green-400">WhatsApp</p>
                                    <p className="text-lg font-bold">+57 301 450 16 00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
