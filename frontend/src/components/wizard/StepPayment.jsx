import { useState } from "react";
import { useWizard } from "../../context/WizardContext";

const PAYMENT_METHODS = [
  {
    id: "nequi",
    label: "Nequi",
    emoji: "📱",
    desc: "Recibe pagos directamente a tu número Nequi",
    color: "#7c3aed",
    fields: [
      { key: "nequi_number", label: "Número Nequi", placeholder: "Ej. 3001234567", type: "tel" },
      { key: "account_holder", label: "Nombre del Titular", placeholder: "Nombre completo", type: "text" },
    ],
  },
  {
    id: "transfer",
    label: "Transferencia Bancaria",
    emoji: "🏦",
    desc: "El cliente transfiere directo a tu cuenta",
    color: "#059669",
    fields: [
      { key: "bank_name", label: "Banco", type: "select", options: ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Itaú", "Banco Popular", "Caja Social", "Scotiabank Colpatria", "Banco de Occidente", "Banco AV Villas"] },
      { key: "account_type", label: "Tipo de Cuenta", type: "select", options: ["Ahorros", "Corriente"] },
      { key: "account_number", label: "Número de Cuenta", placeholder: "Ej. 12345678901", type: "tel" },
      { key: "account_holder", label: "Titular de la Cuenta", placeholder: "Nombre completo", type: "text" },
      { key: "cedula", label: "Cédula del Titular", placeholder: "Número de documento", type: "tel" },
    ],
  },
  {
    id: "card",
    label: "Tarjeta Débito/Crédito",
    emoji: "💳",
    desc: "Datos de tu cuenta para recibir pagos con tarjeta",
    color: "#3b82f6",
    fields: [
      { key: "bank_name", label: "Banco Receptor", type: "select", options: ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Itaú", "Banco Popular", "Caja Social", "Scotiabank Colpatria", "Banco de Occidente", "Banco AV Villas"] },
      { key: "account_holder", label: "Titular de la Cuenta", placeholder: "Nombre completo", type: "text" },
      { key: "account_number", label: "Número de Cuenta", placeholder: "Número de cuenta bancaria", type: "tel" },
      { key: "account_type", label: "Tipo de Cuenta", type: "select", options: ["Ahorros", "Corriente"] },
    ],
  },
  {
    id: "efectivo",
    label: "Efectivo en Local",
    emoji: "💵",
    desc: "Los clientes pagan en persona en tu barbería",
    color: "#d97706",
    fields: [],
  },
];

export default function StepPayment() {
  const { data, updateData } = useWizard();
  const [selectedMethod, setSelectedMethod] = useState(data.paymentMethod || null);
  const [formData, setFormData] = useState(data.paymentData || {});

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
    setFormData({});
    updateData({ paymentMethod: methodId, paymentData: {} });
  };

  const handleFieldChange = (key, value) => {
    let validatedValue = value;
    
    // Validación lógica: solo números para cuentas, cédulas y Nequi
    if (key === "cedula" || key === "account_number" || key === "nequi_number") {
      validatedValue = value.replace(/\D/g, "");
    } 
    // Validación lógica: solo letras y espacios para nombres
    else if (key === "account_holder") {
      validatedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    }

    const updated = { ...formData, [key]: validatedValue };
    setFormData(updated);
    updateData({ paymentData: updated });
  };

  const selectedConfig = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-xl">
          💳
        </div>
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Configuración de Pagos
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Elige cómo recibirás los pagos del carrito de tus clientes
          </p>
        </div>
      </div>

      {/* Method Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => handleMethodSelect(method.id)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 flex items-start gap-4 ${
                isSelected
                  ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_24px_rgba(250,204,21,0.12)]"
                  : "border-gray-800 bg-black/20 hover:border-gray-700 hover:bg-gray-900"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all ${
                  isSelected ? "bg-yellow-500/20 scale-110" : "bg-white/5"
                }`}
              >
                {method.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-bold text-sm ${
                      isSelected ? "text-yellow-400" : "text-white"
                    }`}
                  >
                    {method.label}
                  </span>
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{method.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Fields */}
      {selectedMethod && selectedConfig && (
        <div
          key={selectedMethod}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{selectedConfig.emoji}</span>
              <div>
                <h3 className="font-black text-white text-sm uppercase tracking-widest">
                  {selectedConfig.label}
                </h3>
                {selectedConfig.fields.length > 0 ? (
                  <p className="text-xs text-gray-400 mt-0.5">
                    El cliente verá estos datos al momento de pagar
                  </p>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">
                    No se requieren datos adicionales para pago en efectivo
                  </p>
                )}
              </div>
            </div>

            {selectedConfig.fields.length === 0 ? (
              <div className="flex items-start gap-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <span className="text-2xl mt-0.5">💵</span>
                <div>
                  <p className="text-sm font-bold text-yellow-300 mb-1">
                    Pago en Efectivo Habilitado
                  </p>
                  <p className="text-xs text-yellow-400/70 leading-relaxed">
                    Tus clientes verán las instrucciones para acercarse a tu local con el monto
                    total a pagar. Tú confirmas el pedido al recibirles.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedConfig.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        value={formData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition text-sm appearance-none"
                      >
                        <option value="" disabled>Selecciona una opción</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt} className="bg-gray-900 text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        value={formData[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/10 transition text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hint when nothing selected */}
      {!selectedMethod && (
        <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <span className="text-lg mt-0.5">💡</span>
          <p className="text-sm text-blue-300 leading-relaxed">
            Selecciona un método de pago para continuar. Esto controla cómo verán la pasarela
            de pago tus clientes cuando compren productos de tu carrito.
          </p>
        </div>
      )}
    </div>
  );
}
