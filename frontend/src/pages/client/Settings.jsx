import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    User,
    Lock,
    Palette,
    AlertTriangle,
    Save,
    X,
    Menu,
    ArrowLeft
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";
import toast from "react-hot-toast";

// Modular Sections
import AccountSection from "./SettingsSections/AccountSection";
import SecuritySection from "./SettingsSections/SecuritySection";
import AppearanceSection from "./SettingsSections/AppearanceSection";
import DangerSection from "./SettingsSections/DangerSection";

/**
 * Settings Component
 * 
 * Main container for user settings. Handles:
 * - Navigation between sections (Account, Security, Appearance, Danger Zone)
 * - Global state for unsaved changes
 * - API calls for profile and password updates
 * - Theme switching logic
 */
const Settings = () => {
    const { user, login, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();

    // --- LOCAL STATE ---
    const [localTheme, setLocalTheme] = useState(theme);
    const isClassic = localTheme === "classic";
    const [activeSection, setActiveSection] = useState("cuenta");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [accountData, setAccountData] = useState({
        username: user?.username || "",
        full_name: user?.full_name || "",
        email: user?.email || "",
    });

    // ============================================================
    // Change Detection
    // ============================================================
    const hasUnsavedChanges = () => {
        const accountChanged =
            accountData.username !== (user?.username || "") ||
            accountData.full_name !== (user?.full_name || "") ||
            accountData.email !== (user?.email || "");

        const themeChanged = localTheme !== theme;

        return accountChanged || themeChanged;
    };

    // ============================================================
    // Handlers
    // ============================================================
    const handleBack = () => {
        if (hasUnsavedChanges()) {
            const confirm = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?");
            if (!confirm) return;
        }
        navigate(-1);
    };

    const handleGlobalSave = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            // 1. Theme Update
            if (localTheme !== theme) {
                setTheme(localTheme);
            }

            // Profile Update
            const accountChanged =
                accountData.username !== (user?.username || "") ||
                accountData.full_name !== (user?.full_name || "") ||
                accountData.email !== (user?.email || "");

            if (accountChanged) {
                const res = await api.put("/users/profile", accountData);
                login(res.data.user);
            }

            toast.success("Todos los cambios guardados correctamente");
        } catch (err) {
            toast.error(err.message || err.response?.data?.error || "Error al guardar cambios");
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

    // ============================================================
    // Render Functions
    // ============================================================
    const renderActiveSection = () => {
        const commonProps = {
            isClassic,
            handleBack,
            handleGlobalSave,
            loading
        };

        switch (activeSection) {
            case "cuenta":
                return (
                    <AccountSection 
                        {...commonProps} 
                        user={user} 
                        accountData={accountData} 
                        setAccountData={setAccountData}
                        onAvatarUpdate={(updatedUser) => login(updatedUser)}
                    />
                );
            case "seguridad":
                return (
                    <SecuritySection 
                        {...commonProps} 
                        user={user} 
                    />
                );
            case "apariencia":
                return (
                    <AppearanceSection 
                        {...commonProps} 
                        localTheme={localTheme} 
                        setLocalTheme={setLocalTheme} 
                        hasUnsavedChanges={hasUnsavedChanges} 
                    />
                );
            case "danger":
                return (
                    <DangerSection 
                        logout={logout} 
                        handleDeleteAccount={handleDeleteAccount} 
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isClassic ? "text-white" : "text-[#1C1C1C]"}`}>
            <div className="w-full mx-auto flex flex-col lg:flex-row h-screen overflow-hidden">
                
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
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all mb-4 ${isClassic ? "text-gray-400 hover:bg-white/5" : "text-gray-500 hover:bg-gray-100"}`}
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

                {/* MAIN CONTENT Area */}
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
                                className={`p-2 rounded-lg transition-all ${hasUnsavedChanges() ? "bg-yellow-500 text-black animate-pulse" : "bg-zinc-800 text-gray-600"}`}
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
                            {renderActiveSection()}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;
