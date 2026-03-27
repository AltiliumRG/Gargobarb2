import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { Smartphone, Clock, Calendar, Bell, ArrowLeft, ArrowRight } from "lucide-react";

const AppointmentsInfo = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isClassic = theme === "classic";

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className={`relative min-h-screen transition-colors duration-500 font-sans text-white`}>
            {/* Global Background */}
            <div
                className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/Wallpaper.webp')", backgroundAttachment: "fixed" }}
            />
            <div className={`fixed inset-0 -z-10 transition-colors duration-1000 ${isClassic ? "bg-black/90" : "bg-black/70"}`} />
            <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] blur-[120px] rounded-full -z-10 transition-colors duration-1000 ${isClassic ? "bg-blue-500/10" : "bg-blue-400/5"}`} />

            {/* Navbar Simplified */}
            <nav className="fixed top-0 w-full z-50 bg-[#0b0f14]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-bold">Volver al Inicio</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/GargobarbLogo.png" alt="GargoBarb Logo" className="w-10 h-10 drop-shadow-[0_0_8px_#3B82F6]" />
                        <span className="text-xl font-black tracking-tighter uppercase italic text-white hidden sm:block">GargoBarb</span>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="pt-32 pb-20 px-6">
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto">
                    
                    {/* Hero Area */}
                    <div className="text-center mb-20">
                        <motion.div variants={itemVariants} className="inline-flex items-center justify-center p-6 bg-blue-500/10 rounded-3xl mb-8">
                            <Smartphone className="text-blue-400" size={48} />
                        </motion.div>
                        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            Gestión de Citas <br /> <span className="text-blue-400">Automatizada</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Olvídate de responder mensajes a deshoras. Permite que tus clientes agenden su próximo corte en cualquier momento y mantén tu agenda llena y organizada.
                        </motion.p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        {[
                            {
                                icon: <Clock size={32} className="text-blue-400" />,
                                title: "Disponibilidad 24/7",
                                desc: "Tus clientes pueden ver tus horarios libres y reservar en cualquier momento, incluso cuando estás durmiendo o atendiendo a otro cliente."
                            },
                            {
                                icon: <Bell size={32} className="text-yellow-400" />,
                                title: "Recordatorios Automáticos",
                                desc: "Reduce drásticamente las inasistencias. El sistema envía notificaciones para recordarles la cita a tus clientes."
                            },
                            {
                                icon: <Calendar size={32} className="text-green-400" />,
                                title: "Control Total de Agenda",
                                desc: "Bloquea horas de almuerzo, vacaciones o imprevistos de manera sencilla desde tu panel de control."
                            },
                            {
                                icon: <Smartphone size={32} className="text-purple-400" />,
                                title: "Optimizado para Móviles",
                                desc: "El proceso de reserva es extremadamente fluido y fácil de usar desde cualquier teléfono inteligente, garantizando la mejor experiencia."
                            }
                        ].map((feat, i) => (
                            <motion.div key={i} variants={itemVariants} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/20 transition-colors">
                                <div className="mb-4 bg-black/30 w-16 h-16 flex items-center justify-center rounded-2xl">{feat.icon}</div>
                                <h3 className="text-2xl font-bold mb-2">{feat.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <motion.div variants={itemVariants} className="text-center bg-gradient-to-br from-zinc-800 to-zinc-900 p-12 rounded-[3rem] border border-white/10">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Simplifica tu manera de trabajar</h2>
                        <button onClick={() => navigate("/register")} className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors">
                            Abrir mi Agenda <ArrowRight size={20} />
                        </button>
                    </motion.div>

                </motion.div>
            </main>
        </div>
    );
};

export default AppointmentsInfo;
