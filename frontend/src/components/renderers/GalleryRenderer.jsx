import { useBuilder } from "../../context/BuilderContext";

export default function GalleryRenderer({ section }) {
  const { selectedSectionId, selectSection } = useBuilder();

  const isSelected = selectedSectionId === section.id;

  const content = section.content || {};
  const styles = section.styles || {};
  const images = content.images || [];

  return (
    <section
      onClick={() => selectSection(section.id)}
      className={`relative py-20 px-10 ${
        isSelected ? "ring-4 ring-yellow-400" : ""
      }`}
      style={{
        background: styles.backgroundColor || "#111",
        color: styles.textColor || "#fff",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">
          {content.title || "Galería"}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt=""
              className="w-full h-48 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
