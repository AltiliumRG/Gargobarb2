export default function TestimonialsRenderer({
  section,
  content = {},
  styles = {},
}) {
  const {
    title = "Clientes satisfechos",
    items = []
  } = content;

  return (
    <section
      className="relative py-28 px-6"
      style={{
        backgroundColor: styles.backgroundColor || "#0b0f14",
        color: styles.textColor || "#ffffff"
      }}
    >
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-400">
            {title}
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto mt-4 rounded-full" />
        </div>

        {items.length === 0 && (
          <p className="text-center text-gray-500">
            No hay testimonios aún.
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          {items.map((item, index) => (
            <div
              key={index}
              className="
                group
                bg-[#111827]
                border border-gray-800
                rounded-2xl
                p-8
                transition-all duration-500
                hover:border-yellow-400/40
                hover:-translate-y-3
                hover:shadow-[0_0_40px_rgba(250,204,21,0.15)]
              "
            >

              {/* TOP - AVATAR + NAME */}
              <div className="flex items-center gap-4 mb-6">

                {/* AVATAR */}
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
                    {item.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-yellow-400 truncate">
                    {item.name}
                  </h4>

                  {/* STARS */}
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`
                          transition-all duration-300
                          ${i < (item.rating || 0)
                            ? "text-yellow-400 scale-110 group-hover:scale-125"
                            : "text-gray-600"
                          }
                        `}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* COMMENT */}
              <p className="
                text-gray-300 leading-relaxed
                line-clamp-4
                group-hover:text-white
                transition duration-300
              ">
                {item.comment}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}