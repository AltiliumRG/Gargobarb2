import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSiteByBarbershop } from "../../api/site.api";
import SectionRendererUniversal from "../../components/renderers/SectionRendererUniversal";

export default function Preview() {
  const { siteId } = useParams();
  const [site, setSite] = useState(null);

  useEffect(() => {
    getSiteByBarbershop(siteId).then(res => {
      setSite(res.data);
    });
  }, [siteId]);

  if (!site) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Cargando sitio...
      </div>
    );
  }

  const page = site.pages?.[0];
  const sections = page?.sections?.sort((a,b)=>a.order_index-b.order_index) || [];

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: site.font_family }}
    >

      {/* ================= NAVBAR PROFESIONAL ================= */}
      <nav className="w-full bg-black text-white py-4 px-8 flex items-center justify-between shadow-lg">
        <div className="text-xl font-bold tracking-wide">
          {site.name || "Mi Barbería"}
        </div>

        <div className="flex gap-6 text-sm">
          <a href="#inicio" className="hover:text-yellow-400">Inicio</a>
          <a href="#servicios" className="hover:text-yellow-400">Servicios</a>
          <a href="#galeria" className="hover:text-yellow-400">Galería</a>
          <a href="#contacto" className="hover:text-yellow-400">Contacto</a>
        </div>

        <button
          className="px-5 py-2 rounded-lg font-semibold"
          style={{
            background: site.secondary_color || "#facc15",
            color: "#000",
          }}
        >
          Reservar
        </button>
      </nav>

      {/* ================= SECCIONES ================= */}
      {sections.map(section => (
        <SectionRendererUniversal
          key={section.id}
          section={section}
          site={site}
          preview={true}
        />
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
