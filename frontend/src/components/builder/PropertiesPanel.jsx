import { useBuilder } from "../../context/BuilderContext";
import { uploadSiteImage } from "../../api/upload.api";
import { useState, useEffect } from "react";
import { useBarber } from "../../context/BarberContext";

import {
  createService,
  updateService,
  deleteService,
  getServicesByBarbershop
} from "../../api/services.api";

function InputPro({ value, onChange, placeholder }) {
  return (
    <input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full
        bg-gray-900
        border border-gray-700
        focus:border-yellow-400
        focus:ring-2 focus:ring-yellow-400/30
        p-3
        rounded-xl
        outline-none
        transition
      "
    />
  );
}

function TextareaPro({ value, onChange, placeholder }) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="
        w-full
        bg-gray-900
        border border-gray-700
        focus:border-yellow-400
        focus:ring-2 focus:ring-yellow-400/30
        p-3
        rounded-xl
        outline-none
        transition
        resize-none
      "
    />
  );
}

export default function PropertiesPanel() {

  const {
    sections,
    selectedSectionId,
    updateSectionContent,
    updateSectionStyles,
  } = useBuilder();

const { activeBarbershop, services, setServices } = useBarber();
  const [loadingServices, setLoadingServices] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!activeBarbershop?.id) return;

    const loadServices = async () => {
      try {
        setLoadingServices(true);
        const res = await getServicesByBarbershop(activeBarbershop.id);
        setServices(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, [activeBarbershop?.id]);

  // ⬇️ Después de TODOS los hooks

  if (!selectedSectionId) {
    return (
      <aside className="w-80 h-screen bg-gray-900 border-l border-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold">Editor de sección</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-400">Selecciona una sección</p>
        </div>
      </aside>
    );
  }

  const section = sections.find((s) => s.id === selectedSectionId);
  if (!section) return null;

  const content = section.content || {};
  const styles = section.styles || {};
  

  const handleContent = (key, value) => {
    updateSectionContent(section.id, { [key]: value });
  };

  const handleStyle = (key, value) => {
    updateSectionStyles(section.id, { [key]: value });
  };

  /* ============================================================
     UPLOAD HELPERS
  ============================================================ */
  const uploadImageAndSet = async (file, setter) => {
    if (!file) return;
    try {
      const res = await uploadSiteImage(file);
      setter(res.data.url);
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  };

  /* ============================================================
     UI
  ============================================================ */
  return (
    <aside className="h-full flex flex-col text-white">

  {/* HEADER */}
  <div className="p-4 border-b border-gray-800 flex-shrink-0">
    <h2 className="text-lg font-bold">Editor de sección</h2>
  </div>

  {/* SCROLL INTERNO */}
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
  
      {/* =======================================================
          HERO
      ======================================================= */}
      {section.type === "hero" && (
  <div className="space-y-6">

    {/* ================= HEADER CARD ================= */}
    <div className="
      bg-gradient-to-br from-[#0b1220] to-[#0f172a]
      border border-gray-800
      rounded-2xl
      p-6
      shadow-lg
      space-y-5
    ">

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">
          Hero principal
        </h3>

        <span className="text-xs text-gray-500">
          Sección destacada
        </span>
      </div>

      {/* TITLE */}
      <InputPro
        placeholder="Título principal"
        value={content.title || ""}
        onChange={(value) => handleContent("title", value)}
      />

      {/* SUBTITLE */}
      <InputPro
        placeholder="Subtítulo"
        value={content.subtitle || ""}
        onChange={(value) => handleContent("subtitle", value)}
      />

      {/* OPTIONAL TEXT */}
      <TextareaPro
        placeholder="Texto descriptivo (opcional)"
        value={content.text || ""}
        onChange={(value) => handleContent("text", value)}
      />

      {/* BUTTON TEXT */}
      <InputPro
        placeholder="Texto del botón"
        value={content.buttonText || ""}
        onChange={(value) => handleContent("buttonText", value)}
      />
    </div>

    {/* ================= IMAGE UPLOAD ================= */}
    <div className="
      bg-[#0b1220]
      border border-gray-800
      rounded-2xl
      p-6
      space-y-4
    ">

      <h4 className="text-sm text-gray-400">
        Imagen de fondo
      </h4>

      {/* DROPZONE PRO */}
      <label
        className="
          relative
          flex flex-col items-center justify-center
          gap-3
          border-2 border-dashed border-gray-700
          hover:border-yellow-400
          rounded-xl
          p-6
          cursor-pointer
          transition
          bg-gray-900/50
          hover:bg-gray-900
        "
      >
        <span className="text-sm text-gray-400">
          Click o arrastra imagen
        </span>

        <span className="text-xs text-gray-600">
          Recomendado: alta resolución
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            uploadImageAndSet(e.target.files[0], (url) =>
              handleContent("image", url)
            )
          }
        />
      </label>

      {content.image && (
        <div className="relative group rounded-xl overflow-hidden border border-gray-800">
          <img
            src={content.image}
            className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <button
            onClick={() => handleContent("image", "")}
            className="
              absolute top-3 right-3
              bg-red-600 hover:bg-red-700
              text-white text-xs
              px-3 py-1
              rounded-lg
              opacity-0 group-hover:opacity-100
              transition
            "
          >
            Eliminar
          </button>
        </div>
      )}
    </div>

    {/* ================= BUTTON STYLE ================= */}
    <div className="
      bg-[#0b1220]
      border border-gray-800
      rounded-2xl
      p-6
      space-y-4
    ">
      <h4 className="text-sm text-gray-400">
        Estilo del botón
      </h4>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Color botón
        </span>

        <input
          type="color"
          value={styles.buttonColor || "#facc15"}
          onChange={(e) => handleStyle("buttonColor", e.target.value)}
          className="w-12 h-8 rounded cursor-pointer border border-gray-700 bg-transparent"
        />
      </div>
    </div>

  </div>
)}
{/* =======================================================
    ABOUT EDITOR
======================================================= */}
{section.type === "about" && (
  <div className="space-y-6">

    <div className="
      bg-gradient-to-br from-[#0b1220] to-[#0f172a]
      border border-gray-800
      rounded-2xl
      p-6
      shadow-lg
      space-y-5
    ">

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">
          Sección About
        </h3>
        <span className="text-xs text-gray-500">
          Información institucional
        </span>
      </div>

      <InputPro
        placeholder="Título (ej: Sobre nosotros)"
        value={content.title || ""}
        onChange={(value) => handleContent("title", value)}
      />

      <TextareaPro
        placeholder="Descripción completa"
        value={content.text || ""}
        onChange={(value) => handleContent("text", value)}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Alineación texto
        </span>

        <select
          value={styles.align || "center"}
          onChange={(e) => handleStyle("align", e.target.value)}
          className="bg-gray-900 border border-gray-700 p-2 rounded-xl"
        >
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
      </div>

    </div>

  </div>
)}

{/* =======================================================
    TESTIMONIALS EDITOR PRO
======================================================= */}
{section.type === "testimonials" && (
  <div className="space-y-8">

    {/* ================= HEADER CARD ================= */}
    <div className="
      bg-gradient-to-br from-[#0b1220] to-[#0f172a]
      border border-gray-800
      rounded-2xl
      p-6
      shadow-lg
      space-y-5
    ">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">
          Sección Testimonios
        </h3>
        <span className="text-xs text-gray-500">
          Opiniones de clientes
        </span>
      </div>

      <InputPro
        placeholder="Título sección"
        value={content.title || ""}
        onChange={(value) => handleContent("title", value)}
      />
    </div>

    {/* ================= LISTA ================= */}
    {(content.items || []).map((item, index) => {

      const updateItem = (field, value) => {
        const updated = [...(content.items || [])];
        updated[index] = {
          ...updated[index],
          [field]: value
        };
        handleContent("items", updated);
      };

      return (
        <div
          key={index}
          className="
            bg-[#0b1220]
            border border-gray-800
            rounded-2xl
            p-6
            space-y-6
            transition hover:border-yellow-400/40
          "
        >

          {/* -------- HEADER -------- */}
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Testimonio #{index + 1}
            </span>

            <button
              onClick={() => {
                const updated = content.items.filter((_, i) => i !== index);
                handleContent("items", updated);
              }}
              className="text-xs text-red-400 hover:text-red-500 transition"
            >
              Eliminar
            </button>
          </div>

          {/* -------- PREVIEW MINI -------- */}
          <div className="
            bg-[#111827]
            border border-gray-800
            rounded-xl
            p-4
            flex items-center gap-4
          ">

            {/* Avatar */}
            {item.image ? (
              <img
                src={item.image}
                className="w-12 h-12 rounded-full object-cover border border-yellow-400"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
                {item.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-yellow-400 font-semibold truncate">
                {item.name || "Nombre cliente"}
              </p>

              <div className="flex gap-1 text-yellow-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < (item.rating || 0) ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* -------- NOMBRE -------- */}
          <InputPro
            placeholder="Nombre cliente"
            value={item.name || ""}
            onChange={(value) => updateItem("name", value)}
          />

          {/* -------- COMENTARIO -------- */}
          <TextareaPro
            placeholder="Comentario"
            value={item.comment || ""}
            onChange={(value) => updateItem("comment", value)}
          />

          {/* -------- RATING -------- */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Rating
            </span>

            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => updateItem("rating", i + 1)}
                  className={`
                    text-xl transition
                    ${i < (item.rating || 0)
                      ? "text-yellow-400 scale-110"
                      : "text-gray-600 hover:text-yellow-400"}
                  `}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* -------- IMAGEN -------- */}
          <div className="space-y-3">
            <label className="text-xs text-gray-400">
              Imagen cliente
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const res = await uploadSiteImage(file);
                updateItem("image", res.data.url);
              }}
              className="w-full bg-gray-900 border border-gray-700 p-2 rounded-xl"
            />

            {item.image && (
              <img
                src={item.image}
                className="w-16 h-16 object-cover rounded-full border border-yellow-400"
              />
            )}
          </div>

        </div>
      );
    })}

    {/* ================= ADD BUTTON ================= */}
    <button
      onClick={() => {
        const updated = [
          ...(content.items || []),
          {
            name: "Nuevo cliente",
            comment: "Comentario...",
            rating: 5,
            image: ""
          }
        ];
        handleContent("items", updated);
      }}
      className="
        w-full
        bg-gradient-to-r from-yellow-500 to-yellow-400
        text-black
        py-3
        rounded-xl
        font-bold
        transition
        active:scale-95
        shadow-lg
      "
    >
      + Agregar testimonio
    </button>

  </div>
)}

{/* -----------------------------------------------------
--------------------------------------------------------
---------------SERVICES----------------------------- */}

{section.type === "services" && (
  <div className="space-y-8">

    {/* ================= HEADER ================= */}
    <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
      <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">
        Configuración de sección
      </h3>

      <input
        placeholder="Título de sección"
        value={content.title || ""}
        onChange={(e) => handleContent("title", e.target.value)}
        className="w-full bg-gray-900 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 p-3 rounded-xl outline-none transition"
      />
    </div>

    {/* ================= SERVICES LIST ================= */}

    {loadingServices ? (
      <div className="text-center text-gray-500 text-sm py-10">
        Cargando servicios...
      </div>
    ) : services.length === 0 ? (
      <div className="text-center text-gray-500 text-sm py-10 border border-gray-800 rounded-2xl bg-[#0b1220]">
        No hay servicios aún
      </div>
    ) : (
      services.map((srv, i) => (
        <ServiceCardEditor
          key={srv.id}
          srv={srv}
          index={i}
          services={services}
          setServices={setServices}
          setSavingId={setSavingId}
          savingId={savingId}
        />
      ))
    )}

    {/* ================= ADD BUTTON ================= */}

    <button
      onClick={async () => {
        const res = await createService({
          barbershop_id: activeBarbershop.id,
          name: "Nuevo servicio",
          description: "",
          price: 0,
          duration_minutes: 30,
          image: ""
        });

        setServices(prev => [...prev, res.data]);
        // 🔥 sincroniza renderer
      }}
      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black py-3 rounded-xl font-bold transition shadow-lg active:scale-95"
    >
      + Agregar servicio
    </button>

  </div>

)}


{/* ---------------------------------------------------
----------------------------------------------------
--------------GALLERY----------------------------
 */}
      {section.type === "gallery" && (
  <div className="space-y-6">

    {/* HEADER CARD */}
    <div className="
      bg-gradient-to-br from-[#0b1220] to-[#0f172a]
      border border-gray-800
      rounded-2xl
      p-6
      shadow-lg
      space-y-5
    ">

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">
          Galería visual
        </h3>

        <span className="text-xs text-gray-400">
          {content.images?.length || 0} imágenes
        </span>
      </div>

      <InputPro
        placeholder="Título galería"
        value={content.title || ""}
        onChange={(value) => handleContent("title", value)}
      />

      {/* DROPZONE PRO */}
      <label
        className="
          relative
          flex flex-col items-center justify-center
          gap-3
          border-2 border-dashed border-gray-700
          hover:border-yellow-400
          rounded-xl
          p-6
          cursor-pointer
          transition
          bg-gray-900/50
          hover:bg-gray-900
        "
      >
        <span className="text-sm text-gray-400">
          Arrastra o haz click para subir imagen
        </span>

        <span className="text-xs text-gray-600">
          JPG, PNG recomendado
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) =>
            uploadImageAndSet(e.target.files[0], (url) =>
              handleContent("images", [...(content.images || []), url])
            )
          }
        />
      </label>
    </div>

    {/* EMPTY STATE */}
    {(!content.images || content.images.length === 0) && (
      <div className="
        text-center
        text-gray-500
        text-sm
        py-10
        border border-gray-800
        rounded-2xl
        bg-[#0b1220]
      ">
        No hay imágenes aún
      </div>
    )}

    {/* GRID PRO */}
    {content.images?.length > 0 && (
      <div className="
        grid grid-cols-2 gap-4
      ">
        {content.images.map((img, i) => (
          <div
            key={`gallery-${section.id}-${i}`}
            className="
              relative
              group
              rounded-2xl
              overflow-hidden
              border border-gray-800
              hover:border-yellow-400/50
              transition-all duration-300
              hover:shadow-lg hover:shadow-yellow-500/10
            "
          >
            {/* IMAGE */}
            <img
              src={img}
              className="
                h-32 w-full object-cover
                transition-transform duration-500
                group-hover:scale-110
              "
            />

            {/* DARK OVERLAY */}
            <div className="
              absolute inset-0
              bg-black/40
              opacity-0
              group-hover:opacity-100
              transition
              flex items-center justify-center
            ">

              <button
                onClick={() => {
                  const updated = content.images.filter((_, index) => index !== i);
                  handleContent("images", updated);
                }}
                className="
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  text-xs
                  px-3 py-1
                  rounded-lg
                  shadow-md
                  transition
                "
              >
                Eliminar
              </button>

            </div>

            {/* INDEX BADGE */}
            <div className="
              absolute top-2 left-2
              bg-black/70
              text-white
              text-xs
              px-2 py-1
              rounded-md
            ">
              #{i + 1}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
{/* =======================================================
    CONTACT EDITOR PRO
======================================================= */}
{section.type === "contact" && (
  <div className="space-y-6">

    {/* ================= HEADER CARD ================= */}
    <div className="
      bg-gradient-to-br from-[#0b1220] to-[#0f172a]
      border border-gray-800
      rounded-2xl
      p-6
      shadow-lg
      space-y-5
    ">

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">
          Sección de contacto
        </h3>

        <span className="text-xs text-gray-500">
          Información pública
        </span>
      </div>

      <InputPro
        placeholder="Título (ej: Agenda tu cita)"
        value={content.title || ""}
        onChange={(value) => handleContent("title", value)}
      />

      <TextareaPro
        placeholder="Texto descriptivo"
        value={content.text || ""}
        onChange={(value) => handleContent("text", value)}
      />
    </div>

    {/* ================= CONTACT INFO ================= */}
    <div className="
      bg-[#0b1220]
      border border-gray-800
      rounded-2xl
      p-6
      space-y-5
    ">

      <h4 className="text-sm text-gray-400">
        Datos de contacto
      </h4>

      <InputPro
        placeholder="Teléfono (ej: 573001234567)"
        value={content.phone || ""}
        onChange={(value) => handleContent("phone", value)}
      />

      <InputPro
        placeholder="Correo electrónico"
        value={content.email || ""}
        onChange={(value) => handleContent("email", value)}
      />

      <InputPro
        placeholder="Dirección física"
        value={content.address || ""}
        onChange={(value) => handleContent("address", value)}
      />
    </div>

    {/* ================= VISIBILITY OPTIONS ================= */}
    <div className="
      bg-[#0b1220]
      border border-gray-800
      rounded-2xl
      p-6
      space-y-4
    ">

      <h4 className="text-sm text-gray-400">
        Opciones visibles
      </h4>

      {/* TOGGLE ITEM */}
      {[
        {
          label: "Mostrar mapa",
          key: "showMap",
          value: content.showMap || false
        },
        {
          label: "Mostrar botón WhatsApp",
          key: "showWhatsapp",
          value: content.showWhatsapp || false
        },
        {
          label: "Activar formulario",
          key: "formEnabled",
          value: content.formEnabled || false
        }
      ].map((item, i) => (
        <div
          key={i}
          className="
            flex items-center justify-between
            bg-gray-900/60
            hover:bg-gray-900
            border border-gray-800
            rounded-xl
            px-4 py-3
            transition
          "
        >
          <span className="text-sm text-gray-300">
            {item.label}
          </span>

          <button
            type="button"
            onClick={() =>
              handleContent(item.key, !item.value)
            }
            className={`
              relative w-12 h-6 rounded-full transition
              ${item.value ? "bg-yellow-400" : "bg-gray-700"}
            `}
          >
            <span
              className={`
                absolute top-1 left-1
                w-4 h-4 rounded-full bg-white
                transition-transform
                ${item.value ? "translate-x-6" : ""}
              `}
            />
          </button>
        </div>
      ))}

    </div>

  </div>
)}

      {/* =======================================================
          STYLES
      ======================================================= */}
      <div className="mt-6 border-t border-gray-700 pt-4">
        <p className="text-sm text-gray-400 mb-2">Estilos</p>

        <label className="block text-sm mb-1">Color fondo</label>
        <input
          type="color"
          value={styles.backgroundColor || "#000000"}
          onChange={(e) => handleStyle("backgroundColor", e.target.value)}
        />

        <label className="block text-sm mt-3 mb-1">Color texto</label>
        <input
          type="color"
          value={styles.textColor || "#ffffff"}
          onChange={(e) => handleStyle("textColor", e.target.value)}
        />
      </div>
    </div>
    </aside>
  );
} function ServiceCardEditor({
  srv,
  index,
  services,
  setServices,
  savingId,
  setSavingId,
  
}) {

  const handleLocalUpdate = (field, value) => {
    setServices(prev =>
      prev.map(s =>
        s.id === srv.id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleServerUpdate = async (payload) => {
    try {
      setSavingId(srv.id);
      await updateService(srv.id, payload);
      
      // 🔥 fuerza re-render global
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-[#0b1220] border border-gray-800 hover:border-yellow-400/40 rounded-2xl p-6 space-y-4 transition-all duration-300">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-yellow-400">
          Servicio #{index + 1}
        </span>

        <button
          onClick={async () => {
            await deleteService(srv.id);
            setServices(prev => prev.filter(s => s.id !== srv.id));
            
          }}
          className="text-xs text-red-400 hover:text-red-500 transition"
        >
          Eliminar
        </button>
      </div>

      {/* NOMBRE */}
      <input
        value={srv.name || ""}
        onChange={(e) => handleLocalUpdate("name", e.target.value)}
        onBlur={() => handleServerUpdate({ name: srv.name })}
        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl"
        placeholder="Nombre del servicio"
      />

      {/* DESCRIPCIÓN */}
      <textarea
        value={srv.description || ""}
        onChange={(e) => handleLocalUpdate("description", e.target.value)}
        onBlur={() => handleServerUpdate({ description: srv.description })}
        rows={3}
        className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl resize-none"
        placeholder="Descripción"
      />

      {/* PRECIO + DURACIÓN */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          value={srv.price || ""}
          onChange={(e) =>
            handleLocalUpdate("price", Number(e.target.value))
          }
          onBlur={() => handleServerUpdate({ price: srv.price })}
          className="bg-gray-900 border border-gray-700 p-3 rounded-xl"
          placeholder="Precio"
        />

        <input
          type="number"
          value={srv.duration_minutes || ""}
          onChange={(e) =>
            handleLocalUpdate("duration_minutes", Number(e.target.value))
          }
          onBlur={() =>
            handleServerUpdate({
              duration_minutes: srv.duration_minutes
            })
          }
          className="bg-gray-900 border border-gray-700 p-3 rounded-xl"
          placeholder="Duración (min)"
        />
      </div>

      {/* IMAGEN */}
      <div className="space-y-3">
        <label className="text-xs text-gray-400">
          Imagen del servicio
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setSavingId(srv.id);

            const res = await uploadSiteImage(file);

            await updateService(srv.id, {
              image: res.data.url
            });

            handleLocalUpdate("image", res.data.url);
             // 🔥 actualiza renderer en tiempo real
            setSavingId(null);
          }}
          className="w-full bg-gray-900 border border-gray-700 p-2 rounded-xl"
        />

        {srv.image && (
          <img
            src={srv.image}
            className="w-full h-32 object-cover rounded-xl border border-gray-700"
          />
        )}
      </div>

      {savingId === srv.id && (
        <div className="text-xs text-yellow-400">
          Guardando...
        </div>
      )}

    </div>
  );
}