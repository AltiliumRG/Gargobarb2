import { useBuilder } from "../../context/BuilderContext";
import SectionRenderer from "../../components/renderers/SectionRendererUniversal";
import SectionRendererUniversal from "../../components/renderers/SectionRendererUniversal";

export default function Canvas() {
  const {
    currentPage,
    sections,
    selectSection,
    selectedSectionId,
  } = useBuilder();

  if (!currentPage) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        No hay página cargada
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0b0f14] overflow-auto">
      <div className="max-w-7xl mx-auto bg-white min-h-screen shadow-xl">

        {sections.map((section) => {
          const isSelected = section.id === selectedSectionId;

          return (
            <div
              key={section.id}
              onClick={() => selectSection(section.id)}
              className={`relative ${
                isSelected ? "ring-2 ring-yellow-400" : ""
              }`}
            >
<SectionRendererUniversal section={section} preview={true} />

            </div>
          );
        })}
      </div>
    </div>
  );
}
