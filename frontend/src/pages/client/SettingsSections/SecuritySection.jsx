import React from "react";
import { motion } from "framer-motion";
import { Save } from "lucide-react";

export default function SecuritySection({ 
    passwordData, 
    setPasswordData, 
    handleGlobalSave, 
    handleBack, 
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
                <h2 className="text-2xl font-bold mb-1">Seguridad</h2>
                <p className={isClassic ? "text-gray-400" : "text-gray-500"}>Cambia tu contraseña para mantener tu cuenta segura.</p>
            </div>

            <form onSubmit={handleGlobalSave} className="max-w-xl space-y-6">
                <div>
                    <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Contraseña Actual</label>
                    <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className={`w-full p-4 rounded-xl border transition-all ${isClassic ? "bg-zinc-900 border-white/5 focus:ring-2 focus:ring-yellow-500/50" : "bg-white border-gray-200 focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Nueva Contraseña</label>
                        <input
                            type="password"
                            required
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className={`w-full p-4 rounded-xl border transition-all ${isClassic ? "bg-zinc-900 border-white/5 focus:ring-2 focus:ring-yellow-500/50" : "bg-white border-gray-200 focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Confirmar</label>
                        <input
                            type="password"
                            required
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className={`w-full p-4 rounded-xl border transition-all ${isClassic ? "bg-zinc-900 border-white/5 focus:ring-2 focus:ring-yellow-500/50" : "bg-white border-gray-200 focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className={`px-6 py-4 rounded-xl font-bold uppercase tracking-tighter transition-all ${isClassic ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-4 rounded-xl font-bold uppercase tracking-tighter transition-all active:scale-95 ${isClassic ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-xl shadow-yellow-500/20" : "bg-[#1C1C1C] text-white"}`}
                    >
                        <Save size={18} /> {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
