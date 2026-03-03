import { useMemo } from "react";
import { useBarber } from "../../context/BarberContext";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:4000";

export default function ServicesRenderer({ section }) {
  const { services } = useBarber();
  const navigate = useNavigate();

  const styles = section.styles || {};

  // 🔥 Normalizar imágenes (solo si vienen relativas)
  const normalizedServices = useMemo(() => {
    return (services || []).map((srv) => ({
      ...srv,
      image: srv.image
        ? srv.image.startsWith("http")
          ? srv.image
          : `${API_BASE}/${srv.image}`
        : null,
    }));
  }, [services]);

  return (
    <section
      className="py-24 px-6 md:px-12 transition-all duration-300"
      style={{ color: styles.textColor || "#ffffff" }}
    >
      <div className="max-w-6xl mx-auto">

        <h2 className="text-4xl md:text-5xl font-extrabold mb-16 text-center">
          {section.content?.title || "Nuestros servicios"}
        </h2>

        {normalizedServices.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay servicios disponibles
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">

            {normalizedServices.map((srv) => (
              <div
                key={srv.id}
                className="group flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-yellow-500/30"
              >

                {/* IMAGEN */}
                {srv.image && (
                  <div className="overflow-hidden">
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-full h-52 object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">

                  <h3 className="font-bold text-xl mb-3">
                    {srv.name}
                  </h3>

                  {srv.description && (
                    <p className="text-sm text-gray-300 mb-6">
                      {srv.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4">

                    <span className="bg-yellow-500 text-black text-sm font-bold px-4 py-2 rounded-full">
                      ${Number(srv.price || 0).toLocaleString()}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/checkout/${srv.id}`, {
                          state: { service: srv }
                        })
                      }
                      className="px-5 py-2 text-sm font-semibold rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition"
                    >
                      Reservar
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </section>
  );
}