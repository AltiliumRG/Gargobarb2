import re

path = r"c:\Users\USUARIO\Downloads\Gargobarb2-avanzado\Gargobarb2-avanzado\frontend\src\pages\public\CheckoutPage.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix Card Number Regex
content = content.replace(
    '''                  <input
                    type="text" placeholder="0000 0000 0000 0000"
                    value={cardNumber} onChange={(e) => {
                      // Formatting as card number blocks
                      const val = e.target.value.replace(/\\D/g, '').substring(0,16);
                      const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                      setCardNumber(formatted);
                    }}''',
    '''                  <input
                    type="tel" placeholder="0000 0000 0000 0000"
                    autoComplete="off"
                    value={cardNumber} onChange={(e) => {
                      const val = e.target.value.replace(/\\D/g, '').substring(0,16);
                      const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                      setCardNumber(formatted);
                    }}'''
)

# Fix Card Holder auto complete
content = content.replace(
    '''                  <input
                    type="text" placeholder="Ej. Juan Pérez"
                    value={cardHolder} onChange={(e) => setCardHolder(e.target.value)}''',
    '''                  <input
                    type="text" placeholder="Ej. Juan Pérez"
                    autoComplete="off"
                    value={cardHolder} onChange={(e) => setCardHolder(e.target.value)}'''
)

# Fix Expiry auto complete and type
content = content.replace(
    '''                  <input
                      type="text" placeholder="MM/YY"
                      value={expiry} onChange={(e) => {''',
    '''                  <input
                      type="tel" placeholder="MM/YY"
                      autoComplete="off"
                      value={expiry} onChange={(e) => {'''
)

# Fix CVV auto-complete
content = content.replace(
    '''                  <input
                      type="password" placeholder="•••"
                      value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\\D/g, '').substring(0,4))}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition font-mono text-lg tracking-widest"
                      maxLength={4}
                      autoComplete="off"
                    />''',
    '''                  <input
                      type="tel" placeholder="•••"
                      value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\\D/g, '').substring(0,4))}
                      className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition font-mono text-lg tracking-widest"
                      maxLength={4}
                      autoComplete="new-password"
                    />'''
)

# Fix Nequi
nequi_old = '''          {/* ── NEQUI ── */}
          {selectedMethod === "nequi" && (
            <div className="bg-purple-500/10 border border-purple-500/25 rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📱</span>
                <div>
                  <p className="font-black text-purple-300">Paga con Nequi</p>
                  <p className="text-xs text-purple-400/60">Transfiere al número de abajo y confirma tu pedido</p>
                </div>
              </div>
              <div className="bg-black/30 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Número Nequi</span>
                  <span className="font-black text-white text-lg tracking-widest">{pData.nequi_number || "300 000 0000"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Titular</span>
                  <span className="font-bold text-white uppercase">{pData.account_holder || siteSlug || "Barbería Principal"}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-2 mt-2">
                  <span className="text-xs text-gray-500">Monto a transferir</span>
                  <span className="font-black text-yellow-400">{formatPrice(total)}</span>
                </div>
              </div>
              <p className="text-xs text-purple-300/60">
                ⚠️ Después de transferir, ingresa el número de comprobante abajo.
              </p>
            </div>
          )}'''

nequi_new = '''          {/* ── NEQUI (REALISTA) ── */}
          {selectedMethod === "nequi" && (
            <div className="bg-purple-500/10 border border-purple-500/25 rounded-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📱</span>
                <div>
                  <p className="font-black text-purple-300">Pago con Nequi</p>
                  <p className="text-[10px] text-purple-400/60 uppercase tracking-widest flex items-center gap-1">
                     Pasarela P2P Segura ✓
                  </p>
                </div>
              </div>
              <div className="bg-black/40 rounded-xl p-5 border border-purple-500/20 shadow-inner">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Número Celular (Nequi)</p>
                <div className="flex justify-between items-center bg-black/60 rounded-lg p-3 border border-white/5 mb-4">
                  <span className="font-black text-white text-xl font-mono tracking-widest">{pData.nequi_number || "300 000 0000"}</span>
                  <button type="button" className="text-xs font-black text-purple-400 hover:text-white bg-purple-500/20 px-3 py-2 rounded-md flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
                    onClick={() => {
                       navigator.clipboard.writeText(pData.nequi_number || "300 000 0000");
                       alert("Número Nequi copiado");
                    }}
                  >
                     Copiar
                  </button>
                </div>
                
                <div className="flex justify-between items-end border-t border-purple-500/10 pt-4">
                  <div>
                     <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">Titular de la cuenta</p>
                     <p className="font-bold text-gray-200 uppercase line-clamp-1">{pData.account_holder || siteSlug || "Barbería Principal"}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">A transferir</p>
                     <p className="font-black text-yellow-400 text-lg leading-none">{formatPrice(total)}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-purple-300/80 bg-purple-500/5 p-3 rounded-lg border border-purple-500/10 leading-relaxed">
                <span className="font-black">NOTA:</span> Transfiere el dinero y luego ingresa el <strong>código de comprobante</strong> de Nequi en la casilla inferior.
              </p>
            </div>
          )}'''
content = content.replace(nequi_old, nequi_new)

# Fix Transferencia
transfer_old = '''          {/* ── TRANSFERENCIA ── */}
          {selectedMethod === "transfer" && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-5 space-y-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🏦</span>
                <p className="font-black text-emerald-300">Transferencia Bancaria</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Banco",   pData.bank_name || "Bancolombia"],
                  ["Tipo",    pData.account_type || "Ahorros"],
                  ["Cuenta",  pData.account_number || "123-456789-00"],
                  ["Titular", pData.account_holder || siteSlug || "Barbería Principal"],
                  ["Cédula",  pData.cedula || "900.123.456"],
                ].map(([k, v]) => (
                  <div key={k} className="bg-black/30 rounded-xl p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{k}</p>
                    <p className="font-bold text-white text-sm truncate">{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center bg-black/30 rounded-xl p-3 border-t border-emerald-500/20">
                <span className="text-xs text-gray-500">Valor a transferir</span>
                <span className="font-black text-yellow-400">{formatPrice(total)}</span>
              </div>
            </div>
          )}'''

transfer_new = '''          {/* ── TRANSFERENCIA (REALISTA) ── */}
          {selectedMethod === "transfer" && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏦</span>
                  <div>
                    <p className="font-black text-emerald-300">Transferencia Directa</p>
                    <p className="text-[10px] text-emerald-400/60 uppercase tracking-widest flex items-center gap-1">
                      Pasarela Segura PSE ✓
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-black/80 to-emerald-900/10 rounded-xl p-5 border border-emerald-500/20 relative overflow-hidden shadow-inner">
                <div className="absolute -top-4 -right-4 text-emerald-500/10" style={{ fontSize: '100px' }}>🏦</div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                     <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Banco Destino</p>
                     <p className="text-xl font-black text-white">{pData.bank_name || "Bancolombia"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Tipo</p>
                    <p className="text-sm font-bold text-emerald-400">{pData.account_type || "Ahorros"}</p>
                  </div>
                </div>

                <div className="bg-black/60 rounded-lg p-3 flex justify-between items-center mb-4 border border-white/5 relative z-10">
                  <div className="font-mono text-xl font-bold tracking-widest text-[#facc15]">
                    {pData.account_number || "123-456789-00"}
                  </div>
                  <button type="button" className="text-xs font-black text-emerald-400 hover:text-white bg-emerald-500/20 px-3 py-2 rounded-md flex items-center gap-1.5 transition hover:scale-105 active:scale-95"
                    onClick={() => {
                       navigator.clipboard.writeText(pData.account_number || "123-456789-00");
                       alert("Número de cuenta copiado");
                    }}
                  >
                     Copiar
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm relative z-10 border-t border-emerald-500/10 pt-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Titular</p>
                    <p className="font-bold text-gray-200 line-clamp-1">{pData.account_holder || siteSlug || "Barbería Principal"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Cédula / NIT</p>
                    <p className="font-bold text-gray-200">{pData.cedula || "900.123.456"}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center bg-black/40 rounded-xl p-4 border border-white/5">
                <span className="text-xs text-gray-400 uppercase tracking-widest font-black">Valor a transferir</span>
                <span className="font-black text-[#facc15] text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          )}'''
content = content.replace(transfer_old, transfer_new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("SUCCESS")
