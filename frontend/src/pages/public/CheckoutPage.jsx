import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  if (!state?.service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Servicio no encontrado
      </div>
    );
  }

  const { name, price, description } = state.service;

  const formattedPrice = Number(price || 0).toLocaleString();

  const handlePayment = () => {
    if (!cardNumber || !cardName || !expiry || !cvv) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2500);
    }, 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-10 text-center shadow-2xl">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold mb-2">Pago aprobado</h2>
          <p className="text-gray-400">
            Tu reserva fue procesada correctamente
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8">

        {/* ================= RESUMEN ================= */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">

          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Volver
          </button>

          <h2 className="text-2xl font-bold">
            Resumen del servicio
          </h2>

          <div className="space-y-3">
            <p className="text-lg font-semibold">{name}</p>
            {description && (
              <p className="text-sm text-gray-400">{description}</p>
            )}
          </div>

          <div className="border-t border-gray-700 pt-4 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-yellow-400">${formattedPrice}</span>
          </div>

          <div className="text-xs text-gray-500">
            Pago 100% seguro • Conexión cifrada SSL
          </div>
        </div>

        {/* ================= FORMULARIO ================= */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">

          <h2 className="text-2xl font-bold">
            Información de pago
          </h2>

          {/* Tarjeta visual */}
          <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-400 text-black rounded-2xl p-6 shadow-xl h-40 flex flex-col justify-between">
            <div className="text-sm font-semibold">GargoBarb Pay</div>
            <div className="text-lg tracking-widest">
              {cardNumber || "•••• •••• •••• ••••"}
            </div>
            <div className="flex justify-between text-sm">
              <span>{cardName || "NOMBRE COMPLETO"}</span>
              <span>{expiry || "MM/YY"}</span>
            </div>
          </div>

          {/* Campos */}
          <div className="space-y-4">

            <input
              type="text"
              placeholder="Número de tarjeta"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none"
            />

            <input
              type="text"
              placeholder="Nombre del titular"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none"
              />

              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="bg-gray-900 border border-gray-700 p-3 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 outline-none"
              />
            </div>

          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-400 transition shadow-lg active:scale-95 disabled:opacity-60"
          >
            {loading ? "Procesando pago..." : `Pagar $${formattedPrice}`}
          </button>

        </div>

      </div>
    </div>
  );
}