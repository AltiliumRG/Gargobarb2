import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Scissors, Globe, Layout, Smartphone, ArrowRight, CheckCircle } from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { theme } = useTheme();

    const isClassic = theme === "classic";

    useEffect(() => {
        if (user && user.role_id !== 3) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 font-sans ${isClassic ? "bg-[#0b0f14] text-white selection:bg-[#D4AF37]/30" : "bg-[#F8F6F2] text-[#1C1C1C] selection:bg-[#D4AF37]/20"
            }`}>
            <nav className="fixed top-0 w-full z-50 bg-[#0b0f14]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <Scissors className="text-black" size={24} />
                        </div>
                        <span className={`text-2xl font-black tracking-tighter uppercase italic transition-colors ${isClassic ? "text-white" : "text-[#1C1C1C]"
                            }`}>GargoBarb</span>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <button
                                onClick={() => navigate("/client/home")}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${isClassic
                                    ? "bg-[#D4AF37] hover:bg-[#B8860B] text-black shadow-[#D4AF37]/10"
                                    : "bg-[#1C1C1C] hover:bg-black text-white shadow-black/10"
                                    }`}
                            >
                                Mi Panel <ArrowRight size={18} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
                                    className={`font-semibold transition-colors hidden sm:block ${isClassic ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
                                        }`}
                                >
                                    Iniciar sesión
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${isClassic
                                        ? "bg-white hover:bg-gray-200 text-black"
                                        : "bg-[#D4AF37] hover:bg-[#B8860B] text-white"
                                        }`}
                                >
                                    Regístrate gratis
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] blur-[120px] rounded-full -z-10 transition-colors duration-1000 ${isClassic ? "bg-[#D4AF37]/10" : "bg-[#D4AF37]/5"
                    }`} />

                <motion.div
                    className="max-w-5xl mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 transition-colors ${isClassic
                        ? "bg-white/5 border-white/10 text-[#D4AF37]"
                        : "bg-black/5 border-black/5 text-[#D4AF37]"
                        }`}>
                        <span className={`flex h-2 w-2 rounded-full animate-pulse ${isClassic ? "bg-[#D4AF37]" : "bg-[#D4AF37]"}`}></span>
                        TRANSFORMA TU NEGOCIO HOY
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        TU BARBERÍA,<br />NIVEL PROFESIONAL.
                    </motion.h1>

                    <motion.p variants={itemVariants} className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium transition-colors ${isClassic ? "text-gray-400" : "text-gray-600"
                        }`}>
                        Crea tu sitio web, gestiona citas y haz crecer tu marca con la plataforma más potente para barberos modernos.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate(user ? "/client/home" : "/register")}
                            className={`w-full sm:w-auto px-10 py-5 text-lg font-black rounded-2xl transition-all shadow-2xl active:scale-95 ${isClassic
                                ? "bg-[#D4AF37] hover:bg-[#B8860B] text-black shadow-[#D4AF37]/20"
                                : "bg-[#1C1C1C] hover:bg-black text-white shadow-black/20"
                                }`}
                        >
                            EMPEZAR AHORA
                        </button>
                        {!user && (
                            <button
                                onClick={() => navigate("/login")}
                                className={`w-full sm:w-auto px-10 py-5 text-lg font-bold rounded-2xl transition-all active:scale-95 border ${isClassic
                                    ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                                    : "bg-white hover:bg-gray-50 border-gray-200 text-[#1C1C1C]"
                                    }`}
                            >
                                Ver Demo
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            </section>

            <section className={`py-20 px-6 transition-colors ${isClassic ? "bg-[#020202]" : "bg-gray-100/50"}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Layout className={isClassic ? "text-[#D4AF37]" : "text-[#D4AF37]"} size={32} />,
                                title: "Editor de Sitios",
                                desc: "Crea una página web impresionante en minutos con nuestro editor visual drag & drop."
                            },
                            {
                                icon: <Smartphone className="text-blue-400" size={32} />,
                                title: "Gestión de Citas",
                                desc: "Permite que tus clientes reserven 24/7 sin llamadas, todo automatizado."
                            },
                            {
                                icon: <Globe className="text-green-400" size={32} />,
                                title: "Dominio Propio",
                                desc: "Consigue una dirección profesional para que te encuentren en todo el mundo."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className={`p-8 rounded-3xl border transition-all group ${isClassic
                                    ? "bg-zinc-900/50 border-white/5 hover:border-[#D4AF37]/20"
                                    : "bg-white border-gray-100 hover:border-[#D4AF37]/30 shadow-sm hover:shadow-md"
                                    }`}
                            >
                                <div className="mb-6 p-4 bg-black/40 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className={`text-2xl font-bold mb-3 ${isClassic ? "text-white" : "text-[#1C1C1C]"}`}>{feature.title}</h3>
                                <p className={isClassic ? "text-gray-400" : "text-gray-600"}>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className={`max-w-4xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl transition-all ${isClassic
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                    : "bg-gradient-to-r from-[#1C1C1C] to-gray-800"
                    }`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    <h2 className={`text-4xl md:text-5xl font-black leading-tight mb-8 transition-colors ${isClassic ? "text-black" : "text-white"
                        }`}>
                        ÚNETE A LA RED DE BARBERÍAS MÁS EXITOSA
                    </h2>
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                        {['Soporte 24/7', 'Sin comisiones', 'Actualizaciones gratis'].map((item, i) => (
                            <div key={i} className={`flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-sm ${isClassic ? "bg-black/10 text-black" : "bg-white/10 text-white"
                                }`}>
                                <CheckCircle size={16} /> {item}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate("/register")}
                        className={`px-12 py-5 text-xl font-black rounded-2xl transition-all shadow-xl active:scale-95 ${isClassic
                            ? "bg-black text-white hover:bg-zinc-900"
                            : "bg-[#D4AF37] text-black hover:bg-[#B8860B]"
                            }`}
                    >
                        CREAR MI CUENTA GRATIS
                    </button>
                </div>
            </section>

            <footer className={`py-12 border-t px-6 transition-colors ${isClassic ? "border-white/5 bg-[#030303]" : "border-gray-100 bg-gray-50/50"}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className={`flex items-center gap-2 transition-all ${isClassic ? "grayscale hover:grayscale-0" : ""}`}>
                        <span className={`text-xl font-black tracking-tighter uppercase italic ${isClassic ? "text-gray-400" : "text-[#1C1C1C]"}`}>GargoBarb</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">
                        © {new Date().getFullYear()} GargoBarb Inc. Todos los derechos reservados.
                    </p>
                    <div className={`flex gap-6 text-sm font-bold transition-colors ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                        <a href="#" className="hover:text-[#D4AF37]">Términos</a>
                        <a href="#" className="hover:text-[#D4AF37]">Privacidad</a>
                        <a href="#" className="hover:text-[#D4AF37]">Contacto</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;