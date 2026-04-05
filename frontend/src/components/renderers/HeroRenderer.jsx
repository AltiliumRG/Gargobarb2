import { useBuilder } from "../../context/BuilderContext";
import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function HeroRenderer({ section, preview, site }) {
  const navigate = useNavigate();
  const { slug } = useParams();
  const builder = useBuilder?.();

  const selectedSectionId = builder?.selectedSectionId;
  const selectSection = builder?.selectSection;

  const isEditing = builder && !preview;
  const isSelected = selectedSectionId === section.id;

  const content = section.content || {};
  const styles = section.styles || {};

  const heroRef = useRef(null);

  const backgroundImage =
    content.image ||
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2070";

  const handleSectionClick = () => {
    if (isEditing) selectSection?.(section.id);
  };

  // ================= PARALLAX =================
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const { innerWidth, innerHeight } = window;

      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;

      el.style.setProperty("--x", `${x}px`);
      el.style.setProperty("--y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section
      ref={heroRef}
      onClick={handleSectionClick}
      className={`
        relative w-full overflow-hidden
        ${isEditing ? "cursor-pointer" : ""}
        ${isSelected ? "ring-4 ring-yellow-400" : ""}
      `}
      style={{
        padding: styles.padding || "240px 20px",
      }}
    >
      {/* ================= VIDEO / IMAGE ================= */}
      {content.video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-110"
          style={{
            transform: "translate(var(--x,0), var(--y,0)) scale(1.1)",
          }}
          src={content.video}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "translate(var(--x,0), var(--y,0)) scale(1.1)",
          }}
        />
      )}

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/70" />

      {/* GLOW FOLLOW CURSOR */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="w-[600px] h-[600px] bg-yellow-400/10 blur-3xl rounded-full absolute"
          style={{
            transform: "translate(var(--x,0), var(--y,0))",
            left: "50%",
            top: "40%",
          }}
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">

        <div className="
          backdrop-blur-xl
          bg-white/5
          border border-white/10
          rounded-3xl
          px-10 md:px-16 py-14
          shadow-2xl
          transition-all duration-700
          animate-fadeUp
        ">

          {/* TITLE */}
          <h1 className="
            text-4xl
            md:text-6xl
            lg:text-7xl
            font-extrabold
            mb-6
            bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent
          ">
            {content.title || "Barbería profesional"}
          </h1>

          {/* SUBTITLE */}
          <p className="
            text-lg
            md:text-xl
            text-gray-300
            mb-6
          ">
            {content.subtitle || "Estilo moderno y precisión"}
          </p>

          {/* TEXT */}
          {content.text && (
            <p className="max-w-2xl mx-auto mb-10 text-gray-400">
              {content.text}
            </p>
          )}

          {/* BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isEditing) {
                const targetSlug = slug || site?.slug;
                if (targetSlug) {
                  navigate(`/b/${targetSlug}/book`);
                } else {
                  console.log("Reservar clickeado (sin slug válido)");
                }
              }
            }}
            className="
              relative
              px-10 py-4
              rounded-2xl
              font-bold
              text-black
              transition-all duration-300
              hover:scale-110
              active:scale-95
              shadow-xl
              overflow-hidden
            "
            style={{
              background: styles.buttonColor || "#facc15",
            }}
          >
            <span className="relative z-10">
              {content.buttonText || "Reservar cita"}
            </span>

            <div
              className="absolute inset-0 blur-2xl opacity-50 animate-pulse"
              style={{
                background: styles.buttonColor || "#facc15",
              }}
            />
          </button>

        </div>
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style>
        {`
          @keyframes fadeUp {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeUp {
            animation: fadeUp 1s ease-out;
          }
        `}
      </style>
    </section>
  );
}