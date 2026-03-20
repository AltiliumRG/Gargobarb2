// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/api";
import { useAuth } from "../auth/AuthContext";
const AuthBackground = "/AuthBackground.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [attempts, setAttempts] = useState(
    Number(localStorage.getItem("loginAttempts")) || 0
  );
  const [blockLevel, setBlockLevel] = useState(
    Number(localStorage.getItem("loginBlockLevel")) || 0
  );
  const [blockedUntil, setBlockedUntil] = useState(
    localStorage.getItem("blockedUntil")
      ? Number(localStorage.getItem("blockedUntil"))
      : null
  );
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const isBlocked = () => blockedUntil && Date.now() < blockedUntil;

  useEffect(() => {
    if (!blockedUntil) return;

    const interval = setInterval(() => {
      const diff = Math.max(
        0,
        Math.ceil((blockedUntil - Date.now()) / 1000)
      );
      setRemainingSeconds(diff);

      if (diff <= 0) {
        setBlockedUntil(null);
        localStorage.removeItem("blockedUntil");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.email.trim()) return "El correo es obligatorio.";
    if (!/\S+@\S+\.\S+/.test(form.email)) return "Correo inválido.";
    if (!form.password.trim()) return "La contraseña es obligatoria.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isBlocked()) {
      return toast.error(
        `Demasiados intentos. Intenta en ${remainingSeconds}s`
      );
    }

    const validationError = validate();
    if (validationError) return toast.error(validationError);

    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      setAttempts(0);
      setBlockLevel(0);
      setBlockedUntil(null);
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("loginBlockLevel");
      localStorage.removeItem("blockedUntil");

      login(res.data.user);
      toast.success("Inicio de sesión exitoso 🚀");
      navigate("/", { replace: true });

    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error || err.response?.data?.message;

      if (status === 409) {
        toast.info(message || "Esta cuenta usa inicio de sesión con Google");
        return;
      }

      if (status === 401) {
        toast.error("Usuario o contraseña incorrectos");

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem("loginAttempts", newAttempts);

        if (newAttempts >= 3) {
          const blockTimes = [30, 60, 120, 240, 300];
          const blockTime = blockTimes[blockLevel] || 300;
          const until = Date.now() + blockTime * 1000;

          setBlockedUntil(until);
          setAttempts(0);
          setBlockLevel(blockLevel + 1);

          localStorage.setItem("blockedUntil", until);
          localStorage.setItem("loginBlockLevel", blockLevel + 1);
          localStorage.setItem("loginAttempts", 0);

          toast.error(`Bloqueado por ${blockTime} segundos`);
        }
        return;
      }

      toast.error(message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      login(res.data.user);
      toast.success("Inicio de sesión con Google exitoso 🚀");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || "Error al iniciar sesión con Google";
      toast.error(msg);
      console.error("Detalles del error de Google Login:", err);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${AuthBackground})` }}
    >
      <Toaster position="top-center" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-[#D4AF37]/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Inicia sesión 💈
        </h2>

        {!isBlocked() && (
          <div className="mb-4">
            <p className="text-sm text-gray-300 text-center">
              Intentos: {attempts} / 3
            </p>
            <div className="w-full h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all duration-500"
                style={{ width: `${(attempts / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {isBlocked() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-600/40 border border-red-500 text-red-200 text-center p-3 rounded-lg mb-4"
          >
            <p className="font-semibold">⛔ Estás temporalmente bloqueado</p>
            <p className="text-sm">
              Reintenta en <b>{remainingSeconds}</b> segundos
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-yellow-400 text-sm text-center mb-3"
            >
              Verificando credenciales...
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={isBlocked()}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition disabled:opacity-50"
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-sm font-semibold text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            disabled={isBlocked()}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10 transition disabled:opacity-50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-yellow-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading || isBlocked()}
          className={`w-full py-3 rounded-xl text-black font-semibold shadow-lg transition ${loading || isBlocked()
            ? "bg-yellow-400/60 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-500 to-yellow-700 hover:shadow-yellow-500/40"
            }`}
        >
          {loading ? "Entrando..." : "Iniciar sesión"}
        </motion.button>

        <div
          className={`flex justify-center mt-5 ${isBlocked() ? "opacity-50 pointer-events-none" : ""
            }`}
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Error con Google")}
              theme="outline"
              size="large"
              shape="pill"
            />
          </div>
        </div>

        <p className="text-sm mt-6 text-center text-gray-400">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Regístrate
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
