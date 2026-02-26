import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    User,
    Lock,
    Palette,
    AlertTriangle,
    Save,
    LogOut,
    Trash2,
    CheckCircle,
    Menu,
    X,
    Camera,
    ArrowLeft
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/api";
import toast from "react-hot-toast";

const Settings = () => {
    const { user, login, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    // --- ESTADOS LOCALES ---
    const [localTheme, setLocalTheme] = useState(theme);
    const isClassic = localTheme === "classic";
    const [activeSection, setActiveSection] = useState("cuenta");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Datos de cuenta
    const [accountData, setAccountData] = useState({
        username: user?.username || "",
        full_name: user?.full_name || "",
        email: user?.email || "",
    });

    // Seguridad
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // --- DETECCIÓN DE CAMBIOS ---
    const hasUnsavedChanges = () => {
        const accountChanged =
            accountData.username !== (user?.username || "") ||
            accountData.full_name !== (user?.full_name || "") ||
            accountData.email !== (user?.email || "");

        const passwordChanged =
            passwordData.currentPassword !== "" ||
            passwordData.newPassword !== "" ||
            passwordData.confirmPassword !== "";

        const themeChanged = localTheme !== theme;

        return accountChanged || passwordChanged || themeChanged;
    };

    // --- HANDLERS ---
    const handleBack = () => {
        if (hasUnsavedChanges()) {
            const confirm = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?");
            if (!confirm) return;
        }
        navigate(-1);
    };

    const handleGlobalSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Aplicar Tema
            if (localTheme !== theme) {
                setTheme(localTheme);
            }

            // Aplicar Cuenta si hay cambios
            const accountChanged =
                accountData.username !== (user?.username || "") ||
                accountData.full_name !== (user?.full_name || "") ||
                accountData.email !== (user?.email || "");

            if (accountChanged) {
                const res = await api.put("/users/profile", accountData);
                login(res.data.user);
            }

            // Aplicar Seguridad si hay campos llenos
            if (passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    throw new Error("Las contraseñas no coinciden");
                }
                await api.put("/auth/update-password", {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                });
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }

            toast.success("Todos los cambios guardados correctamente");
        } catch (err) {
            toast.error(err.message || err.response?.data?.error || "Error al guardar cambios");
        } finally {
            setLoading(false);
        }
    };

    const handleAccountUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put("/users/profile", accountData);
            login(res.data.user); // Actualizamos el contexto global
            toast.success("Perfil actualizado con éxito");
        } catch (err) {
            toast.error(err.response?.data?.error || "Error al actualizar perfil");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Las contraseñas no coinciden");
        }
        setLoading(true);
        try {
            await api.put("/auth/update-password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Contraseña actualizada");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            toast.error(err.response?.data?.error || "Error al actualizar contraseña");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirm = window.confirm("¿Estás ABSOLUTAMENTE seguro? Esta acción es irreversible y perderás todos tus datos.");
        if (confirm) {
            try {
                await api.delete("/users/profile");
                toast.success("Cuenta eliminada");
                logout();
            } catch (err) {
                toast.error("Error al eliminar cuenta");
            }
        }
    };

    // --- COMPONENTES DE SECCIÓN ---

    const SectionAccount = () => (
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

    const SectionSecurity = () => (
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

    const SectionAppearance = () => (
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

    const SectionDanger = () => (
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

    // --- RENDERIZADO PRINCIPAL ---

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isClassic ? "bg-[#0F0F0F] text-white" : "bg-[#F8F6F2] text-[#1C1C1C]"}`}>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row h-screen overflow-hidden">

                {/* SIDEBAR */}
                <aside className={`
                    lg:w-80 lg:block border-r transition-all duration-300 z-40
                    ${isSidebarOpen ? "fixed inset-0 bg-black/50" : "hidden lg:relative"}
                    ${isClassic ? "bg-[#0B0B0B] border-white/5" : "bg-white border-gray-100 shadow-xl"}
                `}>
                    <div className={`h-full lg:w-full w-64 p-6 flex flex-col ${isClassic ? "bg-[#0B0B0B]" : "bg-white"}`}>
                        <div className="mb-10 flex items-center justify-between">
                            <h1 className="text-2xl font-black italic tracking-tighter text-[#C6A75E]">CONFIG</h1>
                            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                                <X />
                            </button>
                        </div>

                        <nav className="flex-1 space-y-2">
                            <button
                                onClick={handleBack}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all mb-4 ${isClassic ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-100"
                                    }`}
                            >
                                <ArrowLeft size={20} />
                                Volver
                            </button>

                            {[
                                { id: "cuenta", label: "Cuenta", icon: <User size={20} /> },
                                { id: "seguridad", label: "Seguridad", icon: <Lock size={20} /> },
                                { id: "apariencia", label: "Apariencia", icon: <Palette size={20} /> },
                                { id: "danger", label: "Zona Peligrosa", icon: <AlertTriangle size={20} /> }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeSection === item.id
                                        ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/20"
                                        : isClassic ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-100"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="space-y-4 mt-auto">
                            <button
                                onClick={handleGlobalSave}
                                disabled={loading}
                                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase text-xs transition-all shadow-lg ${hasUnsavedChanges()
                                    ? (isClassic ? "bg-[#C6A75E] text-black animate-pulse" : "bg-black text-white animate-pulse")
                                    : (isClassic ? "bg-zinc-800 text-gray-500" : "bg-gray-100 text-gray-400 cursor-not-allowed")
                                    }`}
                            >
                                <Save size={16} /> {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>

                            <div className={`p-6 bg-gradient-to-br rounded-3xl mt-auto ${isClassic ? "from-zinc-900 to-black border border-white/5" : "from-gray-50 to-gray-200 border border-gray-200"}`}>
                                <p className="text-[10px] uppercase tracking-widest font-black text-gray-500 mb-2">Usuario Autenticado</p>
                                <p className="font-bold truncate">{user?.username || "GargoUser"}</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-1 overflow-y-auto">
                    {/* Header Mobile */}
                    <header className={`lg:hidden p-6 flex items-center justify-between border-b sticky top-0 z-30 backdrop-blur-md ${isClassic ? "bg-[#0F0F0F]/80 border-white/5" : "bg-white/80 border-gray-100"}`}>
                        <div className="flex items-center gap-4">
                            <button onClick={handleBack} className="text-yellow-500">
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-lg font-bold border-l-4 border-yellow-500 pl-3">Panel de Usuario</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleGlobalSave}
                                className={`p-2 rounded-lg transition-all ${hasUnsavedChanges() ? "bg-yellow-500 text-black animate-pulse" : "bg-zinc-800 text-gray-600"
                                    }`}
                            >
                                <Save size={20} />
                            </button>
                            <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-yellow-400 rounded-lg text-black">
                                <Menu />
                            </button>
                        </div>
                    </header>

                    <div className="p-8 lg:p-16 max-w-4xl">
                        <AnimatePresence mode="wait">
                            {activeSection === "cuenta" && <SectionAccount key="cuenta" />}
                            {activeSection === "seguridad" && <SectionSecurity key="seguridad" />}
                            {activeSection === "apariencia" && <SectionAppearance key="apariencia" />}
                            {activeSection === "danger" && <SectionDanger key="danger" />}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
