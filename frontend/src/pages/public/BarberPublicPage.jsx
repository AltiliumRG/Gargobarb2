import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import barberPublicApi from "../../api/barberPublic.api";
import SectionRendererUniversal from "../../components/renderers/SectionRendererUniversal";

export default function BarberPublicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);

  /* ===============================
     CARGAR SITIO POR SLUG
  =============================== */
  useEffect(() => {
    if (!slug) return;

    barberPublicApi
      .getBySlug(slug)
      .then((res) => {
        setSite(res.data.site);

        // 🔥 Registrar visita
        fetch(
          `http://localhost:4000/api/barbershops/public/${slug}/visit`,
          { method: "POST" }
        );
      })
      .catch((err) => {
        console.error("Error cargando sitio:", err);
      });
  }, [slug]);

  // 🔥 SIEMPRE DEFINIR VARIABLES
  const page = site?.pages?.[0];
  const sections =
    page?.sections?.sort((a, b) => a.order_index - b.order_index) || [];

  /* ===============================
     NAV LINKS DINÁMICOS
  =============================== */
  const navLinks = useMemo(() => {
    return sections.map((section) => ({
      label:
        section.type === "hero"
          ? "Inicio"
          : section.type === "services"
          ? "Servicios"
          : section.type === "gallery"
          ? "Galería"
          : section.type === "contact"
          ? "Contacto"
          : section.type,
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
        background: site.primary_color || "#0b0f14",
        color: site.text_color || "#ffffff",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-black/80 backdrop-blur text-white py-4 px-8 flex items-center justify-between shadow-lg sticky top-0 z-50">
        <div className="text-xl font-bold tracking-wide">
          {site.name || "Mi Barbería"}
        </div>

        <div className="flex gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
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