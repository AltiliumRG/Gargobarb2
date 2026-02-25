import { useBuilder } from "../../context/BuilderContext";
import { v4 as uuid } from "uuid";

export default function CustomRenderer({ section }) {
  const {
    selectedSectionId,
    selectSection,
    updateSectionContent,
  } = useBuilder();

  const isSelected = selectedSectionId === section.id;

  const content = section.content || {};
  const elements = content.elements || [];

  /* ============================================================
     AGREGAR ELEMENTOS
  ============================================================ */

  const addElement = (type) => {
    const newElement = {
      id: uuid(),
      type,
      text: type === "text" ? "Nuevo texto" : "",
      src:
        type === "image"
          ? "https://via.placeholder.com/300"
          : "",
      styles: {
        fontSize: "16px",
        color: "#000000",
        background: "transparent",
        padding: "10px",
      },
    };

    updateSectionContent(section.id, {
      ...content,
      elements: [...elements, newElement],
    });
  };

  /* ============================================================
     EDITAR ELEMENTO
  ============================================================ */

  const updateElement = (elementId, newData) => {
    const updated = elements.map((el) =>
      el.id === elementId ? { ...el, ...newData } : el
    );

    updateSectionContent(section.id, {
      ...content,
      elements: updated,
    });
  };

  const removeElement = (elementId) => {
    const updated = elements.filter((el) => el.id !== elementId);

    updateSectionContent(section.id, {
      ...content,
      elements: updated,
    });
  };

  /* ============================================================
     RENDER ELEMENTOS
  ============================================================ */

  const renderElement = (el) => {
    const baseStyle = el.styles || {};

    switch (el.type) {
      case "text":
        return (
          <div style={baseStyle} className="mb-4">
            {isSelected ? (
              <input
                value={el.text}
                onChange={(e) =>
                  updateElement(el.id, { text: e.target.value })
                }
                className="w-full bg-transparent border-b"
              />
            ) : (
              <p>{el.text}</p>
            )}
          </div>
        );

      case "button":
        return (
          <button style={baseStyle} className="mb-4">
            {isSelected ? (
              <input
                value={el.text || "Botón"}
                onChange={(e) =>
                  updateElement(el.id, { text: e.target.value })
                }
                className="bg-transparent"
              />
            ) : (
              el.text || "Botón"
            )}
          </button>
        );

      case "image":
        return (
          <div className="mb-4">
            <img
              src={el.src}
              alt=""
              style={baseStyle}
              className="max-w-full rounded"
            />

            {isSelected && (
              <input
                value={el.src}
                onChange={(e) =>
                  updateElement(el.id, { src: e.target.value })
                }
                className="mt-2 w-full text-xs bg-gray-100 p-1 rounded"
                placeholder="URL imagen"
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  /* ============================================================
     UI PRINCIPAL
  ============================================================ */

  return (
    <section
      onClick={() => selectSection(section.id)}
      className={`relative py-20 px-10 ${
        isSelected ? "ring-2 ring-yellow-400" : ""
      }`}
    >
      {/* BADGE */}
      <div className="absolute top-2 left-2 text-xs bg-black text-white px-2 py-1 rounded">
        CUSTOM
      </div>

      {/* BOTONES CREAR */}
      {isSelected && (
        <div className="mb-8 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addElement("text");
            }}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            + Texto
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addElement("button");
            }}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            + Botón
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addElement("image");
            }}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            + Imagen
          </button>
        </div>
      )}

      {/* ELEMENTOS */}
      <div>
        {elements.length === 0 && (
          <div className="text-gray-400 text-center">
            Agrega elementos para construir esta sección
          </div>
        )}

        {elements.map((el) => (
          <div key={el.id} className="relative group">
            {renderElement(el)}

            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(el.id);
                }}
                className="absolute top-0 right-0 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
