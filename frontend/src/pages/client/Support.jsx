import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, MessageCircle, FileText, PhoneCall, X, Send, Bot, ExternalLink, Download } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { faqs } from "./Faqs";

const Support = () => {
    const { theme } = useTheme();
    const isClassic = theme === "classic";
    const navigate = useNavigate();
    const [isBotOpen, setIsBotOpen] = useState(false);

    return (
        <div className="max-w-6xl mx-auto p-8 lg:p-16 relative">
            <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-2xl transition hover:scale-105 active:scale-95 border ${isClassic ? "border-white/10 hover:bg-white/5 text-gray-400" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
            >
                <ArrowLeft size={18} /> Volver
            </button>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16 text-center"
            >
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                    Soporte <span className="text-yellow-500">GargoBarb</span>
                </h1>
                <p className={`text-xl max-w-2xl mx-auto font-medium ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                    ¿Necesitas ayuda con tu barbería digital? Estamos disponibles 24/7 para que tu negocio nunca se detenga.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <button
                    onClick={() => navigate("/client/faqs")}
                    className={`p-10 rounded-[3rem] border group transition-all text-left ${isClassic ? "bg-zinc-900 border-white/5 hover:border-yellow-500/40" : "bg-white border-gray-100 shadow-xl hover:shadow-2xl"}`}
                >
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-3xl flex items-center justify-center text-yellow-500 mb-8 group-hover:scale-110 transition-transform">
                        <HelpCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 italic flex items-center gap-2">FAQs <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                    <p className={`text-base leading-relaxed ${isClassic ? "text-gray-400" : "text-gray-600"}`}>Resolución inmediata a las dudas más comunes de nuestros barberos.</p>
                </button>

                <a
                    href="/Manual de usuario.docx.pdf"
                    download
                    className={`p-10 rounded-[3rem] border group transition-all text-left ${isClassic ? "bg-zinc-900 border-white/5 hover:border-blue-500/40" : "bg-white border-gray-100 shadow-xl hover:shadow-2xl"}`}
                >
                    <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 italic flex items-center gap-2">Manual <Download size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                    <p className={`text-base leading-relaxed ${isClassic ? "text-gray-400" : "text-gray-600"}`}>Descarga la guía completa para configurar tu barbería paso a paso.</p>
                </a>

                <button
                    onClick={() => window.open(`https://wa.me/573014501600?text=Hola GargoBarb, necesito ayuda con...`, '_blank')}
                    className={`p-10 rounded-[3rem] border group transition-all text-left ${isClassic ? "bg-zinc-900 border-white/5 hover:border-green-500/40" : "bg-white border-gray-100 shadow-xl hover:shadow-2xl"}`}
                >
                    <div className="w-16 h-16 bg-green-500/10 rounded-3xl flex items-center justify-center text-green-400 mb-8 group-hover:scale-110 transition-transform">
                        <MessageCircle size={32} />
                    </div>
                    <h3 className="text-2xl font-black mb-3 italic flex items-center gap-2">WhatsApp <ExternalLink size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" /></h3>
                    <p className={`text-base leading-relaxed ${isClassic ? "text-gray-400" : "text-gray-600"}`}>Chatea directamente con nuestro equipo técnico por WhatsApp.</p>
                </button>
            </div>

            <div className={`relative p-12 lg:p-20 rounded-[4rem] border overflow-hidden ${isClassic ? "bg-[#D4AF37] text-black" : "bg-[#1C1C1C] text-white"} text-center`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                <PhoneCall size={64} className="mx-auto mb-8 opacity-20" />
                <h2 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">¿Atención personalizada?</h2>
                <p className="text-xl mb-12 font-bold opacity-80 italic">Llámanos directamente al +57 301 450 16 00</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href="tel:+573014501600"
                        className={`px-12 py-5 rounded-2xl font-black uppercase text-base transition-all active:scale-95 flex items-center justify-center gap-2 ${isClassic ? "bg-black text-white hover:bg-zinc-900" : "bg-[#D4AF37] text-black hover:bg-[#B8860B]"}`}
                    >
                        <PhoneCall size={20} /> Llamar ahora
                    </a>
                </div>
            </div>

            {/* FLOATING BOT BUTTON */}
            <button
                onClick={() => setIsBotOpen(true)}
                className="fixed bottom-10 right-10 w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-2xl z-50 hover:scale-110 transition-transform active:scale-90 animate-bounce"
            >
                <Bot size={40} />
            </button>

            {/* BOT MODAL */}
            <AnimatePresence>
                {isBotOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        className={`fixed bottom-32 right-10 w-[400px] max-h-[600px] rounded-[3rem] shadow-2xl z-50 border flex flex-col overflow-hidden ${isClassic ? "bg-zinc-900 border-white/10" : "bg-white border-gray-100"}`}
                    >
                        <div className="p-8 bg-yellow-500 text-black flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bot size={32} />
                                <div>
                                    <p className="font-black text-xl italic uppercase leading-none">GargoBot</p>
                                    <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mt-1">Asistente Virtual</p>
                                </div>
                            </div>
                            <button onClick={() => setIsBotOpen(false)} className="hover:rotate-90 transition-transform">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-transparent to-black/5">
                            <div className={`p-5 rounded-3xl rounded-tl-none ${isClassic ? "bg-white/5" : "bg-gray-100"}`}>
                                <p className="text-sm font-medium">¡Hola! 👋 Soy GargoBot. ¿En qué puedo ayudarte hoy? Aquí tienes algunas de las preguntas más frecuentes:</p>
                            </div>

                            <div className="space-y-3">
                                {faqs.slice(0, 4).map((faq, i) => (
                                    <button
                                        key={i}
                                        onClick={() => navigate("/client/faqs")}
                                        className={`w-full p-4 rounded-2xl text-left text-xs font-bold transition-all border ${isClassic ? "border-white/5 hover:bg-white/5 hover:border-yellow-500/30" : "bg-white border-gray-200 hover:border-yellow-500/30 shadow-sm"}`}
                                    >
                                        {faq.question}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 border-t border-white/5 bg-transparent">
                            <button
                                onClick={() => navigate("/client/faqs")}
                                className="w-full py-4 rounded-2xl bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                            >
                                Ver todas las FAQs <Send size={14} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Support;
