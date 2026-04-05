import { useBuilder } from "../../context/BuilderContext";
import SectionRendererUniversal from "../../components/renderers/SectionRendererUniversal";

export default function Canvas() {
  const {
    currentPage,
    sections,
    selectSection,
    selectedSectionId,
    site,
  } = useBuilder();

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No hay página cargada
      </div>
    );
  }

  return (
    <div className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto py-10 min-h-screen">

        {sections.map((section) => {
          const isSelected = section.id === selectedSectionId;

          return (
            <div
              key={section.id}
              className="relative group"
              onClick={(e) => {
                e.stopPropagation();
                selectSection(section.id);
              }}
            >
              {/* HOVER / SELECT OUTLINE */}
              <div
                className={`
                  absolute inset-0 pointer-events-none transition-all
                  ${
                    isSelected
                      ? "ring-4 ring-yellow-400"
                      : "group-hover:ring-2 group-hover:ring-blue-400"
                  }
                `}
              />

              {/* LABEL SECTION */}
              <div className="absolute top-2 left-2 z-50 opacity-0 group-hover:opacity-100 transition">
                <span className="bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {section.type.toUpperCase()}
                </span>
              </div>

              {/* RENDER REAL */}
              <SectionRendererUniversal
                section={section}
                site={site}
                preview={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}