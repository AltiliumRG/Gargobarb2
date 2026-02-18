import { useBuilder } from "../../context/BuilderContext";

export default function Toolbar() {
  const {
    sections = [],
    selectedSectionId,
    addSection,
    removeSection,
    saveDraft,
    publishSite,
  } = useBuilder();

  const selectedIndex = sections.length
    ? sections.findIndex((s) => s.id === selectedSectionId)
    : -1;

  return (
    <aside className="h-full flex flex-col text-white">

      {/* HEADER */}
      <div className="px-5 py-4 border-b border-gray-800">
        <h2 className="font-bold text-lg">Constructor</h2>
        <p className="text-xs text-gray-400">
          Arrastra y crea tu página
        </p>
      </div>

      {/* BLOQUES */}
      <div className="flex-1 overflow-auto px-4 py-4">

        <p className="text-xs uppercase text-gray-500 mb-3">
          Secciones
        </p>

        <div className="grid grid-cols-1 gap-3">

          <Block
            title="Hero principal"
            desc="Imagen grande con botón"
            onClick={() => addSection("hero")}
          />

          <Block
            title="Servicios"
            desc="Lista de cortes y precios"
            onClick={() => addSection("services")}
          />

          <Block
            title="Galería"
            desc="Fotos de trabajos"
            onClick={() => addSection("gallery")}
          />

          <Block
            title="Sobre nosotros"
            desc="Historia de la barbería"
            onClick={() => addSection("about")}
          />

          <Block
            title="Contacto"
            desc="Botón WhatsApp / citas"
            onClick={() => addSection("contact")}
          />
        </div>

        {/* SECCIÓN ACTIVA */}
        {selectedSectionId && selectedIndex !== -1 && (
          <>
            <p className="text-xs uppercase text-gray-500 mt-8 mb-3">
              Edición
            </p>

            <button
              onClick={() => removeSection(selectedSectionId)}
              className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
            >
              Eliminar sección
            </button>
          </>
        )}
      </div>

      {/* FOOTER */}
      <div className="border-t border-gray-800 p-4 space-y-2">
        <button
          onClick={saveDraft}
          className="w-full bg-yellow-500 text-black py-2 rounded font-semibold"
        >
          Guardar borrador
        </button>

        <button
          onClick={publishSite}
          className="w-full bg-green-600 py-2 rounded font-semibold"
        >
          Publicar sitio
        </button>
      </div>
    </aside>
  );
}


/* ======================================================
   COMPONENTE BLOQUE VISUAL
====================================================== */

function Block({ title, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        w-full
        bg-[#111827]
        hover:bg-[#1f2937]
        border border-gray-800
        rounded-xl
        p-4
        text-left
        transition
      "
    >
      <h3 className="font-semibold text-sm mb-1">
        {title}
      </h3>

      <p className="text-xs text-gray-400">
        {desc}
      </p>
    </button>
  );
}
