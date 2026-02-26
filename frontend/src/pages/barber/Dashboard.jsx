import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBarbershopById } from "../../api/barber.api";
import { Layout, Calendar, Settings, Eye, Edit3 } from "lucide-react";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { barbershopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (barbershopId) {
            getBarbershopById(barbershopId)
                .then((res) => {
                    setShop(res.data);
                })
                .catch((err) => {
                    console.error("Error cargando barbería:", err);
                    toast.error("No se pudo cargar la información de la barbería");
                })
                .finally(() => setLoading(true)); // Debería ser false, corregido abajo
        }
    }, [barbershopId]);

    // Corregir el estado de carga
    useEffect(() => {
        if (shop) setLoading(false);
    }, [shop]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    const cards = [
        {
            title: "Editor de Sitio",
            desc: "Personaliza la apariencia y bloques de tu web.",
            icon: <Layout className="text-blue-400" />,
            action: () => navigate(`/barber/builder/${barbershopId}`),
            color: "border-blue-500/20 hover:border-blue-500/50"
        },
        {
            title: "Horarios",
            desc: "Configura tus horas de apertura y cierre.",
            icon: <Calendar className="text-green-400" />,
            action: () => navigate(`/barber/schedule/${barbershopId}`),
            color: "border-green-500/20 hover:border-green-500/50"
        },
        {
            title: "Vista Previa",
            desc: "Mira cómo ven tus clientes tu barbería.",
            icon: <Eye className="text-yellow-400" />,
            action: () => navigate(`/barber/preview/${shop.Sites?.[0]?.id || 0}`),
            color: "border-yellow-500/20 hover:border-yellow-500/50"
        },
        {
            title: "Configuración",
            desc: "Edita información básica de la barbería.",
            icon: <Settings className="text-purple-400" />,
            action: () => toast.success("Próximamente..."),
            color: "border-purple-500/20 hover:border-purple-500/50"
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10">
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">
                    {shop?.name}
                </h1>
                <p className="text-gray-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Panel de Control Administrativo
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <button
                        key={i}
                        onClick={card.action}
                        className={`bg-zinc-900/40 backdrop-blur-md border ${card.color} p-6 rounded-2xl text-left transition-all group hover:scale-[1.02] shadow-xl`}
                    >
                        <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                            {card.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                    </button>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-zinc-900/20 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Edit3 size={20} className="text-yellow-500" />
                        Resumen de Actividad
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-gray-400">Estado del sitio</span>
                            <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Publicado</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-gray-400">Dirección</span>
                            <span className="text-white text-sm">{shop?.address}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <span className="text-gray-400">Ciudad</span>
                            <span className="text-white text-sm">{shop?.city}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-yellow-500/20">
                        <Eye className="text-black" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Ver sitio público</h3>
                    <p className="text-gray-400 text-sm mb-6">Visualiza cómo tus clientes experimentan tu barbería hoy.</p>
                    <button
                        onClick={() => navigate(`/barber/preview/${shop.Sites?.[0]?.id || 0}`)}
                        className="w-full bg-white hover:bg-gray-100 text-black py-3 rounded-xl font-extrabold transition-all active:scale-95"
                    >
                        LANZAR PREVIEW
                    </button>
                </div>
            </div>
        </div>
    );
}
