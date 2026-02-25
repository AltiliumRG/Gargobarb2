import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import zxcvbn from "zxcvbn";
import api from "../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Upload, User, Scissors } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
import AuthBackground from "../AuthBackground.jpg";
=======
>>>>>>> origin/David
>>>>>>> Stashed changes

const Register = () => {
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const [passwordScore, setPasswordScore] = useState(0);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState({
    upper: false,
    lower: false,
    number: false,
    length: false,
    special: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  // Caracteres especiales permitidos
  const allowedSpecials = /[@._*-]/;
  // Caracteres peligrosos
  const forbiddenSpecials = /[<>{}[\]()'";|\\/~!#$%^&*+=?´]/;

  /* ============================================================
     🔹 Validaciones
  ============================================================ */
  const validateForm = () => {
    const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;

    const trimmedUsername = form.username.trim();
    const trimmedFullName = form.full_name.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPhone = form.phone.trim();

    if (!trimmedUsername) return "El nombre de usuario es obligatorio.";
    if (/^\s/.test(form.username)) return "El nombre de usuario no puede iniciar con espacio.";
    if (!usernameRegex.test(trimmedUsername))
      return "El nombre de usuario solo puede contener letras, números, puntos o guiones.";

    if (!trimmedFullName) return "El nombre completo es obligatorio.";
    if (/^\s/.test(form.full_name)) return "El nombre completo no puede iniciar con espacio.";

    if (!trimmedEmail) return "El correo electrónico es obligatorio.";
    if (/^\s/.test(form.email)) return "El correo no puede iniciar con espacio.";
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) return "El correo no es válido.";
<<<<<<< Updated upstream
   
=======
<<<<<<< HEAD

=======
   
>>>>>>> origin/David
>>>>>>> Stashed changes
    if (trimmedPhone && !/^\d{10}$/.test(trimmedPhone))
      return "El número de teléfono debe tener 10 dígitos.";
    if (/^\s/.test(form.phone)) return "El teléfono no puede iniciar con espacio.";

    // Contraseña
    if (/\s/.test(form.password)) return "La contraseña no puede contener espacios.";
    if (passwordScore < 3) return "La contraseña debe ser más fuerte (barra en verde).";
    if (forbiddenSpecials.test(form.password))
      return "La contraseña contiene caracteres no permitidos.";
    if (!allowedSpecials.test(form.password))
      return "La contraseña debe incluir al menos un carácter especial permitido (@ . _ * -).";
    if (!/[A-Z]/.test(form.password))
      return "La contraseña debe contener al menos una letra mayúscula.";
    if (!/[a-z]/.test(form.password))
      return "La contraseña debe contener al menos una letra minúscula.";
    if (!/\d/.test(form.password))
      return "La contraseña debe contener al menos un número.";
    if (form.password.length < 8)
      return "La contraseña debe tener al menos 8 caracteres.";
    if (form.password !== form.confirmPassword)
      return "Las contraseñas no coinciden.";

    if (!cookiesAccepted) return "Debes aceptar las cookies para continuar.";

    return null;
  };

  /* ============================================================
     🧩 Manejadores de cambio
  ============================================================ */
  const handlePasswordChange = (e) => {
    const value = e.target.value;

    if (forbiddenSpecials.test(value)) {
      toast.error("⚠️ La contraseña contiene caracteres no permitidos.");
      return;
    }

    setForm({ ...form, password: value });

    const result = zxcvbn(value);
    setPasswordScore(result.score);

    setPasswordValid({
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
      length: value.length >= 8,
      special: allowedSpecials.test(value),
    });

    setPasswordMatch(value === form.confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, confirmPassword: value });
    setPasswordMatch(value === form.password);
  };

<<<<<<< Updated upstream
const handleChange = (e) => {
  let value = e.target.value;
=======
<<<<<<< HEAD
  const handleChange = (e) => {
    let value = e.target.value;
>>>>>>> Stashed changes

  // Reemplaza espacios al inicio
  if (/^\s/.test(value)) value = value.trimStart();

  setForm({ ...form, [e.target.name]: value });
};

const handleEmailChange = (e) => {
  let value = e.target.value;

  // Reemplaza espacios al inicio
  value = value.trimStart();

<<<<<<< Updated upstream
  setForm({ ...form, email: value });
  setEmailValid(/\S+@\S+\.\S+/.test(value));
};
=======
    setForm({ ...form, email: value });
    setEmailValid(/\S+@\S+\.\S+/.test(value));
  };
=======
const handleChange = (e) => {
  let value = e.target.value;

  // Reemplaza espacios al inicio
  if (/^\s/.test(value)) value = value.trimStart();

  setForm({ ...form, [e.target.name]: value });
};

const handleEmailChange = (e) => {
  let value = e.target.value;

  // Reemplaza espacios al inicio
  value = value.trimStart();

  setForm({ ...form, email: value });
  setEmailValid(/\S+@\S+\.\S+/.test(value));
};
>>>>>>> origin/David
>>>>>>> Stashed changes

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setForm({ ...form, avatar_url: previewUrl, imageFile: file });
    }
  };

  /* ============================================================
     🧍 Registro normal
  ============================================================ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return toast.error(validationError);

    try {
      const formData = new FormData();
      formData.append("username", form.username.trim());
      formData.append("full_name", form.full_name.trim());
      formData.append("email", form.email.trim());
      formData.append("phone", form.phone.trim());
      formData.append("password", form.password);
      formData.append("role_id", form.role_id);
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

  /* ============================================================
     🔐 Google Auth
  ============================================================ */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await api.post("/auth/google", { credential });
      const { user, token } = res.data;

      toast.success("Inicio de sesión con Google exitoso 🚀");
      login(user, token);

      if (user.role_id === 1) navigate("/admin/dashboard");
      else if (user.role_id === 2) navigate("/barber/dashboard");
      else navigate("/client/home");
    } catch (err) {
      console.error("Error Google Login:", err);
      toast.error(err.response?.data?.error || "Error al iniciar con Google");
    }
  };

  /* ============================================================
     🧱 UI (Tailwind optimizado)
  ============================================================ */
  return (
<<<<<<< Updated upstream
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-4">
=======
<<<<<<< HEAD
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative px-4 py-8"
      style={{ backgroundImage: `url(${AuthBackground})` }}
    >
      {/* Overlay para contraste */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

=======
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-4">
>>>>>>> origin/David
>>>>>>> Stashed changes
      <Toaster position="top-center" />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
<<<<<<< Updated upstream
        className="bg-gray-900/80 backdrop-blur-xl border border-yellow-500/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
=======
<<<<<<< HEAD
        className="bg-[#0b0b0b]/80 backdrop-blur-xl border border-[#D4AF37]/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent uppercase tracking-tight">
=======
        className="bg-gray-900/80 backdrop-blur-xl border border-yellow-500/30 p-8 rounded-2xl shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
>>>>>>> origin/David
>>>>>>> Stashed changes
          Crear cuenta 💈
        </h2>

        {/* Tipo de usuario */}
        <div className="flex justify-center mb-6 gap-3">
          {[
            { id: 3, label: "Cliente", icon: <User size={18} /> },
            { id: 2, label: "Barbero", icon: <Scissors size={18} /> },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setForm({ ...form, role_id: r.id })}
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${form.role_id === r.id
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "bg-gray-800 border-gray-700 hover:bg-gray-700"
                }`}
=======
>>>>>>> Stashed changes
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                form.role_id === r.id
                  ? "bg-yellow-500 text-black border-yellow-400"
                  : "bg-gray-800 border-gray-700 hover:bg-gray-700"
              }`}
<<<<<<< Updated upstream
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <label
            htmlFor="avatar"
<<<<<<< Updated upstream
            className="cursor-pointer relative w-24 h-24 rounded-full border-2 border-yellow-500/50 flex items-center justify-center overflow-hidden hover:shadow-lg transition"
=======
<<<<<<< HEAD
            className="cursor-pointer relative w-24 h-24 rounded-full border-2 border-[#D4AF37]/50 flex items-center justify-center overflow-hidden hover:shadow-lg transition"
=======
            className="cursor-pointer relative w-24 h-24 rounded-full border-2 border-yellow-500/50 flex items-center justify-center overflow-hidden hover:shadow-lg transition"
>>>>>>> origin/David
>>>>>>> Stashed changes
          >
            {form.avatar_url ? (
              <img
                src={form.avatar_url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
<<<<<<< Updated upstream
              <Upload size={28} className="text-yellow-500" />
=======
<<<<<<< HEAD
              <Upload size={28} className="text-[#D4AF37]" />
=======
              <Upload size={28} className="text-yellow-500" />
>>>>>>> origin/David
>>>>>>> Stashed changes
            )}
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">
            {form.avatar_url ? "Imagen cargada ✅" : "Sube tu imagen (opcional)"}
          </p>
        </div>

        {/* Campos */}
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

          {/* Email */}
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
          <div className="relative">
            <input
              type="text" // 👈 antes era "email"
              name="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleEmailChange}
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10"
            />
            {emailValid !== null && (
              <span
                className={`absolute right-3 top-3 text-sm ${emailValid ? "text-green-400" : "text-red-500"
                  }`}
              >
                {emailValid ? "✓" : "✗"}
              </span>
            )}
          </div>
=======
>>>>>>> Stashed changes
<div className="relative">
  <input
    type="text" // 👈 antes era "email"
    name="email"
    placeholder="Correo electrónico"
    value={form.email}
    onChange={handleEmailChange}
    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10"
  />
  {emailValid !== null && (
    <span
      className={`absolute right-3 top-3 text-sm ${
        emailValid ? "text-green-400" : "text-red-500"
      }`}
    >
      {emailValid ? "✓" : "✗"}
    </span>
  )}
</div>
<<<<<<< Updated upstream
=======
>>>>>>> origin/David
>>>>>>> Stashed changes

          <input
            type="text"
            name="phone"
            placeholder="Número de teléfono (opcional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          {/* Contraseña */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña segura"
              value={form.password}
              onChange={handlePasswordChange}
<<<<<<< Updated upstream
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10"
=======
<<<<<<< HEAD
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#D4AF37] outline-none pr-10"
=======
              className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none pr-10"
>>>>>>> origin/David
>>>>>>> Stashed changes
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-yellow-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Repite la contraseña"
              value={form.confirmPassword}
              onChange={handleConfirmPasswordChange}
<<<<<<< Updated upstream
              className={`w-full p-3 bg-gray-800/50 border rounded-xl focus:ring-2 outline-none pr-10 ${
                passwordMatch === null
                  ? "border-gray-700 focus:ring-yellow-500"
                  : passwordMatch
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
=======
<<<<<<< HEAD
              className={`w-full p-3 bg-gray-800/50 border rounded-xl focus:ring-2 outline-none pr-10 ${passwordMatch === null
                ? "border-gray-700 focus:ring-[#D4AF37]"
                : passwordMatch
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
                }`}
=======
              className={`w-full p-3 bg-gray-800/50 border rounded-xl focus:ring-2 outline-none pr-10 ${
                passwordMatch === null
                  ? "border-gray-700 focus:ring-yellow-500"
                  : passwordMatch
                  ? "border-green-500 focus:ring-green-500"
                  : "border-red-500 focus:ring-red-500"
              }`}
>>>>>>> origin/David
>>>>>>> Stashed changes
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-400 hover:text-yellow-500"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {passwordMatch !== null && (
            <p
<<<<<<< Updated upstream
              className={`text-xs ${
                passwordMatch ? "text-green-400" : "text-red-500"
              }`}
=======
<<<<<<< HEAD
              className={`text-xs ${passwordMatch ? "text-green-400" : "text-red-500"
                }`}
=======
              className={`text-xs ${
                passwordMatch ? "text-green-400" : "text-red-500"
              }`}
>>>>>>> origin/David
>>>>>>> Stashed changes
            >
              {passwordMatch
                ? "Las contraseñas coinciden ✓"
                : "Las contraseñas no coinciden ✗"}
            </p>
          )}

          {/* Indicadores */}
          <ul className="text-xs text-gray-400 space-y-1">
            <li className={passwordValid.upper ? "text-green-400" : "text-gray-500"}>
              ✓ Una letra mayúscula
            </li>
            <li className={passwordValid.lower ? "text-green-400" : "text-gray-500"}>
              ✓ Una letra minúscula
            </li>
            <li className={passwordValid.number ? "text-green-400" : "text-gray-500"}>
              ✓ Un número
            </li>
            <li className={passwordValid.length ? "text-green-400" : "text-gray-500"}>
              ✓ Al menos 8 caracteres
            </li>
            <li className={passwordValid.special ? "text-green-400" : "text-gray-500"}>
<<<<<<< Updated upstream
            ✓ Un carácter especial permitido (@ . _ * -)
=======
<<<<<<< HEAD
              ✓ Un carácter especial permitido (@ . _ * -)
=======
            ✓ Un carácter especial permitido (@ . _ * -)
>>>>>>> origin/David
>>>>>>> Stashed changes
            </li>
          </ul>

          {/* Barra de fuerza */}
          <div className="h-2 w-full bg-gray-800 rounded-xl overflow-hidden">
            <div
<<<<<<< Updated upstream
              className={`h-full transition-all duration-500 ${
                ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"][passwordScore]
              }`}
=======
<<<<<<< HEAD
              className={`h-full transition-all duration-500 ${["bg-red-500", "bg-orange-500", "bg-[#D4AF37]", "bg-green-400", "bg-green-600"][passwordScore]
                }`}
=======
              className={`h-full transition-all duration-500 ${
                ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-600"][passwordScore]
              }`}
>>>>>>> origin/David
>>>>>>> Stashed changes
              style={{ width: `${(passwordScore + 1) * 20}%` }}
            ></div>
          </div>

          {/* Cookies */}
          <label className="flex items-center text-sm text-gray-400 gap-2">
            <input
              type="checkbox"
              checked={cookiesAccepted}
              onChange={(e) => setCookiesAccepted(e.target.checked)}
<<<<<<< Updated upstream
              className="accent-yellow-500"
=======
<<<<<<< HEAD
              className="accent-[#D4AF37]"
=======
              className="accent-yellow-500"
>>>>>>> origin/David
>>>>>>> Stashed changes
            />
            Acepto las cookies y términos de privacidad
          </label>

          {/* Botón de registro */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={!passwordMatch}
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
            className={`w-full font-semibold py-3 rounded-xl shadow-lg transition ${passwordMatch
              ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-black hover:shadow-yellow-500/40"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
=======
>>>>>>> Stashed changes
            className={`w-full font-semibold py-3 rounded-xl shadow-lg transition ${
              passwordMatch
                ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-black hover:shadow-yellow-500/40"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
<<<<<<< Updated upstream
=======
>>>>>>> origin/David
>>>>>>> Stashed changes
          >
            Registrarme
          </motion.button>

          {/* Google */}
          <div className="flex justify-center mt-5">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform hover:scale-105">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Error con Google")}
                theme="outline"
                size="large"
                shape="pill"
                text="signin_with"
              />
            </div>
          </div>
        </div>

        <p className="text-sm mt-6 text-center text-gray-400">
          ¿Ya tienes cuenta?{" "}
<<<<<<< Updated upstream
          <a href="/login" className="text-yellow-500 font-semibold hover:underline">
=======
<<<<<<< HEAD
          <a href="/login" className="text-[#D4AF37] font-semibold hover:underline">
=======
          <a href="/login" className="text-yellow-500 font-semibold hover:underline">
>>>>>>> origin/David
>>>>>>> Stashed changes
            Inicia sesión
          </a>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
