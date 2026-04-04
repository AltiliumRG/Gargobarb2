import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search, MessageCircle, Sparkles, ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export const faqs = [
    {
        question: "¿Cómo puedo crear mi propia página web?",
        answer: "Es muy sencillo. Solo ve a la sección 'Editor de Sitios' en tu panel de barbero, elige una plantilla y comienza a personalizar los colores, textos e imágenes de tu negocio."
    },
    {
        question: "¿Puedo usar mi propio dominio personalizado?",
        answer: "¡Sí! En la sección de configuración de tu sitio, puedes vincular tu propio dominio (ej. www.tubarberia.com) para darle un toque más profesional a tu marca."
    },
    {
        question: "¿Cómo funciona el sistema de citas?",
        answer: "Tus clientes acceden a tu enlace personalizado, eligen el servicio, el barbero y la hora disponible. Tú recibirás una notificación de inmediato y la cita se agendará automáticamente en tu calendario."
    },
    {
        question: "¿Cuáles son los métodos de pago aceptados?",
        answer: "Aceptamos todas las tarjetas de crédito/débito, transferencias bancarias y pagos en efectivo en puntos autorizados a través de nuestra pasarela de pagos segura."
    },
    {
        question: "¿Tiene algún costo mensual?",
        answer: "GargoBarb ofrece un plan gratuito con funciones básicas. Para acceder a herramientas avanzadas como dominio propio y analíticas, contamos con planes premium muy accesibles."
    },
    {
        question: "¿Cómo contacto al soporte técnico?",
        answer: "Puedes escribirnos directamente a través del chat en vivo en la sección de Soporte, enviarnos un correo a leiderquirama@gmail.com o contactarnos por WhatsApp al +57 301 450 16 00."
    },
    {
        question: "¿Puedo cancelar mi suscripción en cualquier momento?",
        answer: "¡Claro! No tenemos contratos de permanencia. Puedes cancelar o cambiar tu plan desde la configuración de tu cuenta cuando lo desees."
    }
];

const Faqs = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isClassic = theme === "classic";
    const [searchTerm, setSearchTerm] = useState("");
    const [activeIndex, setActiveIndex] = useState(null);

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFaq = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 lg:p-16">
            <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-2xl transition hover:scale-105 active:scale-95 border ${isClassic ? "border-white/10 hover:bg-white/5 text-gray-400" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
            >
                <ArrowLeft size={18} /> Volver
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-500 font-bold mb-6">
                    <Sparkles size={16} /> Centro de Ayuda
                </div>
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">Preguntas <span className="text-yellow-500">Frecuentes</span></h1>
                <p className={`text-lg max-w-2xl mx-auto ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                    Encuentra respuestas rápidas a todas tus dudas sobre el uso de la plataforma y cómo potenciar tu barbería.
                </p>
            </motion.div>

            {/* BUSCADOR */}
            <div className="relative mb-12">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={24} />
                <input
                    type="text"
                    placeholder="Busca tu duda (ej. dominio, citas, pagos...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-16 pr-8 py-6 rounded-[2rem] text-lg font-medium border outline-none transition-all ${isClassic ? "bg-zinc-900/50 border-white/5 focus:border-yellow-500/50 text-white" : "bg-white border-gray-100 shadow-xl focus:border-yellow-500/30"}`}
                />
            </div>

            {/* LISTA DE FAQS */}
            <div className="space-y-4">
                {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-3xl border transition-all overflow-hidden ${activeIndex === index ? (isClassic ? "bg-zinc-900 border-yellow-500/30" : "bg-white border-yellow-500/30 shadow-lg") : (isClassic ? "bg-zinc-900/40 border-white/5 hover:border-white/10" : "bg-white border-gray-100 hover:border-gray-200")}`}
                        >
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-8 text-left"
                            >
                                <span className="text-xl font-bold pr-8">{faq.question}</span>
                                <ChevronDown
                                    className={`transition-transform duration-300 flex-shrink-0 ${activeIndex === index ? "rotate-180 text-yellow-500" : "text-gray-500"}`}
                                />
                            </button>
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={`p-8 pt-0 text-lg leading-relaxed ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                                            <div className="h-px w-full bg-gray-100 dark:bg-white/5 mb-6" />
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-gray-500/5 rounded-[3rem] border border-dashed border-gray-500/20">
                        <MessageCircle size={48} className="mx-auto mb-4 text-gray-500 opacity-30" />
                        <h3 className="text-xl font-bold mb-2 text-gray-400">No encontramos resultados</h3>
                        <p className="text-gray-500">Prueba con otras palabras clave.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Faqs;
