import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createOrder } from "../../api/orders.api";
import { Loader2 } from "lucide-react";

/* ============================================================
   CHECKOUT PAGE  — Pasarela de pago del carrito
   Recibe por location.state:
     items         → array de productos del carrito
     total         → monto total (número)
     siteId        → ID del sitio de la barbería
     paymentConfig → { method: 'nequi'|'card'|'transfer'|'efectivo', data: {...} }
============================================================ */

const METHOD_LABELS = {
  nequi:    { label: "Nequi",                  emoji: "📱", color: "#7c3aed" },
  transfer: { label: "Transferencia Bancaria",  emoji: "🏦", color: "#059669" },
  card:     { label: "Tarjeta Débito/Crédito",  emoji: "💳", color: "#3b82f6" },
  efectivo: { label: "Pago en Efectivo",        emoji: "💵", color: "#d97706" },
};

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate  = useNavigate();

  /* ── state de formulario ── */
  const [clientName,  setClientName]  = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [reference,   setReference]   = useState("");   // para transferencia
  const [cardNumber,  setCardNumber]  = useState("");
  const [cardHolder,  setCardHolder]  = useState("");
  const [expiry,      setExpiry]      = useState("");
  const [cvv,         setCvv]         = useState("");

  const [pseBank, setPseBank] = useState("");
  const [pseDocType, setPseDocType] = useState("CC");
  const [pseDocNumber, setPseDocNumber] = useState("");
  const [buyerNequi, setBuyerNequi] = useState("");

  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(null);   // { ref, total }
  const [error,    setError]    = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  /* ── datos del state ── */
  const items         = state?.items         || [];
  const total         = state?.total         || 0;
  const siteId        = state?.siteId        || null;
  const siteSlug      = state?.siteSlug      || null;
  const paymentConfig = state?.paymentConfig || {};
  const pData         = paymentConfig.data   || {};
  const [selectedMethod, setSelectedMethod] = useState(paymentConfig.method || "nequi");

  const formatPrice = (n) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency", currency: "COP", maximumFractionDigits: 0,
    }).format(n) + " COP";

  /* ── guard ── */
  if (!items.length || !siteId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060a10] text-white">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-black mb-2">Carrito vacío</h2>
          <p className="text-gray-400 mb-6">No hay productos para pagar.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  /* ── submit ── */
  const handlePay = async () => {
    // 1. Limpieza de datos básicos
    const name = clientName.trim();
    const phone = clientPhone.replace(/\D/g, ""); // Extrae solo números
    const email = clientEmail.trim();

    // 2. Seguridad y validación de Datos de Contacto
    if (!name || name.length < 3 || name.length > 50) {
      setError("Por favor ingresa un nombre válido (entre 3 y 50 caracteres).");
      return;
    }
    if (phone.length < 7 || phone.length > 15) {
      setError("Por favor ingresa un número de teléfono válido (solo números, entre 7 y 15 dígitos).");
      return;
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("El formato del correo electrónico es inválido.");
        return;
      }
    }

    // 3. Validaciones de Seguridad por Método de Pago
    if (selectedMethod === "card") {
      if (cardNumber.length < 15 || !cardHolder || !expiry || !cvv) {
        setError("Por favor completa los datos de la tarjeta correctamente para proceder. (Simulación)");
        return;
      }
    } else if (selectedMethod === "nequi") {
      if (buyerNequi.length < 10) {
        setError("Ingresa un número de celular de Nequi válido (mínimo 10 dígitos).");
        return;
      }
    } else if (selectedMethod === "transfer") {
      if (!pseBank || pseDocNumber.length < 5) {
        setError("Por favor selecciona tu banco e ingresa tu número de documento para PSE.");
        return;
      }
    }

    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      setError("Por favor ingresa una dirección de envío válida para entregar tu producto.");
      return;
    }

    setError("");
    setShowConfirm(true);
  };

  const executePay = async () => {
    setShowConfirm(false);
    setLoading(true);

    try {
      const payload = {
        site_id:        siteId,
        client_name:    clientName.trim(),
        client_email:   clientEmail.trim() || null,
        client_phone:   clientPhone.replace(/\D/g, ""),
        shipping_address: shippingAddress.trim(),
        items,
        total,
        payment_method: selectedMethod || "efectivo",
        notes: (selectedMethod === "card") ? "Simulacion - Tarjeta" :
               (selectedMethod === "nequi") ? `Simulacion Nequi: ${buyerNequi}` :
               (selectedMethod === "transfer") ? `Simulacion PSE: ${pseBank} - ${pseDocType} ${pseDocNumber}` : "Pago en Efectivo",
      };

      const res = await createOrder(payload);

      if (res.data?.ok) {
        const mockRef = (selectedMethod === "card") ? `CARD-${Math.floor(Math.random()*1000000)}` :
                        (selectedMethod === "transfer") ? `PSE-${Math.floor(Math.random()*100000000)}` :
                        (selectedMethod === "nequi") ? `NEQ-${Math.floor(Math.random()*100000000)}` : `ORD-${Math.floor(Math.random()*100000)}`;
        setSuccess({
          ref:   res.data.order?.transaction_ref || mockRef,
          total: res.data.order?.total || total,
        });
      } else {
        setError("No se pudo procesar el pedido. Intenta de nuevo.");
      }
    } catch (err) {
      console.error("❌ Checkout error:", err);
      setError(err.response?.data?.message || "Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  /* ── PANTALLA DE ÉXITO ── */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060a10] text-white p-6">
        <div className="w-full max-w-md text-center animate-in fade-in zoom-in duration-500">
          {/* Glow */}
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)]">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-black mb-3 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-300">
            ¡Pedido Registrado!
          </h1>
          <p className="text-gray-400 mb-6 text-lg">
            Tu compra ha sido procesada correctamente.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 space-y-3 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Referencia</span>
              <span className="font-black text-yellow-400 font-mono text-xs">{success.ref}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total pagado</span>
              <span className="font-black text-white">{formatPrice(success.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Método</span>
              <span className="font-bold text-white">
                {METHOD_LABELS[selectedMethod]?.emoji} {METHOD_LABELS[selectedMethod]?.label || selectedMethod}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            Guarda tu referencia de transacción. La barbería la usará para confirmar tu pedido.
          </p>

          <button
            onClick={() => {
              if (siteSlug) navigate(`/b/${siteSlug}`);
              else navigate(-1);
            }}
            className="w-full py-4 rounded-2xl bg-yellow-500 text-black font-black hover:bg-yellow-400 transition shadow-lg hover:shadow-yellow-500/30"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const methodInfo = METHOD_LABELS[selectedMethod] || { label: "Pago", emoji: "💰", color: "#facc15" };

  return (
    <div className="min-h-screen bg-[#060a10] text-white" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition text-gray-400 hover:text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-sm font-black text-white">Finalizar Compra</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Checkout seguro</p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Pago Seguro
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8">

        {/* ═══════════════════════════════════════
            COLUMNA IZQUIERDA — Resumen del pedido
        ═══════════════════════════════════════ */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-gray-500 font-black mb-4">
              Resumen del Pedido ({items.length} {items.length === 1 ? "producto" : "productos"})
            </h2>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/30 flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xl">🧴</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-white truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Cant: {item.quantity || 1}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-yellow-400 text-sm">
                      {formatPrice(item.price * (item.quantity || 1))}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[10px] text-gray-600">{formatPrice(item.price)} c/u</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 border border-yellow-500/20 rounded-2xl p-5 flex items-center justify-between">
            <span className="text-gray-300 font-bold uppercase tracking-widest text-xs">Total a Pagar</span>
            <span className="text-3xl font-black text-yellow-400">{formatPrice(total)}</span>
          </div>

          {/* Payment method badge */}
          {selectedMethod && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500"
              style={{ borderColor: methodInfo.color + "40", backgroundColor: methodInfo.color + "10" }}>
              <span className="text-2xl">{methodInfo.emoji}</span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: methodInfo.color }}>
                  Método Seleccionado
                </p>
                <p className="text-sm font-bold text-white">{methodInfo.label}</p>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════
            COLUMNA DERECHA — Pasarela
        ═══════════════════════════════════════ */}
        <div className="space-y-5">

          {/* ── SELECTOR DE MÉTODO DE PAGO ── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-black">
                Elige tu Método de Pago
              </h3>
              <span className="text-green-400 text-xs flex items-center gap-1 font-bold">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Seguro
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(METHOD_LABELS).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedMethod(k)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                    selectedMethod === k
                      ? "bg-white/10 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)] scale-100"
                      : "bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5 scale-[0.98]"
                  }`}
                  style={selectedMethod === k ? { borderColor: v.color } : {}}
                >
                  <span className="text-3xl mb-2 hover:scale-110 transition-transform duration-300">{v.emoji}</span>
                  <span className={`text-xs font-bold text-center ${selectedMethod === k ? "text-white" : "text-gray-400"}`}>
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── NEQUI (GATEWAY REAL) ── */}
          {selectedMethod === "nequi" && (
            <div className="bg-purple-500/10 border border-purple-500/25 rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📱</span>
                <div>
                  <p className="font-black text-purple-300">Pago con Nequi</p>
                  <p className="text-[10px] text-purple-400/60 uppercase tracking-widest flex items-center gap-1">
                     Pasarela Integrada Segura ✓
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5 flex justify-between">
                  <span>Tu Celular con Nequi</span>
                  <span className="text-purple-400">🔒</span>
                </label>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-xl overflow-hidden focus-within:border-purple-500/50 transition shadow-inner">
                  <span className="pl-4 pr-2 text-gray-500 font-black">+57</span>
                  <input
                    type="tel" placeholder="300 000 0000"
                    autoComplete="off"
                    value={buyerNequi} onChange={(e) => setBuyerNequi(e.target.value.replace(/\D/g, '').substring(0,10))}
                    className="w-full p-3 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-lg tracking-widest"
                  />
                </div>
              </div>
              <p className="text-[11px] text-purple-300/80 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 leading-relaxed">
                <span className="font-black">¿Cómo funciona?</span> Ingresa tu número. Al confirmar, "simularemos" enviar una solicitud de cobro a tu celular para que apruebes el pago automáticamente en tu App Nequi.
              </p>
            </div>
          )}

          {/* ── TRANSFERENCIA PSE (GATEWAY REAL) ── */}
          {selectedMethod === "transfer" && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏦</span>
                  <div>
                    <p className="font-black text-emerald-300">Pagos Seguros en Línea (PSE)</p>
                    <p className="text-[10px] text-emerald-400/60 uppercase tracking-widest flex items-center gap-1">
                      Pasarela Oficial PSE ✓
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                    Selecciona tu Banco
                  </label>
                  <select
                    value={pseBank}
                    onChange={(e) => setPseBank(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition text-sm appearance-none cursor-pointer hover:bg-white/5 shadow-inner"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                  >
                    <option value="" disabled>Selecciona una opción...</option>
                    <option value="Bancolombia">Bancolombia</option>
                    <option value="Nequi">Nequi</option>
                    <option value="Davivienda">Davivienda / DaviPlata</option>
                    <option value="Banco de Bogota">Banco de Bogotá</option>
                    <option value="BBVA Colombia">BBVA Colombia</option>
                    <option value="Banco Falabella">Banco Falabella</option>
                    <option value="Nu">NuBank (Nu)</option>
                    <option value="Lulo Bank">Lulo Bank</option>
                    <option value="RappiPay">RappiPay</option>
                    <option value="Banco de Occidente">Banco de Occidente</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                      Tipo ID
                    </label>
                    <select
                      value={pseDocType}
                      onChange={(e) => setPseDocType(e.target.value)}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 transition text-sm appearance-none cursor-pointer shadow-inner"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem top 50%', backgroundSize: '0.5rem auto' }}
                    >
                      <option value="CC">CC</option>
                      <option value="CE">CE</option>
                      <option value="NIT">NIT</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                      Número Documento
                    </label>
                    <input
                      type="tel" placeholder="Ej. 1000123456"
                      autoComplete="off"
                      value={pseDocNumber} onChange={(e) => setPseDocNumber(e.target.value.replace(/\D/g, '').substring(0,12))}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition text-sm shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-300/80 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 leading-relaxed">
                Al continuar, <strong className="text-emerald-400">simularemos</strong> redirigirte a la sucursal virtual de tu banco para procesar el débito a través de la red segura ACH.
              </p>
            </div>
          )}

          {/* ── TARJETA SIMULADA (UI REALISTA) ── */}
          {selectedMethod === "card" && (
            <div className="bg-blue-500/10 border border-blue-500/25 rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💳</span>
                <div>
                  <p className="font-black text-blue-300">Pago con Tarjeta</p>
                  <p className="text-[10px] text-blue-400/60 uppercase tracking-widest">Pasarela Segura (Simulación)</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5 flex justify-between">
                    <span>Número de Tarjeta</span>
                    <span className="text-blue-400">🔒</span>
                  </label>
                  <input
                    type="tel" placeholder="0000 0000 0000 0000"
                    autoComplete="off"
                    value={cardNumber} onChange={(e) => {
                      // Eliminar todo lo que NO sea dígito
                      const val = e.target.value.replace(/\D/g, '').substring(0,16);
                      // Agrupar de a 4 sin dejar espacios errantes
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardNumber(formatted);
                    }}
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition font-mono text-sm tracking-widest"
                    maxLength={19}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                    Titular de la Tarjeta
                  </label>
                  <input
                    type="text" placeholder="Ej. Juan Pérez"
                    autoComplete="off"
                    value={cardHolder} onChange={(e) => setCardHolder(e.target.value)}
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                      Vencimiento
                    </label>
                    <input
                      type="tel" placeholder="MM/YY"
                      autoComplete="off"
                      value={expiry} onChange={(e) => {
                        const val = e.target.value.replace(/\\D/g, '').substring(0,4);
                        if (val.length >= 3) {
                          setExpiry(val.substring(0,2) + '/' + val.substring(2,4));
                        } else {
                          setExpiry(val);
                        }
                      }}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition font-mono text-sm"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5 flex justify-between">
                      <span>CVV</span>
                      <span className="text-gray-600 cursor-help" title="Código reverso">ℹ️</span>
                    </label>
                    <input
                      type="password" placeholder="•••"
                      value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\\D/g, '').substring(0,4))}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition font-mono text-lg tracking-widest"
                      maxLength={4}
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── EFECTIVO / CONTRA ENTREGA ── */}
          {selectedMethod === "efectivo" && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-6 space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💵</span>
                <div>
                  <p className="font-black text-amber-300">Pago Contra Entrega</p>
                  <p className="text-xs text-amber-400/60">Paga al recibir / en caja</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                Al confirmar tu pedido, prepararemos tus productos para que puedas pagar{" "}
                <span className="font-black text-yellow-400">{formatPrice(total)}</span> en efectivo al momento de recibir la orden o en nuestro local. 
              </p>
            </div>
          )}

          {/* ── DATOS DEL CLIENTE ── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-black">
              Tus Datos de Contacto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                  Nombre Completo *
                </label>
                <input
                  type="text" placeholder="Ej. Juan Pérez"
                  value={clientName} onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/30 transition text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                  Teléfono *
                </label>
                <input
                  type="tel" placeholder="Ej. 3001234567"
                  value={clientPhone} onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                Correo Electrónico (opcional)
              </label>
              <input
                type="email" placeholder="Ej. juan@correo.com"
                value={clientEmail} onChange={(e) => setClientEmail(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5 flex items-center gap-1">
                Dirección de Destino <span className="text-yellow-500">🚚</span> *
              </label>
              <input
                type="text" placeholder="Ej. Cl 10 # 50-20, Medellín"
                value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full p-3 rounded-xl bg-gradient-to-r from-black/20 to-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500/50 transition text-sm shadow-inner"
              />
            </div>


          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-in fade-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* CTA PAGAR */}
          <button
            id="btn-proceder-pago"
            onClick={handlePay}
            disabled={loading || !selectedMethod}
            className={`w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
              loading ? "bg-gray-700 text-gray-400" : "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-yellow-500/20"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Validando y procesando transacción segura (Simulando)...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Confirmar Pedido — {formatPrice(total)}
              </>
            )}
          </button>

          <p className="text-center text-[10px] text-gray-600">
            🔒 Tu pedido queda registrado en el sistema de la barbería
          </p>
        </div>
      </div>

      {/* ── MODAL CONFIRMACIÓN ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1220] border border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl zoom-in-95 animate-in duration-200">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-center text-white mb-2">¿Confirmar Compra?</h3>
            <p className="text-sm text-gray-400 text-center mb-6 leading-relaxed">
              Estás a punto de confirmar tu pedido en GargoBarb por un valor de <span className="text-yellow-400 font-bold">{formatPrice(total)}</span>. ¿Deseas proceder?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition"
              >
                Cancelar
              </button>
              <button
                onClick={executePay}
                className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black transition shadow-lg shadow-yellow-500/20"
              >
                Sí, Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

