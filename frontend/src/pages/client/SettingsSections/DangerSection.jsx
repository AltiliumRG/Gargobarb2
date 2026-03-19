import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, LogOut, Trash2 } from "lucide-react";

export default function DangerSection({ 
    logout, 
    handleDeleteAccount 
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            <div className="p-8 rounded-[2rem] border border-red-500/20 bg-red-500/5 relative overflow-hidden">
                <AlertTriangle size={120} className="absolute -right-8 -bottom-8 opacity-[0.03] text-red-500" />

                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-red-400">
                    Zona Peligrosa
                </h2>
                <p className="text-gray-400 mb-8 max-w-lg font-medium leading-relaxed">
                    Estas acciones son definitivas. Ten precaución al gestionar el cierre o la eliminación de tus datos.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={logout}
                        className="flex-1 bg-white hover:bg-gray-200 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        <LogOut size={20} /> Cerrar Sesión
                    </button>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex-1 border-2 border-red-500/50 hover:bg-red-500 text-red-500 hover:text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-500/10"
                    >
                        <Trash2 size={20} /> Eliminar Cuenta
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
