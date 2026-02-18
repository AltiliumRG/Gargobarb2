import { useBuilder } from "../../context/BuilderContext";

/**
 * Universal renderer:
 * - preview=false → modo edición (builder)
 * - preview=true → modo web pública
 */

export default function SectionRendererUniversal({
  section,
  site,
  preview = false,
}) {
  if (!section?.is_visible) return null;

  const content = section.content || {};
  const styles = section.styles || {};

  const baseStyle = {
    background: styles.backgroundColor || "#0f172a",
    color: styles.textColor || "#fff",
    textAlign: styles.align || "center",
    padding: styles.padding || "80px 20px",
  };

  switch (section.type) {
    case "hero":
      return (
        <Hero
          section={section}
          content={content}
          styles={baseStyle}
          site={site}
          preview={preview}
        />
      );

    case "services":
      return (
        <Services
          section={section}
          content={content}
          styles={baseStyle}
          site={site}
          preview={preview}
        />
      );

    case "gallery":
      return (
        <Gallery
          section={section}
          content={content}
          styles={baseStyle}
          preview={preview}
        />
      );

    case "about":
      return (
        <About
          section={section}
          content={content}
          styles={baseStyle}
          preview={preview}
        />
      );

    case "contact":
      return (
        <Contact
          section={section}
          content={content}
          styles={baseStyle}
          site={site}
          preview={preview}
        />
      );

    default:
      return null;
  }
}

/* ======================================================
   HERO
====================================================== */

function Hero({ section, content, styles, site, preview }) {
  const builder = useBuilder();

  const update = (key, value) => {
    if (preview || !builder) return;
    builder.updateSectionContent(section.id, {
      ...content,
      [key]: value,
    });
  };

  const background =
    content.image ||
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033";

  return (
    <section
      style={{
        ...styles,
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 20px",
      }}
    >
      {/* overlay oscuro profesional */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto text-center w-full">
        {!preview ? (
          <input
            value={content.title || ""}
            onChange={(e) => update("title", e.target.value)}
            className="text-6xl md:text-8xl font-bold mb-6 bg-transparent outline-none w-full text-center text-white placeholder-white/50"
            placeholder="Título hero"
          />
        ) : (
          <h2 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight">
            {content.title || "Tu estilo empieza aquí"}
          </h2>
        )}

        {!preview ? (
          <textarea
            value={content.subtitle || ""}
            onChange={(e) => update("subtitle", e.target.value)}
            className="text-xl md:text-2xl mb-8 opacity-90 bg-transparent outline-none w-full text-center text-white placeholder-white/50 resize-none h-auto"
            placeholder="Subtítulo"
          />
        ) : (
          <p className="text-xl md:text-2xl mb-8 text-white opacity-90 max-w-3xl mx-auto">
            {content.subtitle || "Cortes profesionales premium"}
          </p>
        )}

        <button
          className="px-10 py-5 rounded-xl font-bold text-black text-lg uppercase tracking-widest hover:scale-105 transition-transform"
          style={{
            background: site?.primary_color || styles.textColor || "#facc15",
          }}
        >
          {content.buttonText || "Reservar cita"}
        </button>
      </div>
    </section>
  );
}



/* ======================================================
   SERVICES
====================================================== */

function Services({ section, content, styles, site, preview }) {
  const builder = useBuilder();
  const services = content.items || [];

  const updateItems = (items) => {
    if (preview || !builder) return;
    builder.updateSectionContent(section.id, {
      ...content,
      items,
    });
  };

  const removeService = (index) => {
    const updated = services.filter((_, i) => i !== index);
    updateItems(updated);
  };

  return (
    <section style={styles}>
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <input
          disabled={preview}
          value={content.title || ""}
          onChange={(e) =>
            builder.updateSectionContent(section.id, {
              ...content,
              title: e.target.value,
            })
          }
          className="text-4xl font-bold mb-12 text-center bg-transparent outline-none w-full"
          placeholder="Servicios"
        />

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">

          {services.map((srv, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur rounded-xl overflow-hidden shadow-lg relative"
            >

              {/* DELETE */}
              {!preview && (
                <button
                  onClick={() => removeService(i)}
                  className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-xs"
                >
                  ✕
                </button>
              )}

              {/* IMAGE */}
              <img
                src={srv.image || "https://picsum.photos/300"}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">

                {/* TITLE */}
                <input
                  disabled={preview}
                  value={srv.title}
                  onChange={(e) => {
                    const copy = [...services];
                    copy[i].title = e.target.value;
                    updateItems(copy);
                  }}
                  className="font-bold text-lg mb-1 bg-transparent outline-none w-full"
                />

                {/* DESCRIPTION */}
                <textarea
                  disabled={preview}
                  value={srv.description}
                  onChange={(e) => {
                    const copy = [...services];
                    copy[i].description = e.target.value;
                    updateItems(copy);
                  }}
                  className="text-sm opacity-70 mb-3 bg-transparent outline-none w-full"
                />

                {/* PRICE */}
                <input
                  disabled={preview}
                  value={srv.price}
                  onChange={(e) => {
                    const copy = [...services];
                    copy[i].price = e.target.value;
                    updateItems(copy);
                  }}
                  className="font-semibold text-yellow-400 mb-3 bg-transparent outline-none w-full"
                />

                {/* BUTTON TEXT */}
                {!preview && (
                  <input
                    value={srv.buttonText}
                    onChange={(e) => {
                      const copy = [...services];
                      copy[i].buttonText = e.target.value;
                      updateItems(copy);
                    }}
                    placeholder="Texto botón"
                    className="mb-2 w-full bg-gray-800 p-2 rounded"
                  />
                )}

                {/* BUTTON LINK */}
                {!preview && (
                  <input
                    value={srv.buttonLink}
                    onChange={(e) => {
                      const copy = [...services];
                      copy[i].buttonLink = e.target.value;
                      updateItems(copy);
                    }}
                    placeholder="Link botón"
                    className="mb-3 w-full bg-gray-800 p-2 rounded"
                  />
                )}

                {/* CTA */}
                <a
                  href={srv.buttonLink || "#"}
                  className="block text-center py-2 rounded font-semibold transition-colors"
                  style={{
                    backgroundColor: site?.primary_color || "#facc15",
                    color: "#000",
                  }}
                >
                  {srv.buttonText || "Reservar"}
                </a>
              </div>
            </div>
          ))}

        </div>

        {/* ADD */}
        {!preview && (
          <div className="text-center mt-10">
            <button
              onClick={() =>
                updateItems([
                  ...services,
                  {
                    title: "Nuevo servicio",
                    description: "",
                    price: "$0",
                    image: "",
                    buttonText: "Reservar",
                    buttonLink: "#",
                  },
                ])
              }
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold"
            >
              + Agregar servicio
            </button>
          </div>
        )}

      </div>
    </section>
  );
}

/* ======================================================
   GALLERY
====================================================== */

function Gallery({ section, content, styles, preview }) {
  const builder = useBuilder?.();
  const images = content.images || [];

  const updateImages = (imgs) => {
    if (preview) return;
    builder.updateSectionContent(section.id, {
      ...content,
      images: imgs,
    });
  };

  return (
    <section style={styles}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-10 text-center">
          {content.title || "Galería"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, i) => (
            <img key={i} src={img} className="rounded-xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======================================================
   ABOUT
====================================================== */

function About({ section, content, styles, preview }) {
  const builder = useBuilder?.();

  return (
    <section style={styles}>
      <div className="max-w-4xl mx-auto text-center">
        <input
          disabled={preview}
          value={content.title || ""}
          onChange={(e) =>
            builder.updateSectionContent(section.id, {
              ...content,
              title: e.target.value,
            })
          }
          className="text-4xl font-bold mb-6 bg-transparent outline-none w-full"
        />

        <textarea
          disabled={preview}
          value={content.text || ""}
          onChange={(e) =>
            builder.updateSectionContent(section.id, {
              ...content,
              text: e.target.value,
            })
          }
          className="opacity-80 bg-transparent outline-none w-full"
        />
      </div>
    </section>
  );
}

/* ======================================================
   CONTACT
====================================================== */

function Contact({ section, content, styles, site, preview }) {
  return (
    <section style={styles}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          {content.title || "Contacto"}
        </h2>

        <p className="mb-6 opacity-80">{content.text || ""}</p>

        <button
          className="px-6 py-3 rounded-lg font-semibold"
          style={{
            background: site?.primary_color || "#facc15",
            color: "#000",
          }}
        >
          {content.buttonText || "Reservar"}
        </button>
      </div>
    </section>
  );
}
