<<<<<<< Updated upstream
import React from "react";
=======
<<<<<<< HEAD
import React, { useEffect } from "react";
>>>>>>> Stashed changes
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { Scissors, Globe, Layout, Smartphone, ArrowRight, CheckCircle } from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
<<<<<<< Updated upstream
=======
    const { theme } = useTheme();

    const isClassic = theme === "classic";

    // Si el usuario está logueado y NO es un Cliente (role 3), mandarlo a su panel
    useEffect(() => {
        if (user && user.role_id !== 3) {
            navigate("/dashboard");
        }
    }, [user, navigate]);
=======
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../auth/AuthContext";
import { Scissors, Globe, Layout, Smartphone, ArrowRight, CheckCircle } from "lucide-react";

const Landing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
>>>>>>> origin/David
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        <div className="min-h-screen bg-[#0b0f14] text-white selection:bg-yellow-500/30">
=======
<<<<<<< HEAD
        <div className={`min-h-screen transition-colors duration-500 font-sans ${isClassic ? "bg-[#0b0f14] text-white selection:bg-[#D4AF37]/30" : "bg-[#F8F6F2] text-[#1C1C1C] selection:bg-[#D4AF37]/20"
            }`}>
>>>>>>> Stashed changes
            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full z-50 bg-[#0b0f14]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <Scissors className="text-black" size={24} />
                        </div>
<<<<<<< Updated upstream
                        <span className="text-2xl font-black tracking-tighter uppercase italic">GargoBarb</span>
=======
                        <span className={`text-2xl font-black tracking-tighter uppercase italic transition-colors ${isClassic ? "text-white" : "text-[#1C1C1C]"
                            }`}>GargoBarb</span>
=======
        <div className="min-h-screen bg-[#0b0f14] text-white selection:bg-yellow-500/30">
            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full z-50 bg-[#0b0f14]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                            <Scissors className="text-black" size={24} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic">GargoBarb</span>
>>>>>>> origin/David
>>>>>>> Stashed changes
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <button
<<<<<<< Updated upstream
                                onClick={() => navigate("/dashboard")}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/10"
=======
<<<<<<< HEAD
                                onClick={() => navigate("/client/home")}
                                className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg ${isClassic
                                    ? "bg-[#D4AF37] hover:bg-[#B8860B] text-black shadow-[#D4AF37]/10"
                                    : "bg-[#1C1C1C] hover:bg-black text-white shadow-black/10"
                                    }`}
=======
                                onClick={() => navigate("/dashboard")}
                                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-yellow-500/10"
>>>>>>> origin/David
>>>>>>> Stashed changes
                            >
                                Mi Panel <ArrowRight size={18} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => navigate("/login")}
<<<<<<< Updated upstream
                                    className="text-gray-400 hover:text-white font-semibold transition-colors hidden sm:block"
=======
<<<<<<< HEAD
                                    className={`font-semibold transition-colors hidden sm:block ${isClassic ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
                                        }`}
=======
                                    className="text-gray-400 hover:text-white font-semibold transition-colors hidden sm:block"
>>>>>>> origin/David
>>>>>>> Stashed changes
                                >
                                    Iniciar sesión
                                </button>
                                <button
                                    onClick={() => navigate("/register")}
<<<<<<< Updated upstream
                                    className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg"
=======
<<<<<<< HEAD
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${isClassic
                                        ? "bg-white hover:bg-gray-200 text-black"
                                        : "bg-[#D4AF37] hover:bg-[#B8860B] text-white"
                                        }`}
=======
                                    className="bg-white hover:bg-gray-200 text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg"
>>>>>>> origin/David
>>>>>>> Stashed changes
                                >
                                    Regístrate gratis
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Gradiants decorativos */}
<<<<<<< Updated upstream
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full -z-10" />
=======
<<<<<<< HEAD
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] blur-[120px] rounded-full -z-10 transition-colors duration-1000 ${isClassic ? "bg-[#D4AF37]/10" : "bg-[#D4AF37]/5"
                    }`} />
=======
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full -z-10" />
>>>>>>> origin/David
>>>>>>> Stashed changes

                <motion.div
                    className="max-w-5xl mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
<<<<<<< Updated upstream
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yellow-500 text-sm font-bold mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
=======
<<<<<<< HEAD
                    <motion.div variants={itemVariants} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold mb-8 transition-colors ${isClassic
                        ? "bg-white/5 border-white/10 text-[#D4AF37]"
                        : "bg-black/5 border-black/5 text-[#D4AF37]"
                        }`}>
                        <span className={`flex h-2 w-2 rounded-full animate-pulse ${isClassic ? "bg-[#D4AF37]" : "bg-[#D4AF37]"}`}></span>
>>>>>>> Stashed changes
                        TRANSFORMA TU NEGOCIO HOY
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        TU BARBERÍA,<br />NIVEL PROFESIONAL.
                    </motion.h1>

<<<<<<< Updated upstream
                    <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
=======
                    <motion.p variants={itemVariants} className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium transition-colors ${isClassic ? "text-gray-400" : "text-gray-600"
                        }`}>
=======
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-yellow-500 text-sm font-bold mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></span>
                        TRANSFORMA TU NEGOCIO HOY
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        TU BARBERÍA,<br />NIVEL PROFESIONAL.
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
>>>>>>> origin/David
>>>>>>> Stashed changes
                        Crea tu sitio web, gestiona citas y haz crecer tu marca con la plataforma más potente para barberos modernos.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
<<<<<<< Updated upstream
                            onClick={() => navigate(user ? "/dashboard" : "/register")}
                            className="w-full sm:w-auto px-10 py-5 bg-yellow-500 hover:bg-yellow-400 text-black text-lg font-black rounded-2xl transition-all shadow-2xl shadow-yellow-500/20 active:scale-95"
=======
<<<<<<< HEAD
                            onClick={() => navigate(user ? "/client/home" : "/register")}
                            className={`w-full sm:w-auto px-10 py-5 text-lg font-black rounded-2xl transition-all shadow-2xl active:scale-95 ${isClassic
                                ? "bg-[#D4AF37] hover:bg-[#B8860B] text-black shadow-[#D4AF37]/20"
                                : "bg-[#1C1C1C] hover:bg-black text-white shadow-black/20"
                                }`}
=======
                            onClick={() => navigate(user ? "/dashboard" : "/register")}
                            className="w-full sm:w-auto px-10 py-5 bg-yellow-500 hover:bg-yellow-400 text-black text-lg font-black rounded-2xl transition-all shadow-2xl shadow-yellow-500/20 active:scale-95"
>>>>>>> origin/David
>>>>>>> Stashed changes
                        >
                            EMPEZAR AHORA
                        </button>
                        {!user && (
                            <button
                                onClick={() => navigate("/login")}
<<<<<<< Updated upstream
                                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg font-bold rounded-2xl transition-all active:scale-95"
=======
<<<<<<< HEAD
                                className={`w-full sm:w-auto px-10 py-5 text-lg font-bold rounded-2xl transition-all active:scale-95 border ${isClassic
                                    ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                                    : "bg-white hover:bg-gray-50 border-gray-200 text-[#1C1C1C]"
                                    }`}
=======
                                className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-lg font-bold rounded-2xl transition-all active:scale-95"
>>>>>>> origin/David
>>>>>>> Stashed changes
                            >
                                Ver Demo
                            </button>
                        )}
                    </motion.div>
                </motion.div>
            </section>

            {/* --- FEATURES --- */}
<<<<<<< Updated upstream
            <section className="py-20 px-6 bg-black/30">
=======
<<<<<<< HEAD
            <section className={`py-20 px-6 transition-colors ${isClassic ? "bg-[#020202]" : "bg-gray-100/50"}`}>
=======
            <section className="py-20 px-6 bg-black/30">
>>>>>>> origin/David
>>>>>>> Stashed changes
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
<<<<<<< Updated upstream
                                icon: <Layout className="text-yellow-500" size={32} />,
=======
<<<<<<< HEAD
                                icon: <Layout className={isClassic ? "text-[#D4AF37]" : "text-[#D4AF37]"} size={32} />,
=======
                                icon: <Layout className="text-yellow-500" size={32} />,
>>>>>>> origin/David
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                                className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/20 transition-all group"
=======
<<<<<<< HEAD
                                className={`p-8 rounded-3xl border transition-all group ${isClassic
                                    ? "bg-zinc-900/50 border-white/5 hover:border-[#D4AF37]/20"
                                    : "bg-white border-gray-100 hover:border-[#D4AF37]/30 shadow-sm hover:shadow-md"
                                    }`}
>>>>>>> Stashed changes
                            >
                                <div className="mb-6 p-4 bg-black/40 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
<<<<<<< Updated upstream
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 line-height-relaxed">{feature.desc}</p>
=======
                                <h3 className={`text-2xl font-bold mb-3 ${isClassic ? "text-white" : "text-[#1C1C1C]"}`}>{feature.title}</h3>
                                <p className={isClassic ? "text-gray-400" : "text-gray-600"}>{feature.desc}</p>
=======
                                className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-yellow-500/20 transition-all group"
                            >
                                <div className="mb-6 p-4 bg-black/40 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 line-height-relaxed">{feature.desc}</p>
>>>>>>> origin/David
>>>>>>> Stashed changes
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- TRUST SECTION --- */}
            <section className="py-20 px-6">
<<<<<<< Updated upstream
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

                    <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
=======
<<<<<<< HEAD
                <div className={`max-w-4xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl transition-all ${isClassic
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                    : "bg-gradient-to-r from-[#1C1C1C] to-gray-800"
                    }`}>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

                    <h2 className={`text-4xl md:text-5xl font-black leading-tight mb-8 transition-colors ${isClassic ? "text-black" : "text-white"
                        }`}>
=======
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

                    <h2 className="text-4xl md:text-5xl font-black text-black leading-tight mb-8">
>>>>>>> origin/David
>>>>>>> Stashed changes
                        ÚNETE A LA RED DE BARBERÍAS MÁS EXITOSA
                    </h2>

                    <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
                        {['Soporte 24/7', 'Sin comisiones', 'Actualizaciones gratis'].map((item, i) => (
<<<<<<< Updated upstream
                            <div key={i} className="flex items-center gap-2 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full text-black font-bold text-sm">
=======
<<<<<<< HEAD
                            <div key={i} className={`flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-sm ${isClassic ? "bg-black/10 text-black" : "bg-white/10 text-white"
                                }`}>
=======
                            <div key={i} className="flex items-center gap-2 bg-black/10 backdrop-blur-sm px-4 py-2 rounded-full text-black font-bold text-sm">
>>>>>>> origin/David
>>>>>>> Stashed changes
                                <CheckCircle size={16} /> {item}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate("/register")}
<<<<<<< Updated upstream
                        className="px-12 py-5 bg-black text-white text-xl font-black rounded-2xl hover:bg-zinc-900 transition-all shadow-xl active:scale-95"
=======
<<<<<<< HEAD
                        className={`px-12 py-5 text-xl font-black rounded-2xl transition-all shadow-xl active:scale-95 ${isClassic
                            ? "bg-black text-white hover:bg-zinc-900"
                            : "bg-[#D4AF37] text-black hover:bg-[#B8860B]"
                            }`}
=======
                        className="px-12 py-5 bg-black text-white text-xl font-black rounded-2xl hover:bg-zinc-900 transition-all shadow-xl active:scale-95"
>>>>>>> origin/David
>>>>>>> Stashed changes
                    >
                        CREAR MI CUENTA GRATIS
                    </button>
                </div>
            </section>

            {/* --- FOOTER --- */}
<<<<<<< Updated upstream
            <footer className="py-12 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
                    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                        <span className="text-xl font-black tracking-tighter uppercase italic text-gray-400">GargoBarb</span>
=======
<<<<<<< HEAD
            <footer className={`py-12 border-t px-6 transition-colors ${isClassic ? "border-white/5 bg-[#030303]" : "border-gray-100 bg-gray-50/50"}`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className={`flex items-center gap-2 transition-all ${isClassic ? "grayscale hover:grayscale-0" : ""}`}>
                        <span className={`text-xl font-black tracking-tighter uppercase italic ${isClassic ? "text-gray-400" : "text-[#1C1C1C]"}`}>GargoBarb</span>
>>>>>>> Stashed changes
                    </div>

                    <p className="text-gray-500 text-sm font-medium">
                        © {new Date().getFullYear()} GargoBarb Inc. Todos los derechos reservados.
                    </p>

<<<<<<< Updated upstream
=======
                    <div className={`flex gap-6 text-sm font-bold transition-colors ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                        <a href="#" className="hover:text-[#D4AF37]">Términos</a>
                        <a href="#" className="hover:text-[#D4AF37]">Privacidad</a>
                        <a href="#" className="hover:text-[#D4AF37]">Contacto</a>
=======
            <footer className="py-12 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
                    <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all">
                        <span className="text-xl font-black tracking-tighter uppercase italic text-gray-400">GargoBarb</span>
                    </div>

                    <p className="text-gray-500 text-sm font-medium">
                        © {new Date().getFullYear()} GargoBarb Inc. Todos los derechos reservados.
                    </p>

>>>>>>> Stashed changes
                    <div className="flex gap-6 text-gray-400 text-sm font-bold">
                        <a href="#" className="hover:text-yellow-500">Términos</a>
                        <a href="#" className="hover:text-yellow-500">Privacidad</a>
                        <a href="#" className="hover:text-yellow-500">Contacto</a>
<<<<<<< Updated upstream
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;