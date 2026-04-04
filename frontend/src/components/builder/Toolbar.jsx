import { useBuilder } from "../../context/BuilderContext";
import toast from "react-hot-toast";

export default function Toolbar() {
  const {
    site,
    sections = [],
    selectedSectionId,
    addSection,
    moveSection,
    removeSection,
    saveDraft,
    publishSite,
    toggleSiteVisibility
  } = useBuilder();

  const selectedSection = sections.find(
    (s) => s.id === selectedSectionId
  );
  // 🔥 CONTROL DE SECCIONES ÚNICAS
const SINGLE_SECTIONS = ["hero", "contact", "testimonials"];

const hasSection = (type) => {
  return sections.some((s) => s.type === type);
};
  return (
    <aside className="h-full flex flex-col text-white bg-gradient-to-b from-[#0f141a] to-[#0b0f14] border-r border-gray-800">

      {/* HEADER */}
      <div className="px-6 py-6 border-b border-gray-800 backdrop-blur-xl bg-white/5">
        <h2 className="font-bold text-xl text-yellow-400 tracking-wide">
          Constructor
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Administra el diseño de tu sitio
        </p>
      </div>

      {/* CONTENIDO */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 custom-scroll">

        {/* VISIBILIDAD */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl transition hover:border-yellow-400/40">

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-semibold text-white">
                Visibilidad pública
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Controla si tu sitio es accesible para clientes.
              </p>
            </div>

            <button
              onClick={async () => {
                const newValue = !site?.is_visible;
                await toggleSiteVisibility(newValue);

                newValue
                  ? toast.success("👁 Sitio visible")
                  : toast("🙈 Sitio oculto", { icon: "⚠️" });
              }}
              className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                site?.is_visible
                  ? "bg-green-500 shadow-[0_0_15px_rgba(34,197,94,.5)]"
                  : "bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                  site?.is_visible ? "translate-x-7" : ""
                }`}
              />
            </button>

          </div>
        </div>

        {/* SECCIONES DISPONIBLES */}
        <div>
          <p className="text-xs uppercase text-gray-500 mb-4 tracking-widest">
            Agregar sección
          </p>

          <div className="space-y-3">

  <Block
    title="Hero"
    desc="Imagen principal destacada"
    onClick={() => {
    if (hasSection("hero")) {
      toast("⚠️ Solo puedes tener un Hero");
      return;
    }
    addSection("hero");
  }}
  />

  <Block
    title="Servicios"
    desc="Lista de servicios y precios"
    onClick={() => {
    if (hasSection("services")) {
      toast("⚠️ Solo puedes tener un Servicios");
      return;
    }
    addSection("services");
  }}
  />

  <Block
    title="Galería"
    desc="Trabajos realizados"
    onClick={() => {
    if (hasSection("gallery")) {
      toast("⚠️ Solo puedes tener un Galería");
      return;
    }
    addSection("gallery");
  }}
  />

  <Block
    title="Sobre nosotros"
    desc="Información institucional"
    onClick={() => {
    if (hasSection("about")) {
      toast("⚠️ Solo puedes tener un Sobre nosotros");
      return;
    }
    addSection("about");
  }}
  />

  <Block
    title="Testimonios"
    desc="Opiniones de clientes"
    onClick={() => {
    if (hasSection("testimonials")) {
      toast("⚠️ Solo puedes tener un Testimonios");
      return;
    }
    addSection("testimonials");
  }}
  />

  <Block
    title="Contacto"
    desc="Formulario y WhatsApp"
    onClick={() => {
    if (hasSection("contact")) {
      toast("⚠️ Solo puedes tener un Contacto");
      return;
    }
    addSection("contact");
  }}
  />

  <Block
    title="Carrito"
    desc="Catálogo y compras"
    onClick={() => {
    if (hasSection("carrito")) {
      toast("⚠️ Solo puedes tener un Carrito");
      return;
    }
    addSection("carrito");
  }}
  />

</div>
        </div>

        {/* SECCIÓN ACTIVA */}
        {selectedSection && (
          <div className="border-t border-gray-800 pt-6">

            <p className="text-xs uppercase text-gray-500 mb-4 tracking-widest">
              Sección activa
            </p>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 space-y-5 transition hover:border-yellow-400/40">

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-yellow-400">
                  {selectedSection.type.toUpperCase()}
                </span>

                <span className="text-xs text-gray-500">
                  #{selectedSection.order_index + 1}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => moveSection(selectedSectionId, "up")}
                  className="flex-1 bg-gray-800/70 hover:bg-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition hover:scale-105 active:scale-95"
                >
                  ↑ Subir
                </button>

                <button
                  onClick={() => moveSection(selectedSectionId, "down")}
                  className="flex-1 bg-gray-800/70 hover:bg-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition hover:scale-105 active:scale-95"
                >
                  ↓ Bajar
                </button>
              </div>

              <button
                onClick={() => removeSection(selectedSectionId)}
                className="w-full bg-red-600 hover:bg-red-700 py-2.5 rounded-xl text-sm font-semibold transition hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                Eliminar sección
              </button>

            </div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-800 p-6 bg-[#0b0f14] space-y-4">

        <button
          onClick={async () => {
            const ok = await saveDraft();
            ok
              ? toast.success("💾 Cambios guardados")
              : toast.error("Error guardando");
          }}
          className="w-full py-3 rounded-2xl font-semibold transition bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 shadow-xl hover:scale-[1.02] active:scale-95"
        >
          💾 Guardar borrador
        </button>

        <button
          onClick={async () => {
            const ok = await publishSite();
            ok
              ? toast.success("🚀 Sitio publicado")
              : toast.error("Error al publicar");
          }}
          className="w-full py-3 rounded-2xl font-bold transition bg-gradient-to-r from-yellow-500 to-yellow-400 text-black shadow-xl hover:scale-[1.02] active:scale-95"
        >
          🚀 Publicar sitio
        </button>

      </div>
    </aside>
  );
}

/* ===============================
   BLOQUE VISUAL
================================ */

function Block({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-left transition hover:border-yellow-400/60 hover:bg-white/10 hover:scale-[1.02] active:scale-95"
    >
      <h3 className="font-semibold text-sm mb-1 group-hover:text-yellow-400 transition">
        {title}
      </h3>
      <p className="text-xs text-gray-400">
        {desc}
      </p>
    </button>
  );
}