import { useState, useEffect } from "react";

function ContactForm({ primaryColor, email }) {
  const [form, setForm] = useState({
    name: "",
    userEmail: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 🔥 AUTO REMOVE SUCCESS MESSAGE
  useEffect(() => {
    if (sent) {
      const timer = setTimeout(() => {
        setSent(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [sent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSent(false);

    // VALIDACIÓN CAMPOS VACÍOS
    if (!form.name.trim() || !form.userEmail.trim() || !form.message.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // VALIDACIÓN EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.userEmail)) {
      setError("Correo electrónico inválido");
      return;
    }

    // VALIDAR QUE EL DUEÑO TENGA CORREO CONFIGURADO
    if (!email) {
      setError("El dueño no ha configurado un correo de contacto");
      return;
    }

    setLoading(true);

    try {
      const subject = encodeURIComponent(
        `Nuevo mensaje desde la web - ${form.name}`
      );

      const body = encodeURIComponent(
`📩 Nuevo mensaje desde tu sitio web GargoBarb

👤 Nombre: ${form.name}
📧 Correo del cliente: ${form.userEmail}

------------------------------------------------

${form.message}`
      );

      // 🔥 DESTINATARIO = EMAIL DEL DUEÑO
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=cm&to=${encodeURIComponent(
  email
)}&su=${subject}&body=${body}`;

      window.open(gmailUrl, "_blank");

      setSent(true);
      setForm({ name: "", userEmail: "", message: "" });

    } catch (err) {
      setError("No se pudo abrir Gmail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        relative
        bg-gradient-to-br from-white/5 to-white/10
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-8
        space-y-5
        shadow-xl
        transition
      "
    >

      {/* SUCCESS MESSAGE */}
      {sent && (
        <div className="bg-green-600/20 border border-green-500 text-green-400 text-sm p-3 rounded-lg">
          ✔ Redirigiendo a Gmail...
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-600/20 border border-red-500 text-red-400 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* NAME */}
      <input
        placeholder="Nombre completo"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        className="
          w-full p-4 rounded-xl
          bg-black/40
          border border-white/10
          focus:border-yellow-400
          focus:ring-2 focus:ring-yellow-400/30
          outline-none transition
        "
      />

      {/* CLIENT EMAIL */}
      <input
        type="email"
        placeholder="Tu correo electrónico"
        value={form.userEmail}
        onChange={(e) => handleChange("userEmail", e.target.value)}
        className="
          w-full p-4 rounded-xl
          bg-black/40
          border border-white/10
          focus:border-yellow-400
          focus:ring-2 focus:ring-yellow-400/30
          outline-none transition
        "
      />

      {/* MESSAGE */}
      <textarea
        placeholder="Escribe tu mensaje..."
        rows={5}
        value={form.message}
        onChange={(e) => handleChange("message", e.target.value)}
        className="
          w-full p-4 rounded-xl
          bg-black/40
          border border-white/10
          focus:border-yellow-400
          focus:ring-2 focus:ring-yellow-400/30
          outline-none transition
          resize-none
        "
      />

      {/* BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          relative w-full py-4 rounded-2xl
          font-bold text-black
          transition-all duration-300
          hover:scale-[1.02]
          active:scale-95
          disabled:opacity-50
        "
        style={{ background: primaryColor }}
      >
        {loading ? "Preparando mensaje..." : "Enviar mensaje"}

        <div
          className="absolute inset-0 rounded-2xl blur-xl opacity-30"
          style={{ background: primaryColor }}
        />
      </button>

    </form>
  );
}
export default function ContactRenderer({
  section,
  content = {},
  styles = {},
  site,
  preview,
}) {
  const {
    title,
    text,
    phone,
    email,
    address,
    showMap,
    showWhatsapp,
    formEnabled,
  } = content;

  const baseStyle = {
    textAlign: styles.align || "center",
    background: styles.backgroundColor || "TRANSPARENT",
    color: styles.textColor || "#fff",
    padding: styles.padding || "80px 20px",
  };

  const primaryColor =
    site?.primary_color || styles.primaryColor || "#facc15";

  return (
    <section style={baseStyle}>
      <div className="max-w-4xl mx-auto">

        {/* TITLE */}
        <h2 className="text-4xl font-bold mb-6">
          {title || "Contacto"}
        </h2>

        {/* DESCRIPTION */}
        {text && (
          <p className="opacity-80 mb-8">
            {text}
          </p>
        )}

        {/* INFO BLOCK */}
        <div className="space-y-2 mb-8">
          {phone && (
            <p>
              <strong>Tel:</strong> {phone}
            </p>
          )}

          {email && (
            <p>
              <strong>Email:</strong> {email}
            </p>
          )}

          {address && (
            <p>
              <strong>Dirección:</strong> {address}
            </p>
          )}
        </div>

        {/* CTA BUTTON */}
        {(showWhatsapp || phone) && (
          <a
            href={
              showWhatsapp && phone
                ? `https://wa.me/${phone.replace(/\D/g, "")}`
                : "#"
            }
            target="_blank"
            rel="noreferrer"
            className="inline-block px-6 py-3 rounded-lg font-semibold mb-10"
            style={{
              background: primaryColor,
              color: "#000",
            }}
          >
            Contactar por WhatsApp
          </a>
        )}

        {/* MAP */}
        {showMap && address && (
          <div className="w-full h-72 rounded-xl overflow-hidden shadow-lg mb-10">
            <iframe
              title="map"
              width="100%"
              height="100%"
              loading="lazy"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                address
              )}&output=embed`}
            />
          </div>
        )}

        {/* FORM */}
        
          {formEnabled && (
  <ContactForm
    primaryColor={primaryColor}
    email={email}
  />
)}
      </div>
    </section>
  );
}