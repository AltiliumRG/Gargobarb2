import { useState, useEffect } from "react";

function ContactForm({ email }) {
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
      <div className="relative">
  <input
    value={form.name}
    onChange={(e) => handleChange("name", e.target.value)}
    placeholder=" "
    className="
      peer w-full p-4 pt-6 rounded-xl
      bg-black/30
      border border-white/10
      outline-none transition-all
      focus:border-yellow-400
    "
  />
  <label className="
    absolute left-4 top-2 text-xs text-gray-400 transition-all
    peer-placeholder-shown:top-4
    peer-placeholder-shown:text-sm
    peer-placeholder-shown:text-gray-500
    peer-focus:top-2
    peer-focus:text-xs
  ">
    Nombre completo
  </label>
</div>

      {/* CLIENT EMAIL */}
      <div className="relative">
  <input
    type="email"
    value={form.userEmail}
    onChange={(e) => handleChange("userEmail", e.target.value)}
    placeholder=" "
    className="peer w-full p-4 pt-6 rounded-xl bg-black/30 border border-white/10 outline-none transition-all focus:border-yellow-400"
  />
  <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
    Tu correo electrónico
  </label>
</div>

      {/* MESSAGE */}
      <div className="relative">
  <textarea
    rows={5}
    value={form.message}
    onChange={(e) => handleChange("message", e.target.value)}
    placeholder=" "
    className="peer w-full p-4 pt-6 rounded-xl bg-black/30 border border-white/10 outline-none transition-all resize-none focus:border-yellow-400"
  />
  <label className="absolute left-4 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs">
    Escribe tu mensaje
  </label>
</div>

      {/* BUTTON */}
      <button
  type="submit"
  disabled={loading}
  className="
    relative w-full py-4 rounded-2xl
    font-bold text-black uppercase tracking-wide
    bg-gradient-to-r from-yellow-400 to-yellow-500
    transition-all duration-300
    hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(250,204,21,0.4)]
    active:scale-95
    disabled:opacity-50
    overflow-hidden
  "
>
  <span className="relative z-10">
    {loading ? "Preparando mensaje..." : "Enviar mensaje"}
  </span>

  {/* glow */}
  <div
    className="absolute inset-0 bg-yellow-400 blur-2xl opacity-40 animate-pulse"
  />

  {/* shine */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition" />
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
    padding: styles.padding || "60px 20px md:80px 40px",
  };

  return (
    <section
      style={{
        ...baseStyle,
        padding: styles.padding || "80px 20px",
        background: "transparent",
      }}
      className="relative overflow-hidden px-6"
    >
    {/* 🔥 GLOW GLOBAL */}
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="w-[700px] h-[700px] blur-[140px] rounded-full absolute left-1/2 -translate-x-1/2 top-10 bg-yellow-400/20"
      />
    </div>

    <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">

      {/* ================= LEFT INFO ================= */}
      <div className="text-left">

        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          {title || "Contacto"}
        </h2>

        {/* DESCRIPTION */}
        {text && (
          <p className="opacity-70 mb-8">
            {text}
          </p>
        )}

        {/* INFO */}
        <div className="space-y-4 text-sm md:text-base">

          {phone && (
            <p className="opacity-80">
              📞 <strong>Tel:</strong> {phone}
            </p>
          )}

          {email && (
            <p className="opacity-80">
              📧 <strong>Email:</strong> {email}
            </p>
          )}

          {address && (
            <p className="opacity-80">
              📍 <strong>Dirección:</strong> {address}
            </p>
          )}
        </div>

        {/* WHATSAPP */}
        {(showWhatsapp || phone) && (
          <a
            href={
              showWhatsapp && phone
                ? `https://wa.me/${phone.replace(/\D/g, "")}`
                : "#"
            }
            target="_blank"
            rel="noreferrer"
            className="
              inline-block mt-8 px-6 py-3 rounded-xl font-bold bg-yellow-400 text-black
              transition-all duration-300
              hover:scale-105 hover:bg-yellow-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]
              active:scale-95
            "
          >
            Contactar por WhatsApp
          </a>
        )}

      </div>

      {/* ================= RIGHT FORM ================= */}
      <div className="relative">

        {/* CARD GLASS */}
        <div className="
          backdrop-blur-xl
          bg-white/5
          border border-white/10
          rounded-3xl
          p-6 md:p-8
          shadow-2xl
        ">
          {formEnabled && (
            <ContactForm
              email={email}
            />
          )}
        </div>

      </div>

    </div>

    {/* ================= MAP FULL WIDTH ================= */}
    {showMap && address && (
      <div className="max-w-6xl mx-auto mt-16">
        <div className="w-full h-80 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
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
      </div>
    )}
  </section>
);
}