import React from "react";
import { motion } from "framer-motion";
import { User, Camera, Save } from "lucide-react";

export default function AccountSection({ 
    user, 
    accountData, 
    setAccountData, 
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
            <div className="flex flex-col md:flex-row md:items-center gap-8 pb-8 border-b border-white/5">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-2 border-yellow-500/30 overflow-hidden bg-zinc-900 flex items-center justify-center">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={48} className="text-gray-600" />
                        )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full text-black hover:scale-110 transition shadow-lg">
                        <Camera size={16} />
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-1">Tu Perfil</h2>
                    <p className={isClassic ? "text-gray-400" : "text-gray-500"}>Administra la información pública de tu cuenta.</p>
                </div>
            </div>

            <form onSubmit={handleGlobalSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Nombre de usuario</label>
                    <input
                        type="text"
                        value={accountData.username}
                        onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                        className={`w-full p-4 rounded-xl border transition-all ${isClassic ? "bg-zinc-900 border-white/5 focus:ring-2 focus:ring-yellow-500/50" : "bg-white border-gray-200 focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                    />
                </div>
                <div>
                    <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Nombre Completo</label>
                    <input
                        type="text"
                        value={accountData.full_name}
                        onChange={(e) => setAccountData({ ...accountData, full_name: e.target.value })}
                        className={`w-full p-4 rounded-xl border transition-all ${isClassic ? "bg-zinc-900 border-white/5 focus:ring-2 focus:ring-yellow-500/50" : "bg-white border-gray-200 focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Email</label>
                    <input
                        type="email"
                        value={accountData.email}
                        onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                        className={`w-full p-4 rounded-xl border transition-all ${isClassic ? "bg-zinc-900 border-white/5 focus:ring-2 focus:ring-yellow-500/50" : "bg-white border-gray-200 focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                    />
                </div>
                <div className="md:col-span-2 flex justify-end gap-4 pt-4">
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
                        className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-tighter transition-all active:scale-95 ${isClassic ? "bg-yellow-500 hover:bg-yellow-400 text-black shadow-xl shadow-yellow-500/20" : "bg-[#1C1C1C] hover:bg-black text-white"}`}
                    >
                        <Save size={18} /> {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
