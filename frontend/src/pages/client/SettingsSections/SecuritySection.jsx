import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Lock, KeyRound, Eye, EyeOff, Send, Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/api";
import { getPasswordStatus } from "../../../utils/auth.validate";

export default function SecuritySection({ 
    user,
    handleBack, 
    isClassic 
}) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const [form, setForm] = useState({
        code: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [passwordInfo, setPasswordInfo] = useState({ score: 0, error: null });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value.trimStart() }));

        if (name === "newPassword") {
            const status = getPasswordStatus(value, value);
            setPasswordInfo({ score: status.score, error: status.error });
        }
    };

    const handleRequestCode = async () => {
        if (!user?.email) return toast.error("No se encontró un correo asociado a tu cuenta.");

        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email: user.email });
            toast.success("Código enviado a tu correo");
            setStep(2);
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Error al solicitar código";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!form.code || !form.newPassword || !form.confirmPassword) return toast.error("Todos los campos son obligatorios");
        if (form.newPassword !== form.confirmPassword) return toast.error("Las contraseñas no coinciden");
        if (passwordInfo.error) return toast.error(passwordInfo.error);

        setLoading(true);
        try {
            await api.post("/auth/reset-password", {
                email: user.email,
                code: form.code,
                newPassword: form.newPassword
            });
            toast.success("Contraseña actualizada con éxito 🎉");
            setStep(1);
            setForm({ code: "", newPassword: "", confirmPassword: "" });
            setPasswordInfo({ score: 0, error: null });
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Error al actualizar contraseña";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            <div>
                <h2 className="text-2xl font-bold mb-1">Seguridad y Contraseña</h2>
                <p className={isClassic ? "text-gray-400" : "text-gray-500"}>
                    {step === 1 
                        ? "Te enviaremos un código de seguridad a tu correo para verificar tu identidad y permitirte establecer una nueva contraseña." 
                        : "Ingresa el código de 6 dígitos que enviamos a tu correo y tu nueva contraseña."}
                </p>
            </div>

            <div className={`p-6 rounded-2xl border ${isClassic ? "bg-zinc-900 border-white/5" : "bg-white border-gray-100 shadow-sm"}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <Mail className="text-yellow-500" size={20} />
                    </div>
                    <div>
                        <p className={`text-sm font-bold ${isClassic ? "text-white" : "text-black"}`}>Correo vinculado</p>
                        <p className={`text-xs ${isClassic ? "text-gray-400" : "text-gray-600"}`}>{user?.email}</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <button
                                onClick={handleRequestCode}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20"}`}
                            >
                                <Send size={18} /> {loading ? "Enviando..." : "Solicitar código de cambio"}
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handleResetPassword}
                            className="space-y-5"
                        >
                            <div>
                                <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Código de verificación</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <KeyRound className={isClassic ? "text-gray-500" : "text-gray-400"} size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="code"
                                        maxLength="6"
                                        required
                                        value={form.code}
                                        onChange={handleChange}
                                        className={`w-full pl-12 p-4 text-center tracking-[0.5em] text-lg font-bold rounded-xl border transition-all ${isClassic ? "bg-zinc-800 border-white/5 text-white focus:ring-2 focus:ring-yellow-500/50" : "bg-gray-50 border-gray-200 text-black focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                                        placeholder="------"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Nueva Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className={isClassic ? "text-gray-500" : "text-gray-400"} size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="newPassword"
                                        required
                                        value={form.newPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-12 p-4 rounded-xl border transition-all ${isClassic ? "bg-zinc-800 border-white/5 text-white focus:ring-2 focus:ring-yellow-500/50" : "bg-gray-50 border-gray-200 text-black focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                                        placeholder="Tu nueva contraseña"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 dark:bg-zinc-800 rounded-xl overflow-hidden mt-3">
                                    <div
                                        className={`h-full transition-all duration-500 ${["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"][passwordInfo.score]}`}
                                        style={{ width: `${(passwordInfo.score + 1) * 20}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-[#C6A75E] uppercase tracking-widest mb-2">Confirmar Contraseña</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className={isClassic ? "text-gray-500" : "text-gray-400"} size={18} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full pl-12 pr-12 p-4 rounded-xl border transition-all ${isClassic ? "bg-zinc-800 border-white/5 text-white focus:ring-2 focus:ring-yellow-500/50" : "bg-gray-50 border-gray-200 text-black focus:ring-2 focus:ring-yellow-500/30"} outline-none`}
                                        placeholder="Repite tu contraseña"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-yellow-500 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className={`w-full sm:w-auto px-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all ${isClassic ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-100"}`}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !form.code || !form.newPassword || !form.confirmPassword}
                                    className={`w-full flex-1 py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${loading || !form.code || !form.newPassword || !form.confirmPassword ? "opacity-50 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20"}`}
                                >
                                    <Save size={18} /> {loading ? "Guardando..." : "Guardar Contraseña"}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
