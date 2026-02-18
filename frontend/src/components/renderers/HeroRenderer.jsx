import { useBuilder } from "../../context/BuilderContext";

export default function HeroRenderer({ section, preview }) {
  const { selectSection, selectedSectionId } = useBuilder();

  const isSelected = selectedSectionId === section.id;

  const content = section.content || {};
  const styles = section.styles || {};

  const backgroundImage =
    content.image ||
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033";

  return (
    <section
      onClick={() => !preview && selectSection(section.id)}
      className={`relative w-full cursor-pointer ${
        isSelected ? "ring-4 ring-yellow-400" : ""
      }`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: styles.padding || "160px 20px",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 max-w-5xl mx-auto text-center text-white">
        <h1 className="text-6xl font-bold mb-4">
          {content.title || "Barbería profesional"}
        </h1>

        <p className="text-xl mb-6 opacity-90">
          {content.subtitle || "Estilo moderno y precisión"}
        </p>

        {content.text && (
          <p className="mb-8 opacity-80">{content.text}</p>
        )}

        <button
          className="px-8 py-4 rounded-xl font-semibold text-black"
          style={{
            background: styles.buttonColor || "#facc15",
          }}
        >
          {content.buttonText || "Reservar cita"}
        </button>
      </div>
    </section>
  );
}
