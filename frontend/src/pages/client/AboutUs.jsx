import React from "react";
import { motion } from "framer-motion";
import { Info, Users, Award, ShieldCheck } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const AboutUs = () => {
    const { theme } = useTheme();
    const isClassic = theme === "classic";

    return (
        <div className="max-w-6xl mx-auto p-8">
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
        </div>
    );
};

export default AboutUs;
