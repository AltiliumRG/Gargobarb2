import { useBuilder } from "../../context/BuilderContext";

export default function HeroRenderer({ section, preview }) {
  const builder = useBuilder?.();

  const selectedSectionId = builder?.selectedSectionId;
  const selectSection = builder?.selectSection;

  const isEditing = builder && !preview;
  const isSelected = selectedSectionId === section.id;

  const content = section.content || {};
  const styles = section.styles || {};

  const backgroundImage =
    content.image ||
    "https://img.freepik.com/vector-premium/lampara-barbero-epoca-afeitadora-ilustracion-barberia-color-negro-sobre-fondo-blanco_117403-4238.jpg";

  const handleSectionClick = () => {
    if (isEditing) {
      selectSection?.(section.id);
    }
  };

  return (
    <section
      onClick={handleSectionClick}
      className={`
        relative w-full overflow-hidden
        ${isEditing ? "cursor-pointer" : ""}
        ${isSelected ? "ring-4 ring-yellow-400" : ""}
      `}
      style={{
        padding: styles.padding || "180px 20px",
      }}
    >
      {/* ================= BACKGROUND ================= */}
      <div
        className="absolute inset-0 scale-105 transition-transform duration-[6000ms] ease-out"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* ================= OVERLAY ================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/90" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-6xl mx-auto text-center text-white px-4">

        {/* TITLE */}
        <h1 className="
          text-4xl
          md:text-6xl
          lg:text-7xl
          font-extrabold
          leading-tight
          tracking-tight
          mb-6
        ">
          {content.title || "Barbería profesional"}
        </h1>

        {/* SUBTITLE */}
        <p className="
          text-lg
          md:text-xl
          lg:text-2xl
          opacity-90
          mb-6
        ">
          {content.subtitle || "Estilo moderno y precisión"}
        </p>

        {/* OPTIONAL TEXT */}
        {content.text && (
          <p className="max-w-2xl mx-auto mb-10 opacity-80 text-sm md:text-base">
            {content.text}
          </p>
        )}

        {/* BUTTON */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();

              if (preview) {
                // Aquí luego podemos conectar con checkout o scroll
                console.log("Reservar clic en preview");
              }
            }}
            className="
              relative
              px-10
              py-4
              rounded-2xl
              font-bold
              text-black
              transition-all duration-300
              hover:scale-105
              active:scale-95
              shadow-lg
            "
            style={{
              background: styles.buttonColor || "#facc15",
            }}
          >
            <span className="relative z-10">
              {content.buttonText || "Reservar cita"}
            </span>

            {/* Glow */}
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-40"
              style={{
                background: styles.buttonColor || "#facc15",
              }}
            />
          </button>
        </div>

      </div>
    </section>
  );
}