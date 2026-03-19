import React from "react";
import { motion } from "framer-motion";
import { Palette, CheckCircle, Save } from "lucide-react";

export default function AppearanceSection({ 
    localTheme, 
    setLocalTheme, 
    handleGlobalSave, 
    hasUnsavedChanges, 
    loading, 
    isClassic 
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            <div>
                <h2 className="text-2xl font-bold mb-1">Apariencia</h2>
                <p className={isClassic ? "text-gray-400" : "text-gray-500"}>Personaliza tu interfaz según tu estilo preferido.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Classic Card */}
                <button
                    onClick={() => setLocalTheme("classic")}
                    className={`relative p-6 rounded-3xl border-2 transition-all text-left group overflow-hidden ${localTheme === 'classic' ? "border-yellow-500 bg-zinc-900" : "border-white/5 bg-zinc-900/40 hover:border-white/20"}`}
                >
                    <div className="flex justify-between items-start mb-12">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">
                            <Palette size={24} />
                        </div>
                        {localTheme === 'classic' && <CheckCircle size={24} className="text-yellow-500" />}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Modo Clásico</h3>
                        <p className="text-gray-500 text-sm">Elegancia nocturna, dorado y negro profundo.</p>
                    </div>
                    {/* Preview visual */}
                    <div className="absolute -right-4 -bottom-4 w-32 h-20 bg-[#0F0F0F] border border-white/10 rounded-tl-2xl transform group-hover:scale-110 transition-transform">
                        <div className="w-1/2 h-2 bg-yellow-500/30 mt-4 ml-4 rounded-full" />
                        <div className="w-3/4 h-2 bg-white/5 mt-2 ml-4 rounded-full" />
                    </div>
                </button>

                {/* Light Card */}
                <button
                    onClick={() => setLocalTheme("light")}
                    className={`relative p-6 rounded-3xl border-2 transition-all text-left group overflow-hidden ${localTheme === 'light' ? "border-yellow-500 bg-white" : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"}`}
                >
                    <div className="flex justify-between items-start mb-12">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-600">
                            <Palette size={24} />
                        </div>
                        {localTheme === 'light' && <CheckCircle size={24} className="text-yellow-500" />}
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold mb-1 ${localTheme === 'light' ? "text-black" : "text-[#1C1C1C]"}`}>Modo Claro</h3>
                        <p className="text-gray-400 text-sm">Limpio, moderno y sofisticado.</p>
                    </div>
                    {/* Preview visual */}
                    <div className="absolute -right-4 -bottom-4 w-32 h-20 bg-[#F8F6F2] border border-gray-200 rounded-tl-2xl transform group-hover:scale-110 transition-transform">
                        <div className="w-1/2 h-2 bg-yellow-500/30 mt-4 ml-4 rounded-full" />
                        <div className="w-3/4 h-2 bg-black/5 mt-2 ml-4 rounded-full" />
                    </div>
                </button>
            </div>

            <div className="flex justify-end pt-12">
                <button
                    onClick={handleGlobalSave}
                    disabled={loading}
                    className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-tighter transition-all active:scale-95 ${hasUnsavedChanges()
                        ? (isClassic ? "bg-yellow-500 text-black shadow-2xl shadow-yellow-500/40 animate-pulse" : "bg-[#1C1C1C] text-white shadow-2xl shadow-black/20")
                        : (isClassic ? "bg-zinc-800 text-gray-500 cursor-not-allowed" : "bg-gray-200 text-gray-400 cursor-not-allowed")
                        }`}
                >
                    <Save size={20} /> {loading ? "Aplicando..." : "Guardar Preferencias"}
                </button>
            </div>
        </motion.div>
    );
}
