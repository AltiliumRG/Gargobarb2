import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import api from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Upload, User, Scissors } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

// Validation Utilities
import { 
  validateRegisterForm, 
  getPasswordStatus, 
  EMAIL_REGEX 
} from "../utils/auth.validate";

const AuthBackground = "/AuthBackground.jpg";

/**
 * Register Component
 * 
 * Handles user sign-up for both Clients and Barbers.
 * Features:
 * - Role selection (Client/Barber)
 * - Avatar upload with preview
 * - Real-time email and password validation
 * - Password strength scoring
 * - Google OAuth integration
 */
const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // --- FORM STATE ---
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    avatar_url: "",
    role_id: 3, // 3 = Cliente, 2 = Barbero
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  
  // Validation State (Computed from utilities)
  const [emailValid, setEmailValid] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(null);
  const [passwordScore, setPasswordScore] = useState(0);
  const [passwordValid, setPasswordValid] = useState({
    upper: false, lower: false, number: false, length: false, special: false,
  });

  // ============================================================
  // Handlers
  // ============================================================
  
  const handleChange = (e) => {
    let value = e.target.value;
    if (/^\s/.test(value)) value = value.trimStart();
    setForm({ ...form, [e.target.name]: value });
  };

  const handleEmailChange = (e) => {
    let value = e.target.value.trimStart();
    setForm({ ...form, email: value });
    setEmailValid(EMAIL_REGEX.test(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    const status = getPasswordStatus(value, form.confirmPassword);
    
    if (status.error) {
      toast.error(status.error);
      return;
    }

    setForm({ ...form, password: value });
    setPasswordScore(status.score);
    setPasswordValid(status.valid);
    setPasswordMatch(status.match);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, confirmPassword: value });
    setPasswordMatch(value === form.password);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm({ ...form, avatar_url: previewUrl, imageFile: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // External Validation Logic
    const validationError = validateRegisterForm(form, cookiesAccepted);
    if (validationError) return toast.error(validationError);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key !== 'confirmPassword' && key !== 'avatar_url' && key !== 'imageFile') {
          formData.append(key, typeof form[key] === 'string' ? form[key].trim() : form[key]);
        }
      });
      
      if (form.imageFile) formData.append("image", form.imageFile);

      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registro exitoso 🎉");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("❌ Error en registro:", err);
      toast.error(err.response?.data?.error || "Error al registrarse");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await api.post("/auth/google", { credential });
      const { user, token } = res.data;

      toast.success("Inicio de sesión con Google exitoso 🚀");
      login(user, token);

      const routes = { 1: "/admin/dashboard", 2: "/barber/dashboard" };
      navigate(routes[user.role_id] || "/client/home");
    } catch (err) {
      console.error("Error Google Login:", err);
      toast.error(err.response?.data?.error || "Error al iniciar con Google");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-8"
      style={{ backgroundImage: `url(${AuthBackground})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      <Toaster position="top-center" />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-[#D4AF37]/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent uppercase tracking-tight">
          Crear cuenta 💈
        </h2>
        <div className="flex justify-center mb-6 gap-3">
          {[
            { id: 3, label: "Cliente", icon: <User size={18} /> },
            { id: 2, label: "Barbero", icon: <Scissors size={18} /> },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setForm({ ...form, role_id: r.id })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${form.role_id === r.id
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                }`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col items-center mb-5">
          <label
            htmlFor="avatar"
            className="cursor-pointer relative w-24 h-24 rounded-full border-2 border-[#D4AF37]/50 flex items-center justify-center overflow-hidden hover:shadow-lg transition"
          >
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <Upload size={28} className="text-[#D4AF37]" />
            )}
            <input type="file" id="avatar" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          <p className="text-xs text-gray-400 mt-2">
            {form.avatar_url ? "Imagen cargada ✅" : "Sube tu imagen (opcional)"}
          </p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={form.username}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <input
            type="text"
            name="full_name"
            placeholder="Nombre completo"
            value={form.full_name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <div className="relative">
            <input
              type="text"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleEmailChange}
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10"
            />
            {emailValid !== null && (
              <span className={`absolute right-3 top-3 text-sm ${emailValid ? "text-green-400" : "text-red-500"}`}>
                {emailValid ? "✓" : "✗"}
              </span>
            )}
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Número de teléfono (opcional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña segura"
              value={form.password}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none pr-10"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-yellow-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Repite la contraseña"
              value={form.confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={`w-full p-3 bg-gray-800/50 border rounded-xl focus:ring-2 outline-none pr-10 ${passwordMatch === null ? "border-gray-700 focus:ring-[#D4AF37]" : passwordMatch ? "border-green-500 focus:ring-green-500" : "border-red-500 focus:ring-red-500"}`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-3 text-gray-400 hover:text-yellow-500">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordMatch !== null && (
            <p className={`text-xs ${passwordMatch ? "text-green-400" : "text-red-500"}`}>
              {passwordMatch ? "Las contraseñas coinciden ✓" : "Las contraseñas no coinciden ✗"}
            </p>
          )}
          <ul className="text-xs text-gray-400 space-y-1">
            <li className={passwordValid.upper ? "text-green-400" : "text-gray-500"}>✓ Una letra mayúscula</li>
            <li className={passwordValid.lower ? "text-green-400" : "text-gray-500"}>✓ Una letra minúscula</li>
            <li className={passwordValid.number ? "text-green-400" : "text-gray-500"}>✓ Un número</li>
            <li className={passwordValid.length ? "text-green-400" : "text-gray-500"}>✓ Al menos 8 caracteres</li>
            <li className={passwordValid.special ? "text-green-400" : "text-gray-500"}>✓ Un carácter especial permitido (@ . _ * -)</li>
          </ul>
          <div className="h-2 w-full bg-gray-800 rounded-xl overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${["bg-red-500", "bg-orange-500", "bg-[#D4AF37]", "bg-green-400", "bg-green-600"][passwordScore]}`}
              style={{ width: `${(passwordScore + 1) * 20}%` }}
            ></div>
          </div>
          <label className="flex items-center text-sm text-gray-400 gap-2">
            <input type="checkbox" checked={cookiesAccepted} onChange={(e) => setCookiesAccepted(e.target.checked)} className="accent-[#D4AF37]" />
            Acepto las cookies y términos de privacidad
          </label>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={!passwordMatch}
            className={`w-full font-semibold py-3 rounded-xl shadow-lg transition ${passwordMatch ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-black hover:shadow-yellow-500/40" : "bg-gray-700 text-gray-400 cursor-not-allowed"}`}
          >
            Registrarme
          </motion.button>
          <div className="flex justify-center mt-5">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-105">
              <GoogleLogin onSuccess={handleGoogleLogin} onError={() => toast.error("Error con Google")} theme="outline" size="large" shape="pill" text="signin_with" />
            </div>
          </div>
        </div>
        <p className="text-sm mt-6 text-center text-gray-400">
          ¿Ya tienes cuenta? <a href="/login" className="text-[#D4AF37] font-semibold hover:underline">Inicia sesión</a>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
