import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Info, Users, Award, ShieldCheck, ArrowLeft } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AboutUs = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const isClassic = theme === "classic";

    return (
        <div className="max-w-6xl mx-auto p-8 lg:p-16">
            <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-2xl transition hover:scale-105 active:scale-95 border ${isClassic ? "border-white/10 hover:bg-white/5 text-gray-400" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
            >
                <ArrowLeft size={18} /> Volver
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 text-center"
            >
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Sobre Nosotros</h1>
                <p className={`text-lg max-w-2xl mx-auto ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                    En GargoBarb, nuestra misión es revolucionar la experiencia de la barbería conectando a los mejores profesionales con clientes que valoran el estilo y la calidad.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                    { icon: <Info />, title: "Nuestra Visión", desc: "Digitalizar el sector de la belleza con tecnología intuitiva." },
                    { icon: <Users />, title: "Comunidad", desc: "Más de 500 barberías confían en nosotros diariamente." },
                    { icon: <Award />, title: "Calidad", desc: "Garantizamos estándares premium en cada reserva." },
                    { icon: <ShieldCheck />, title: "Seguridad", desc: "Tus datos y transacciones están siempre protegidos." }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className={`p-6 rounded-3xl border ${isClassic ? "bg-zinc-900/50 border-white/5" : "bg-white border-gray-100 shadow-sm"}`}
                    >
                        <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-black mb-4">
                            {item.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                        <p className={`text-sm ${isClassic ? "text-gray-400" : "text-gray-600"}`}>{item.desc}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="mt-20"
            >
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Desarrolladores</h2>
                    <div className="w-24 h-1.5 bg-yellow-500 mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { name: "David Quintero", img: "/David Quintero.jpeg", quote: "\"La tecnología es el pincel con el que pintamos el futuro del estilo.\"" },
                        { name: "Leider Quirama", img: "/Leider Quirama.jpeg", quote: "\"Innovar no es solo crear algo nuevo, es mejorar la vida de los demás.\"" },
                        { name: "Miguel sanchez", img: "/Miguel Sanchez.jpeg", quote: "\"El código es poesía en movimiento que resuelve problemas reales.\"" }
                    ].map((dev, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className={`p-8 rounded-[3rem] text-center border transition-all ${isClassic ? "bg-zinc-900 border-white/5 hover:border-yellow-500/20" : "bg-white border-gray-100 shadow-xl hover:shadow-2xl"}`}
                        >
                            <div className="relative w-40 h-40 mx-auto mb-6">
                                <div className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                                <img
                                    src={dev.img}
                                    alt={dev.name}
                                    className="relative w-full h-full object-cover rounded-full border-4 border-yellow-500 shadow-2xl"
                                />
                            </div>
                            <h3 className="text-2xl font-black mb-2">{dev.name}</h3>
                            <p className={`text-sm italic leading-relaxed ${isClassic ? "text-gray-400" : "text-gray-600"}`}>
                                {dev.quote}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AboutUs;
