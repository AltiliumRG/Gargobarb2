import os
import re

path = r"c:\Users\USUARIO\Downloads\Gargobarb2-avanzado\Gargobarb2-avanzado\frontend\src\pages\public\CheckoutPage.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. States
state_old = '''  const [cvv,         setCvv]         = useState("");

  const [loading,  setLoading]  = useState(false);'''
state_new = '''  const [cvv,         setCvv]         = useState("");

  const [pseBank, setPseBank] = useState("");
  const [pseDocType, setPseDocType] = useState("CC");
  const [pseDocNumber, setPseDocNumber] = useState("");
  const [buyerNequi, setBuyerNequi] = useState("");

  const [loading,  setLoading]  = useState(false);'''
content = content.replace(state_old, state_new)

# 2. Validations
val_old = '''    if (selectedMethod === "card") {
      if (cardNumber.length < 15 || !cardHolder || !expiry || !cvv) {
        setError("Por favor completa los datos de la tarjeta correctamente para proceder. (Simulación)");
        return;
      }
    } else if (selectedMethod === "nequi" || selectedMethod === "transfer") {
      if (!reference.trim() || reference.trim().length < 4) {
        setError("Por seguridad, debes ingresar el número de comprobante o referencia de la transacción.");
        return;
      }
    }'''
val_new = '''    if (selectedMethod === "card") {
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
    }'''
content = content.replace(val_old, val_new)

# 3. Payload
payload_old = '''        payment_method: selectedMethod || "efectivo",
        notes: (selectedMethod === "card") ? "Simulación: Pago con Tarjeta" : 
               (selectedMethod === "transfer") ? `Simulación PSE - Banco: ${pseBank} | Doc: ${pseDocType} ${pseDocNumber}` : 
               (selectedMethod === "nequi") ? `Simulación Nequi - Celular: ${buyerNequi}` : "Pago en Efectivo",'''
payload_new = '''        payment_method: selectedMethod || "efectivo",
        notes: (selectedMethod === "card") ? "Simulacion - Tarjeta" :
               (selectedMethod === "nequi") ? `Simulacion Nequi: ${buyerNequi}` :
               (selectedMethod === "transfer") ? `Simulacion PSE: ${pseBank} - ${pseDocType} ${pseDocNumber}` : "Pago en Efectivo",'''
# Also handle if it's currently the old old version
payload_fallback = '''        payment_method: selectedMethod || "efectivo",
        notes: (selectedMethod === "card") ? "Simulated Card Payment" : reference.trim() || null,'''
content = content.replace(payload_old, payload_new).replace(payload_fallback, payload_new)

# 4. Success state
exec_old = '''        setSuccess({
          ref:   res.data.order?.transaction_ref,
          total: res.data.order?.total || total,
        });'''
exec_new = '''        const mockRef = (selectedMethod === "card") ? `CARD-${Math.floor(Math.random()*1000000)}` :
                        (selectedMethod === "transfer") ? `PSE-${Math.floor(Math.random()*100000000)}` :
                        (selectedMethod === "nequi") ? `NEQ-${Math.floor(Math.random()*100000000)}` : `ORD-${Math.floor(Math.random()*100000)}`;
        setSuccess({
          ref:   res.data.order?.transaction_ref || mockRef,
          total: res.data.order?.total || total,
        });'''
content = content.replace(exec_old, exec_new)

# 5. Remove manual reference input
ref_old = '''            {/* Campo de referencia para Nequi o Transferencia */}
            {(selectedMethod === "nequi" || selectedMethod === "transfer") && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[10px] uppercase tracking-widest text-purple-400 font-black mb-1.5">
                  Número de Comprobante / Referencia de Pago *
                </label>
                <input
                  type="text" placeholder="Ej. 1234567890 o Referencia del banco"
                  value={reference} onChange={(e) => setReference(e.target.value)}
                  className="w-full p-3 rounded-xl bg-purple-500/5 border border-purple-500/30 text-white placeholder-purple-300/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition text-sm"
                />
              </div>
            )}'''
content = content.replace(ref_old, "")

# 6. Replace Nequi and Transfer Blocks dynamically with regex
content = re.sub(
    r'\{/\* ── NEQUI \(REALISTA\) ── \*/\}.*?\{/\* ── TRANSFERENCIA \(REALISTA\) ── \*/\}',
    '''{/* ── NEQUI (GATEWAY REAL) ── */}
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
                    value={buyerNequi} onChange={(e) => setBuyerNequi(e.target.value.replace(/\\D/g, '').substring(0,10))}
                    className="w-full p-3 bg-transparent text-white placeholder-gray-600 focus:outline-none font-mono text-lg tracking-widest"
                  />
                </div>
              </div>
              <p className="text-[11px] text-purple-300/80 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 leading-relaxed">
                <span className="font-black">¿Cómo funciona?</span> Ingresa tu número. Al confirmar, "simularemos" enviar una solicitud de cobro a tu celular para que apruebes el pago automáticamente en tu App Nequi.
              </p>
            </div>
          )}

          {/* ── TRANSFERENCIA (REALISTA) ── */}''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'\{/\* ── TRANSFERENCIA \(REALISTA\) ── \*/\}.*?\{/\* ── TARJETA SIMULADA \(UI REALISTA\) ── \*/\}',
    '''{/* ── TRANSFERENCIA PSE (GATEWAY REAL) ── */}
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
                    className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition text-sm appearance-none cursor-pointer hover:bg-black/60 shadow-inner"
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
                      value={pseDocNumber} onChange={(e) => setPseDocNumber(e.target.value.replace(/\\D/g, '').substring(0,12))}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition text-sm shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-emerald-300/80 bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/10 leading-relaxed">
                Al continuar, <strong className="text-emerald-400">simularemos</strong> redirigirte a la sucursal virtual de tu banco para procesar el débito a través de la red segura.
              </p>
            </div>
          )}

          {/* ── TARJETA SIMULADA (UI REALISTA) ── */}''',
    content,
    flags=re.DOTALL
)

# Fix executePay UI wording if needed
content = content.replace(
    '''Procesando pedido...''',
    '''Validando y procesando transacción segura (Simulando)...'''
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
