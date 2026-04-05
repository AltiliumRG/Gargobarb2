import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import barberPublicApi from "../../api/barberPublic.api";
import api from "../../api/axios";
import SectionRendererUniversal from "../../components/renderers/SectionRendererUniversal";
import { useBarber } from "../../context/BarberContext";
export default function BarberPublicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [site, setSite] = useState(null);

  const { setActiveBarbershop } = useBarber();

  /* ===============================
     CARGAR SITIO POR SLUG
  =============================== */
  useEffect(() => {
    if (!slug) return;

    const loadSite = async () => {
      try {
        const res = await barberPublicApi.getBySlug(slug);

        const siteData = res.data.site;

        console.log("SITE DATA:", siteData);

        setSite(siteData);

        // 🔥 guardar barbería activa (activará la carga de servicios/productos en BarberContext)
        if (siteData?.barbershop_id) {
          setActiveBarbershop({ id: siteData.barbershop_id });
        }

        // REGISTER VISIT (New Analytics)
        const visitorId = localStorage.getItem("gargobarb_visitor_id") || crypto.randomUUID();
        localStorage.setItem("gargobarb_visitor_id", visitorId);

        const visitRes = await api.post("/analytics/track", {
          barbershop_id: siteData.barbershop_id,
          visitor_id: visitorId,
          page: "home"
        });

        const visitId = visitRes.data.visit_id;

        // Duration heartbeat (every 10s)
        let seconds = 0;
        const interval = setInterval(() => {
          seconds += 10;
          api.post("/analytics/duration", {
            visit_id: visitId,
            duration_seconds: seconds
          }).catch(() => {}); // silent fail
        }, 10000);

        return () => clearInterval(interval);

      } catch (err) {
        console.error("Error cargando sitio:", err);
      }
    };

    loadSite();
  }, [slug]);

  /* ===============================
     SECCIONES
  =============================== */
  const page = site?.pages?.[0];

  const sections =
    page?.sections?.sort((a, b) => a.order_index - b.order_index) || [];

  /* ===============================
     NAV LINKS DINÁMICOS
  =============================== */
  const navLinks = useMemo(() => {
    const labels = {
      hero: "Inicio",
      services: "Servicios",
      gallery: "Galería",
      contact: "Contacto",
      about: "Nosotros",
      testimonials: "Testimonios",
      cart: "Tienda",
      custom: "Info",
    };
    return sections.map((section) => ({
      label: labels[section.type] || section.type,
      id: section.type,
    }));
  }, [sections]);

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando sitio...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen scroll-smooth"
      style={{
        fontFamily: site.font_family || "sans-serif",
        background: "#0b0f14",
        color: site.text_color || "#ffffff",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-black/80 backdrop-blur text-white py-4 px-8 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/client/home")}
            className="p-2 rounded-full hover:bg-white/10 transition-all active:scale-90 text-yellow-400 border border-yellow-400/20"
            title="Volver al inicio"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-xl font-bold tracking-wide">
            {site.name || "Mi Barbería"}
          </div>
        </div>

        <div className="flex gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="hover:text-yellow-400 transition"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => navigate(`/b/${slug}/book`)}
          className="px-5 py-2 rounded-lg font-semibold transition hover:scale-105"
          style={{
            background: site.secondary_color || "#facc15",
            color: "#000",
          }}
        >
          Reservar
        </button>
      </nav>

      {/* ================= SECCIONES ================= */}
      {sections.map((section) => (
        
        <div key={section.id} id={section.type}>
          <SectionRendererUniversal
            section={section}
            site={site}
            preview={false}
            slug={slug}
            
          />
          
        </div>
        
      ))}

      {/* ================= FOOTER ================= */}
      <footer className="bg-black text-white py-10 text-center">
        <p className="text-lg font-semibold mb-2">
          {site.name || "Mi Barbería"}
        </p>

        <p className="text-sm opacity-70">
          © {new Date().getFullYear()} Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}