import { useEffect, useState } from "react";

export default function TestimonialsRenderer({
  section,
  content = {},
  styles = {},
}) {
  const {
    title = "Clientes satisfechos",
    items = [],
  } = content;

  const [activeIndex, setActiveIndex] = useState(0);

  // ================= AUTO ROTATE =================
  useEffect(() => {
    if (items.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [items.length]);

  const active = items[activeIndex];

  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      style={{
  background: "transparent",
  color: styles.textColor || "#ffffff",
}}
    >
      {/* ================= SOFT GLOW ================= */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-[700px] h-[700px] bg-yellow-400/10 blur-[140px] rounded-full absolute left-1/2 -translate-x-1/2 top-20" />
      </div>

      <div className="relative max-w-6xl mx-auto">

        {/* ================= TITLE ================= */}
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-gray-400 mt-4">
            Opiniones reales de nuestros clientes
          </p>
        </div>

        {items.length === 0 && (
          <p className="text-center text-gray-500">
            No hay testimonios aún.
          </p>
        )}

        {/* ================= MAIN TESTIMONIAL ================= */}
        {active && (
          <div className="mb-16">
            <div
              key={activeIndex}
              className="
                backdrop-blur-xl
                bg-white/5
                border border-white/10
                rounded-3xl
                p-10 md:p-14
                shadow-2xl
                transition-all duration-700
                animate-fadeSlide
              "
            >

              <div className="flex items-center gap-5 mb-6">

                {active.image ? (
                  <img
                    src={active.image}
                    alt={active.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xl">
                    {active.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                <div>
                  <h4 className="text-xl font-semibold text-yellow-400">
                    {active.name}
                  </h4>

                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < (active.rating || 0)
                            ? "text-yellow-400 text-lg"
                            : "text-gray-600"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-200 text-lg leading-relaxed max-w-3xl">
                “{active.comment}”
              </p>
            </div>

            {/* ================= INDICATORS ================= */}
            <div className="flex justify-center gap-2 mt-6">
              {items.map((_, i) => (
                <div
                  key={i}
                  className={`
                    h-2 rounded-full transition-all duration-300
                    ${i === activeIndex
                      ? "w-8 bg-yellow-400"
                      : "w-2 bg-gray-600"}
                  `}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {items.map((item, index) => {
            if (index === activeIndex) return null;

            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className="
                  group cursor-pointer
                  backdrop-blur-lg
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  p-6
                  transition-all duration-500
                  hover:-translate-y-3
                  hover:scale-[1.03]
                  hover:border-yellow-400/40
                "
              >

                <div className="flex items-center gap-3 mb-4">

                  {item.image ? (
  <img
    src={item.image}
    alt={item.name}
    className="w-12 h-12 rounded-full object-cover border border-yellow-400"
  />
) : (
  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
    {item.name?.charAt(0)?.toUpperCase() || "?"}
  </div>
)}

                  <div>
                    <h4 className="text-sm font-semibold text-yellow-400">
                      {item.name}
                    </h4>

                    <div className="flex gap-1 text-xs">
                      {"★★★★★".split("").map((star, i) => (
                        <span
                          key={i}
                          className={
                            i < (item.rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-600"
                          }
                        >
                          {star}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm line-clamp-3 group-hover:text-white transition">
                  {item.comment}
                </p>

              </div>
            );
          })}

        </div>
      </div>

      {/* ================= ANIMATION ================= */}
      <style>
        {`
          @keyframes fadeSlide {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          .animate-fadeSlide {
            animation: fadeSlide 0.6s ease;
          }
        `}
      </style>
    </section>
  );
}