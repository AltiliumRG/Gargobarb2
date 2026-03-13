import { useBuilder } from "../../context/BuilderContext";
import { useState } from "react";

export default function GalleryRenderer({ section }) {
  const builder = useBuilder?.();
  const selectedSectionId = builder?.selectedSectionId;
  const selectSection = builder?.selectSection;

  const isSelected = selectedSectionId === section.id;

  const content = section.content || {};
  const styles = section.styles || {};
  const images = Array.isArray(content.images)
  ? content.images.map((img) =>
      typeof img === "string" ? img : img.url
    )
  : [];

  const [activeImage, setActiveImage] = useState(null);

  return (
    <>
      <section
        onClick={() => selectSection?.(section.id)}
        className={`relative py-24 px-6 md:px-12 transition-all duration-500 ${
          isSelected ? "ring-4 ring-yellow-400" : ""
        }`}
        style={{
  color: styles.textColor || "#ffffff",
}}
      >
        <div className="max-w-6xl mx-auto">

          {/* TITLE */}
          <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center tracking-tight">
            {content.title || "Galería"}
          </h2>

          {/* GRID PRO */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {images.map((img, index) => (
              <div
                key={index}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border border-white/10
                  shadow-xl
                  cursor-pointer
                  transition-all duration-500
                  hover:-translate-y-3
                  hover:shadow-yellow-500/30
                "
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(img);
                }}
              >
                {/* IMAGE */}
                <img
                  src={img}
                  alt=""
                  className="
                    w-full
                    h-60
                    object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t from-black/70 via-black/20 to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition duration-500
                  "
                />

                {/* ICON */}
                <div
                  className="
                    absolute inset-0
                    flex items-center justify-center
                    opacity-0
                    group-hover:opacity-100
                    transition duration-500
                  "
                >
                  <span className="
                    bg-yellow-500
                    text-black
                    px-4 py-2
                    rounded-full
                    font-semibold
                    text-sm
                    shadow-lg
                  ">
                    Ver imagen
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeImage && (
        <div
          className="
            fixed inset-0
            bg-black/80
            backdrop-blur-md
            flex items-center justify-center
            z-50
            animate-fadeIn
          "
          onClick={() => setActiveImage(null)}
        >
          <div
            className="
              relative
              max-w-5xl
              w-[90%]
              animate-scaleIn
            "
          >
            <img
              src={activeImage}
              alt=""
              className="
                w-full
                max-h-[85vh]
                object-contain
                rounded-2xl
                shadow-2xl
              "
            />

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setActiveImage(null)}
              className="
                absolute top-4 right-4
                bg-yellow-500
                text-black
                px-4 py-2
                rounded-full
                font-bold
                shadow-lg
                hover:scale-105
                transition
              "
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}