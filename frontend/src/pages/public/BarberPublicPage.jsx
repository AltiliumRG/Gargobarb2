import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Phone, MapPin, Star, ChevronRight, Scissors } from "lucide-react";
import barberPublicApi from "../../api/barberPublic.api";
import SectionRendererUniversal from "../../components/renderers/SectionRendererUniversal";

const BarberPublicPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    barberPublicApi.getBySlug(slug).then((res) => {
      console.log("🟢 Datos recibidos en la página pública:", res.data);
      setData(res.data);
    }).catch(err => {
      console.error("🔴 Error al cargar el sitio:", err);
      setData({ error: true });
    });
  }, [slug]);

  if (data?.error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <p className="text-xl text-red-400">Error al cargar la barbería.</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-yellow-600 rounded-lg hover:bg-yellow-700 transition">
          Reintentar
        </button>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-mono">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-2xl font-bold tracking-widest mb-4 flex items-center gap-4 justify-center"
        >
          <Scissors className="animate-bounce" />
          CARGANDO SITIO...
        </motion.div>
        <div className="w-48 h-1 bg-gray-800 mx-auto rounded-full overflow-hidden">
          <motion.div
            animate={{ x: [-192, 192] }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-full h-full bg-yellow-500"
          />
        </div>
      </div>
    </div>
  );

  const { site, services = [] } = data;
  const homePage = site.pages?.find(p => p.slug === "home" || p.slug === "index") || site.pages?.[0];

  // Aplicar estilos globales
  const styles = {
    fontFamily: site.font_family || "Inter, sans-serif",
    "--primary": site.primary_color || "#facc15",
    "--secondary": site.secondary_color || "#111827",
  };

  return (
    <div style={styles} className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black">
      {/* NAVBAR FLOTANTE */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex justify-between items-center transition-all duration-300 hover:bg-black/80">
        <h1 className="text-2xl font-black uppercase tracking-tighter" style={{ color: "var(--primary)" }}>
          {data.name}
        </h1>
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest opacity-80">
          <a href="#services" className="hover:text-yellow-500 transition-colors">Servicios</a>
          <a href="#about" className="hover:text-yellow-500 transition-colors">Nosotros</a>
          <a href="#contact" className="hover:text-yellow-500 transition-colors">Contacto</a>
        </div>
        <button
          className="px-6 py-2 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
          style={{ backgroundColor: "var(--primary)", color: "#000" }}
        >
          RESERVAR CITA
        </button>
      </nav>

      <main>
        {(homePage?.sections || []).length > 0 ? (
          homePage.sections.map((section) => (
            <SectionRendererUniversal
              key={section.id}
              section={section}
              preview={true}
              site={site}
            />
          ))
        ) : (
          /* FALLBACK UI */
          <div className="pt-32 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-black mb-6 uppercase italic tracking-tighter">BIENVENIDOS A <span style={{ color: "var(--primary)" }}>{data.name}</span></h2>
              <p className="opacity-60 mb-20 text-xl font-light tracking-wide">Este sitio está siendo personalizado para ofrecerte la mejor experiencia premium.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="p-10 border border-white/5 bg-zinc-900/30 rounded-[2rem] backdrop-blur-sm shadow-2xl"
                >
                  <Star className="text-yellow-500 mb-6" size={48} />
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Servicios de Élite</h3>
                  <p className="opacity-50 leading-relaxed text-lg">Pronto podrás reservar cortes de cabello, perfilado de barba y tratamientos faciales con nuestros maestros barberos.</p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="p-10 border border-white/5 bg-zinc-900/30 rounded-[2rem] backdrop-blur-sm shadow-2xl"
                >
                  <Calendar className="text-yellow-500 mb-6" size={48} />
                  <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Agenda Digital</h3>
                  <p className="opacity-50 leading-relaxed text-lg">Olvida las esperas. Reserva tu turno en segundos desde cualquier dispositivo, las 24 horas del día.</p>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </main>

    </div>
  );
};

export default BarberPublicPage;
