import React from "react";
import { motion } from "framer-motion";
import { HelpCircle, MessageCircle, FileText, PhoneCall } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const Support = () => {
    const { theme } = useTheme();
    const isClassic = theme === "classic";

    return (
        <div className="max-w-6xl mx-auto p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Soporte y Ayuda</h1>
                <p className={`text-lg max-w-2xl mx-auto ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                    ¿Tienes alguna duda o problema? Nuestro equipo está aquí para ayudarte en lo que necesites.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { icon: <HelpCircle />, title: "FAQs", desc: "Respuestas directas a las preguntas más comunes." },
                    { icon: <FileText />, title: "Guías", desc: "Tutoriales paso a paso para dominar la plataforma." },
                    { icon: <MessageCircle />, title: "Chat Vivo", desc: "Habla con un agente en tiempo real (9 AM - 6 PM)." }
                ].map((item, i) => (
                    <button
                        key={i}
                        className={`p-8 rounded-3xl border text-left transition-all ${isClassic ? "bg-zinc-900/50 border-white/5 hover:border-yellow-500/30" : "bg-white border-gray-100 hover:border-yellow-500/30 shadow-sm"}`}
                    >
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 mb-4">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className={`text-sm ${isClassic ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
                    </button>
                ))}
            </div>

            <div className={`p-8 rounded-[2.5rem] border ${isClassic ? "bg-[#D4AF37] text-black" : "bg-[#1C1C1C] text-white"} text-center`}>
                <PhoneCall size={48} className="mx-auto mb-6 opacity-30" />
                <h2 className="text-3xl font-black mb-4 uppercase">¿Asistencia Inmediata?</h2>
                <p className="mb-8 font-medium">Llámanos directamente al +57 321 000 0000</p>
                <button className={`px-8 py-4 rounded-2xl font-black uppercase text-sm ${isClassic ? "bg-black text-white" : "bg-[#D4AF37] text-black"}`}>
                    Llamar ahora
                </button>
            </div>
        </div>
    );
};

export default Support;
