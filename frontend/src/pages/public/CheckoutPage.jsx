import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createOrder } from "../../api/orders.api";

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
  const [reference,   setReference]   = useState("");   // para transferencia
  const [cardNumber,  setCardNumber]  = useState("");
  const [cardHolder,  setCardHolder]  = useState("");
  const [expiry,      setExpiry]      = useState("");
  const [cvv,         setCvv]         = useState("");

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
  const method        = paymentConfig.method || null;
  const pData         = paymentConfig.data   || {};

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
    if (method === "card" || method === "nequi" || method === "transfer") {
      if (!reference.trim() || reference.trim().length < 4) {
        setError("Por seguridad, debes ingresar el número de comprobante o referencia de la transacción.");
        return;
      }
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
        items,
        total,
        payment_method: method || "efectivo",
        notes: reference.trim() || null,
      };

      const res = await createOrder(payload);

      if (res.data?.ok) {
        setSuccess({
          ref:   res.data.order?.transaction_ref,
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
                {METHOD_LABELS[method]?.emoji} {METHOD_LABELS[method]?.label || method}
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

  const methodInfo = METHOD_LABELS[method] || { label: "Pago", emoji: "💰", color: "#facc15" };

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
          {method && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ borderColor: methodInfo.color + "40", backgroundColor: methodInfo.color + "10" }}>
              <span className="text-2xl">{methodInfo.emoji}</span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: methodInfo.color }}>
                  Método de Pago
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

          {/* ── NEQUI ── */}
          {method === "nequi" && (
            <div className="bg-purple-500/10 border border-purple-500/25 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📱</span>
                <div>
                  <p className="font-black text-purple-300">Paga con Nequi</p>
                  <p className="text-xs text-purple-400/60">Transfiere al número de abajo y confirma tu pedido</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 space-y-2">
                {pData.nequi_number && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Número Nequi</span>
                    <span className="font-black text-white text-lg tracking-widest">{pData.nequi_number}</span>
                  </div>
                )}
                {pData.account_holder && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Titular</span>
                    <span className="font-bold text-white">{pData.account_holder}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-2">
                  <span className="text-xs text-gray-500">Monto a transferir</span>
                  <span className="font-black text-yellow-400">{formatPrice(total)}</span>
                </div>
              </div>
              <p className="text-xs text-purple-300/60">
                ⚠️ Después de transferir, ingresa el número de comprobante en el campo de referencia.
              </p>
            </div>
          )}

          {/* ── TRANSFERENCIA ── */}
          {method === "transfer" && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🏦</span>
                <p className="font-black text-emerald-300">Datos Bancarios</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Banco",   pData.bank_name],
                  ["Tipo",    pData.account_type],
                  ["Cuenta",  pData.account_number],
                  ["Titular", pData.account_holder],
                  ["Cédula",  pData.cedula],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} className="bg-black/30 rounded-xl p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{k}</p>
                    <p className="font-bold text-white text-sm">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center bg-black/30 rounded-xl p-3">
                <span className="text-xs text-gray-500">Valor a transferir</span>
                <span className="font-black text-yellow-400">{formatPrice(total)}</span>
              </div>
            </div>
          )}

          {/* ── TARJETA (DATOS DEL BARBERO) ── */}
          {method === "card" && (
            <div className="bg-blue-500/10 border border-blue-500/25 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">💳</span>
                <div>
                  <p className="font-black text-blue-300">Pago con Tarjeta</p>
                  <p className="text-xs text-blue-400/60">Transfiere a la cuenta asociada</p>
                </div>
              </div>
              
              {/* Visual card of the Barber */}
              <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 text-white rounded-2xl p-6 h-44 flex flex-col justify-between shadow-[0_20px_50px_rgba(59,130,246,0.3)] overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
                <div className="relative">
                  <p className="text-xs font-black uppercase tracking-widest opacity-80">{pData.bank_name || "Banco"}</p>
                </div>
                <div className="relative">
                  <p className="text-lg tracking-[0.25em] font-mono font-bold">
                    {pData.account_number ? pData.account_number.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                  </p>
                </div>
                <div className="relative flex justify-between text-sm font-bold">
                  <span>{pData.account_holder || "NOMBRE DEL TITULAR"}</span>
                  <span className="text-xs opacity-80 uppercase">{pData.account_type || "CUENTA"}</span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-black/30 rounded-xl p-3 border border-white/5 mt-4">
                <span className="text-xs text-gray-400">Total a pagar</span>
                <span className="font-black text-yellow-400 text-lg">{formatPrice(total)}</span>
              </div>
              <p className="text-[11px] text-blue-300/70 text-center">
                ⚠️ Realiza la transferencia a la cuenta señalada arriba y escribe el número de comprobante abajo.
              </p>
            </div>
          )}

          {/* ── EFECTIVO ── */}
          {method === "efectivo" && (
            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💵</span>
                <div>
                  <p className="font-black text-amber-300">Pago en Efectivo</p>
                  <p className="text-xs text-amber-400/60">Acércate al local para pagar</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Registra tu pedido ahora y preséntate en la barbería con el total de{" "}
                <span className="font-black text-yellow-400">{formatPrice(total)}</span> en efectivo.
                Ellos confirmarán tu orden al recibirte.
              </p>
            </div>
          )}

          {/* ── SIN MÉTODO (barbero no configuró) ── */}
          {!method && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-center text-gray-400">
                El barbero aún no ha configurado un método de pago.
              </p>
            </div>
          )}

          {/* ── DATOS DEL CLIENTE ── */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-black">
              Tus Datos de Contacto
            </h3>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                Nombre Completo *
              </label>
              <input
                type="text" placeholder="Ej. Juan Pérez"
                value={clientName} onChange={(e) => setClientName(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition text-sm"
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

            {/* Campo de referencia solo para métodos digitales */}
            {(method === "nequi" || method === "transfer" || method === "card") && (
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1.5">
                  Número de Comprobante / Referencia *
                </label>
                <input
                  type="text" placeholder="Ej. 1234567890"
                  value={reference} onChange={(e) => setReference(e.target.value)}
                  className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition text-sm"
                />
              </div>
            )}
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
            disabled={loading || !method}
            className="w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            style={{
              background: loading ? "#555" : "linear-gradient(135deg, #facc15, #f59e0b)",
              color: "#000",
              boxShadow: loading ? "none" : "0 10px 40px rgba(250,204,21,0.35)",
            }}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Procesando pedido...
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