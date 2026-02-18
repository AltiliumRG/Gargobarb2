import { useBuilder } from "../../context/BuilderContext";

export default function ServicesRenderer({ section }) {
  const { selectedSectionId, selectSection } = useBuilder();

  const isSelected = selectedSectionId === section.id;

  const content = section.content || {};
  const styles = section.styles || {};
  const services = content.items || [];

  return (
    <section
      onClick={() => selectSection(section.id)}
      className={`relative py-20 px-10 ${
        isSelected ? "ring-4 ring-yellow-400" : ""
      }`}
      style={{
        background: styles.backgroundColor || "#f9fafb",
        color: styles.textColor || "#000",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 text-center">
          {content.title || "Nuestros servicios"}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((srv, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow p-6 text-center"
            >
              {srv.image && (
                <img
                  src={srv.image}
                  alt=""
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}

              <h3 className="font-bold text-lg mb-2">
                {srv.title}
              </h3>

              <p className="text-sm opacity-80 mb-3">
                {srv.description}
              </p>

              <p className="font-semibold text-yellow-600">
                {srv.price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
