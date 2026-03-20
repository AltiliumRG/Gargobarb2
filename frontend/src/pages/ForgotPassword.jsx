import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Mail, KeyRound, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import api from "../api/api";
import { getPasswordStatus } from "../utils/auth.validate";

const AuthBackground = "/AuthBackground.jpg";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: ""
  });

  const [passwordInfo, setPasswordInfo] = useState({ score: 0, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value.trimStart() }));

    if (name === "newPassword") {
      const status = getPasswordStatus(value, value); // Using same for confirm
      setPasswordInfo({ score: status.score, error: status.error });
    }
  };

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!form.email) return toast.error("Ingresa tu correo");

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: form.email });
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
    if (!form.code || !form.newPassword) return toast.error("Todos los campos son obligatorios");
    if (passwordInfo.error) return toast.error(passwordInfo.error);

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: form.email,
        code: form.code,
        newPassword: form.newPassword
      });
      toast.success("Contraseña actualizada con éxito 🎉");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Error al resetear contraseña";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4"
      style={{ backgroundImage: `url(${AuthBackground})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-[#D4AF37]/30 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10"
      >
        <button
          onClick={() => navigate("/login")}
          className="absolute top-4 left-4 text-gray-400 hover:text-yellow-500 transition flex items-center gap-1 text-sm font-semibold"
        >
          <ArrowLeft size={16} /> Volver
        </button>

        <h2 className="text-3xl font-bold text-center mt-6 mb-2 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Recuperar Contraseña
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          {step === 1 ? "Te enviaremos un código de seguridad." : "Ingresa el código y tu nueva contraseña."}
        </p>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              onSubmit={handleRequestCode}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Correo electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition"
                    placeholder="tucorreo@ejemplo.com"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !form.email}
                className="w-full py-3 rounded-xl font-semibold shadow-lg transition bg-gradient-to-r from-yellow-500 to-yellow-700 text-black disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? "Enviando..." : "Enviar código"}
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              onSubmit={handleResetPassword}
              className="space-y-4"
            >
              <div className="text-center p-3 bg-gray-900 rounded-xl border border-gray-800 mb-4 text-sm text-gray-300">
                Se envió un correo a <strong className="text-yellow-400">{form.email}</strong>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Código de 6 dígitos</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="text-gray-500" size={18} />
                  </div>
                  <input
                    type="text"
                    name="code"
                    maxLength="6"
                    value={form.code}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 text-center tracking-[0.5em] text-xl font-bold bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition"
                    placeholder="------"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1">Nueva Contraseña</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-500" size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition pr-10"
                    placeholder="Contraseña segura"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-yellow-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Visualizador de fuerza */}
                <div className="h-1.5 w-full bg-gray-800 rounded-xl overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-500 ${["bg-red-500", "bg-orange-500", "bg-[#D4AF37]", "bg-green-400", "bg-green-600"][passwordInfo.score]}`}
                    style={{ width: `${(passwordInfo.score + 1) * 20}%` }}
                  ></div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading || !form.code || !form.newPassword}
                className="w-full py-3 rounded-xl font-semibold shadow-lg transition bg-gradient-to-r from-yellow-500 to-yellow-700 text-black disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {loading ? "Verificando..." : "Restablecer Contraseña"}
              </motion.button>
              
              <div className="text-center mt-4">
                <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-white underline">
                  ¿No recibiste el código? Volver a intentar
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
