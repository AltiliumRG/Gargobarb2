import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { updatePaymentConfig } from "../../../api/barber.api";
import { CreditCard, Save } from "lucide-react";

export default function PaymentSection({ barbershopId, initialMethod, initialData }) {
  const [saving, setSaving] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(initialMethod || "");
  
  // Data State
  const [nequiNumber, setNequiNumber] = useState(initialData?.nequi_number || "");
  const [accountHolderNequi, setAccountHolderNequi] = useState(initialData?.account_holder || "");

  const [bankName, setBankName] = useState(initialData?.bank_name || "");
  const [accountType, setAccountType] = useState(initialData?.account_type || "Ahorros");
  const [accountNumber, setAccountNumber] = useState(initialData?.account_number || "");
  const [accountHolderD, setAccountHolderD] = useState(initialData?.account_holder || "");
  const [cedula, setCedula] = useState(initialData?.cedula || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let dataToSave = {};

      if (paymentMethod === "nequi") {
        dataToSave = {
          nequi_number: nequiNumber,
          account_holder: accountHolderNequi
        };
      } else if (paymentMethod === "transfer") {
        dataToSave = {
          bank_name: bankName,
          account_type: accountType,
          account_number: accountNumber,
          account_holder: accountHolderD,
          cedula: cedula
        };
      }

      await updatePaymentConfig(barbershopId, {
        payment_method: paymentMethod || null,
        payment_data: Object.keys(dataToSave).length > 0 ? dataToSave : null
      });

      toast.success("Configuración de pagos guardada con éxito");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al guardar métodos de pago");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm">
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
            <CreditCard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Cuentas Receptoras de Pagos</h2>
            <p className="text-sm text-gray-500">
              Registra los datos a donde te llegará el dinero de las ventas por internet de tu tienda (Simulación actual).
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          
          <div className="p-5 bg-black/40 border border-white/5 rounded-2xl shadow-inner">
            <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2">
              Método de Recepción Preferido
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:border-yellow-500/50 appearance-none shadow-inner"
            >
              <option value="">-- No Recibir Pagos por ahora --</option>
              <option value="nequi">Recibir con Nequi (P2P)</option>
              <option value="transfer">Recibir por Transferencia Bancaria Directa</option>
            </select>
          </div>

          {/* NEQUI FORM */}
          {paymentMethod === "nequi" && (
            <div className="p-5 bg-purple-500/5 border border-purple-500/20 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
              <h3 className="text-purple-400 font-bold mb-4">Datos de Nequi Receptora</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-black mb-1">
                    Número Celular (Nequi)
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="Ej. 300 000 0000"
                    value={nequiNumber}
                    onChange={(e) => setNequiNumber(e.target.value)}
                    className="w-full p-4 rounded-xl bg-black/40 border border-purple-500/20 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-purple-500 transition shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-black mb-1">
                    Nombre del Titular
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Barber"
                    value={accountHolderNequi}
                    onChange={(e) => setAccountHolderNequi(e.target.value)}
                    className="w-full p-4 rounded-xl bg-black/40 border border-purple-500/20 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TRANSFERENCIA FORM */}
          {paymentMethod === "transfer" && (
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl animate-in fade-in zoom-in-95 duration-300 space-y-4">
              <h3 className="text-emerald-400 font-bold mb-2">Datos Bancarios para Transferencias</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-black mb-1">
                    Banco de la Barbería
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bancolombia"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-black mb-1">
                    Tipo de Cuenta
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-white focus:outline-none focus:border-emerald-500 transition shadow-inner appearance-none"
                  >
                    <option value="Ahorros">Ahorros</option>
                    <option value="Corriente">Corriente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 font-black mb-1">
                  Número de Cuenta
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 123-456789-00"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-white font-mono focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-black mb-1">
                    Nombre del Titular
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Mi Barbería SAS"
                    value={accountHolderD}
                    onChange={(e) => setAccountHolderD(e.target.value)}
                    className="w-full p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 font-black mb-1">
                    Cédula / NIT del Titular
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 900.123.456"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="w-full p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={saving}
              className="py-4 px-8 rounded-xl bg-yellow-500 text-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-yellow-400 hover:scale-105 transition active:scale-95 disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-yellow-500/20"
            >
              {saving ? (
                <>Verificando y Guardando...</>
              ) : (
                <>
                  <Save size={16} /> Guardar métodos de pago
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
