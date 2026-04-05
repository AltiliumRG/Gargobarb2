import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Lock, KeyRound, Eye, EyeOff, Send, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { getPasswordStatus } from "../../../utils/auth.validate";

export default function SecuritySection({ user }) {
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
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Seguridad</h2>
                <p className="text-gray-400 text-sm">Protege tu cuenta con una contraseña segura y verificación por correo.</p>
            </div>

            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
                        <Mail className="text-yellow-500" size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-white uppercase tracking-widest">Correo de Recuperación</p>
                        <p className="text-gray-400 font-medium">{user?.email}</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-yellow-500/5 p-6 rounded-2xl border border-yellow-500/10"
                        >
                            <div className="flex gap-4 items-start mb-6">
                                <ShieldCheck className="text-yellow-500 shrink-0" size={24} />
                                <p className="text-sm text-gray-300 leading-relaxed">
                                    Para cambiar tu contraseña, enviaremos un código de seguridad de 6 dígitos a tu correo electrónico. 
                                    Este código es necesario para validar que eres el propietario de la cuenta.
                                </p>
                            </div>
                            <button
                                onClick={handleRequestCode}
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                                {loading ? "Enviando..." : "Solicitar Código de Verificación"}
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
                            className="space-y-6"
                        >
                            <div className="flex items-center gap-2 text-yellow-500 mb-4 px-1">
                                <KeyRound size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Verificación en curso</span>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 block px-1">Código de 6 dígitos</label>
                                <input
                                    type="text"
                                    name="code"
                                    maxLength="6"
                                    required
                                    value={form.code}
                                    onChange={handleChange}
                                    className="w-full p-5 text-center tracking-[0.5em] text-2xl font-black rounded-2xl bg-black/40 border border-white/10 text-white focus:border-yellow-500 outline-none transition"
                                    placeholder="------"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 block px-1">Nueva Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            required
                                            value={form.newPassword}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-12 p-4 rounded-xl bg-black/30 border border-white/5 text-white focus:border-yellow-500 outline-none transition"
                                            placeholder="Nueva contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                                        <div 
                                            className={`h-full transition-all duration-500 ${["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"][passwordInfo.score]}`}
                                            style={{ width: `${(passwordInfo.score + 1) * 20}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 block px-1">Confirmar Contraseña</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-12 pr-12 p-4 rounded-xl bg-black/30 border border-white/5 text-white focus:border-yellow-500 outline-none transition"
                                            placeholder="Repite la contraseña"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-4 rounded-xl bg-zinc-800 text-white font-bold transition hover:bg-zinc-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !form.code || !form.newPassword || !form.confirmPassword}
                                    className="flex-[2] py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest transition hover:bg-yellow-500 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={18} />}
                                    Actualizar Contraseña
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
