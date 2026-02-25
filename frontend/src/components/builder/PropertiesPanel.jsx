import { useBuilder } from "../../context/BuilderContext";

export default function PropertiesPanel() {
  const {
    sections,
    selectedSectionId,
    updateSectionContent,
    updateSectionStyles,
  } = useBuilder();

  if (!selectedSectionId) {
    return (
      <aside className="w-80 h-screen bg-gray-900 border-l border-gray-800 text-white flex flex-col">
  
  {/* HEADER FIJO */}
  <div className="p-4 border-b border-gray-800">
    <h2 className="text-lg font-bold">Editor de sección</h2>
  </div>

  {/* SCROLL INTERNO */}
  <div className="flex-1 overflow-y-auto p-4">
    
    {!selectedSectionId ? (
      <p className="text-gray-400">Selecciona una sección</p>
    ) : (
      <>
        {/* aquí va TODO lo que ya tienes:
            hero
            services
            gallery
            estilos
        */}
      </>
    )}

  </div>
</aside>
    );
  }

  const section = sections.find((s) => s.id === selectedSectionId);
  if (!section) return null;

  const content = section.content || {};
  const styles = section.styles || {};

  const handleContent = (key, value) => {
    updateSectionContent(section.id, {
      [key]: value,
    });
  };

  const handleStyle = (key, value) => {
    updateSectionStyles(section.id, {
      [key]: value,
    });
  };

  return (
    <aside className="w-80 bg-gray-900 border-l border-gray-800 p-4 text-white overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Editor de sección</h2>

      {/* HERO */}
      {section.type === "hero" && (
        <>
          <input
            placeholder="Título"
            value={content.title || ""}
            onChange={(e) => handleContent("title", e.target.value)}
            className="w-full bg-gray-800 p-2 rounded mb-2"
          />

          <input
            placeholder="Subtítulo"
            value={content.subtitle || ""}
            onChange={(e) => handleContent("subtitle", e.target.value)}
            className="w-full bg-gray-800 p-2 rounded mb-2"
          />

          <input
            placeholder="Texto botón"
            value={content.buttonText || ""}
            onChange={(e) => handleContent("buttonText", e.target.value)}
            className="w-full bg-gray-800 p-2 rounded mb-2"
          />

          <input
            placeholder="URL imagen fondo"
            value={content.image || ""}
            onChange={(e) => handleContent("image", e.target.value)}
            className="w-full bg-gray-800 p-2 rounded"
          />
        </>
      )}

      {section.type === "services" && (
  <>
    {/* TITLE SECTION */}
    <input
      placeholder="Título servicios"
      value={content.title || ""}
      onChange={(e) => handleContent("title", e.target.value)}
      className="w-full bg-gray-800 p-2 rounded mb-4"
    />

    {/* SERVICES LIST */}
    <div className="space-y-4">
      {(content.items || []).map((srv, i) => (
        <div key={i} className="bg-gray-800 p-4 rounded space-y-2">

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">Servicio #{i + 1}</p>

            <button
              onClick={() => {
                const updated = content.items.filter((_, index) => index !== i);
                handleContent("items", updated);
              }}
              className="text-red-500 text-xs"
            >
              Eliminar
            </button>
          </div>

          {/* TITLE */}
          <input
            placeholder="Título"
            value={srv.title || ""}
            onChange={(e) => {
              const updated = content.items.map((item, index) =>
                index === i ? { ...item, title: e.target.value } : item
              );
              handleContent("items", updated);
            }}
            className="w-full bg-gray-900 p-2 rounded"
          />

          {/* DESCRIPTION */}
          <textarea
            placeholder="Descripción"
            value={srv.description || ""}
            onChange={(e) => {
              const updated = content.items.map((item, index) =>
                index === i ? { ...item, description: e.target.value } : item
              );
              handleContent("items", updated);
            }}
            className="w-full bg-gray-900 p-2 rounded"
          />

          {/* PRICE */}
          <input
            placeholder="Precio"
            value={srv.price || ""}
            onChange={(e) => {
              const updated = content.items.map((item, index) =>
                index === i ? { ...item, price: e.target.value } : item
              );
              handleContent("items", updated);
            }}
            className="w-full bg-gray-900 p-2 rounded"
          />

          {/* IMAGE */}
          <input
            placeholder="URL imagen"
            value={srv.image || ""}
            onChange={(e) => {
              const updated = content.items.map((item, index) =>
                index === i ? { ...item, image: e.target.value } : item
              );
              handleContent("items", updated);
            }}
            className="w-full bg-gray-900 p-2 rounded"
          />

          {/* BUTTON TEXT */}
          <input
            placeholder="Texto botón"
            value={srv.buttonText || ""}
            onChange={(e) => {
              const updated = content.items.map((item, index) =>
                index === i ? { ...item, buttonText: e.target.value } : item
              );
              handleContent("items", updated);
            }}
            className="w-full bg-gray-900 p-2 rounded"
          />

          {/* BUTTON LINK */}
          <input
            placeholder="Link botón (WhatsApp / web / interno)"
            value={srv.buttonLink || ""}
            onChange={(e) => {
              const updated = content.items.map((item, index) =>
                index === i ? { ...item, buttonLink: e.target.value } : item
              );
              handleContent("items", updated);
            }}
            className="w-full bg-gray-900 p-2 rounded"
          />
        </div>
      ))}
    </div>

    {/* ADD */}
    <button
      onClick={() =>
        handleContent("items", [
          ...(content.items || []),
          {
            title: "Nuevo servicio",
            description: "",
            price: "",
            image: "",
            buttonText: "Reservar",
            buttonLink: "",
          },
        ])
      }
      className="w-full bg-yellow-500 text-black p-2 rounded mt-4"
    >
      + Agregar servicio
    </button>
  </>
)}


      {/* GALLERY */}
      {section.type === "gallery" && (
        <>
          <input
            placeholder="Título galería"
            value={content.title || ""}
            onChange={(e) => handleContent("title", e.target.value)}
            className="w-full bg-gray-800 p-2 rounded mb-3"
          />

          {(content.images || []).map((img, i) => (
            <input
              key={i}
              value={img || ""}
              onChange={(e) => {
                const updated = content.images.map((image, index) =>
                  index === i ? e.target.value : image
                );
                handleContent("images", updated);
              }}
              className="w-full bg-gray-800 p-2 rounded mb-2"
            />
          ))}

          <button
            onClick={() =>
              handleContent("images", [...(content.images || []), ""])
            }
            className="w-full bg-yellow-500 text-black p-2 rounded"
          >
            + Agregar imagen
          </button>
        </>
      )}

      {/* ESTILOS */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400 mb-2">Estilos</p>

        <label className="block text-sm mb-1">Color fondo</label>
        <input
          type="color"
          value={styles.backgroundColor || "#000000"}
          onChange={(e) => handleStyle("backgroundColor", e.target.value)}
        />

        <label className="block text-sm mt-3 mb-1">Color texto</label>
        <input
          type="color"
          value={styles.textColor || "#ffffff"}
          onChange={(e) => handleStyle("textColor", e.target.value)}
        />
      </div>
    </aside>
  );
}
