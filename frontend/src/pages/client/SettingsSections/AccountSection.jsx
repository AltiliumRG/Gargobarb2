import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Camera, Save, Upload, X, SwitchCamera, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

export default function AccountSection({ 
    user, 
    accountData, 
    setAccountData, 
    handleGlobalSave, 
    handleBack, 
    loading, 
    isClassic,
    onAvatarUpdate,
}) {
    const [avatarMode, setAvatarMode] = useState(null); // null | "camera" | "upload"
    const [stream, setStream] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    /* ============= CÁMARA ============= */
    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
            setStream(mediaStream);
            setAvatarMode("camera");
            setCapturedPhoto(null);
            setTimeout(() => {
                if (videoRef.current) videoRef.current.srcObject = mediaStream;
            }, 100);
        } catch (err) {
            toast.error("No se pudo acceder a la cámara. Verifica los permisos.");
        }
    };

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
            setStream(null);
        }
        setAvatarMode(null);
        setCapturedPhoto(null);
    }, [stream]);

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL("image/jpeg");
        setCapturedPhoto(photoDataUrl);
        stream?.getTracks().forEach(t => t.stop());
        setStream(null);
    };

    const savePhoto = async () => {
        if (!capturedPhoto) return;
        setUploadingAvatar(true);
        try {
            const blob = await (await fetch(capturedPhoto)).blob();
            const formData = new FormData();
            formData.append("avatar", blob, "photo.jpg");
            const res = await api.post("/users/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Foto de perfil actualizada ✅");
            if (onAvatarUpdate) onAvatarUpdate(res.data.user);
            setCapturedPhoto(null);
            setAvatarMode(null);
            stopCamera();
        } catch (err) {
            toast.error("Error al guardar la foto");
        } finally {
            setUploadingAvatar(false);
        }
    };

    /* ============= SUBIR ARCHIVO ============= */
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) return toast.error("Solo se permiten imágenes");
        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const res = await api.post("/users/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Foto de perfil actualizada ✅");
            if (onAvatarUpdate) onAvatarUpdate(res.data.user);
            setAvatarMode(null);
        } catch (err) {
            toast.error("Error al subir imagen");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const currentAvatar = user?.avatar_url;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            {/* AVATAR */}
            <div className="flex flex-col md:flex-row md:items-center gap-8 pb-8 border-b border-white/5">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-2 border-yellow-500/30 overflow-hidden bg-zinc-900 flex items-center justify-center">
                        {capturedPhoto ? (
                            <img src={capturedPhoto} alt="Preview" className="w-full h-full object-cover" />
                        ) : currentAvatar ? (
                            <img
                                src={currentAvatar.startsWith("http") ? currentAvatar : currentAvatar}
                                alt="Profile"
                                className="w-full h-full object-cover shadow-inner"
                                key={currentAvatar} // Force reload on update
                            />
                        ) : (
                            <User size={48} className="text-gray-600 animate-pulse" />
                        )}
                    </div>
                    {/* Botón de cámara */}
                    <button
                        type="button"
                        onClick={() => setAvatarMode(avatarMode ? null : "menu")}
                        disabled={uploadingAvatar}
                        className="absolute bottom-0 right-0 bg-yellow-500 p-2 rounded-full text-black hover:scale-110 transition shadow-lg disabled:opacity-50"
                    >
                        {uploadingAvatar ? (
                            <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
                        ) : (
                            <Camera size={16} />
                        )}
                    </button>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-1">Tu Perfil</h2>
                    <p className={isClassic ? "text-gray-400" : "text-gray-500"}>Administra la información pública de tu cuenta.</p>
                    <p className="text-xs text-yellow-500/80 mt-2">Haz clic en la cámara para cambiar tu foto</p>
                </div>
            </div>

            {/* MODAL DE AVATAR */}
            <AnimatePresence>
                {avatarMode && avatarMode !== "camera" && !capturedPhoto && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-2xl border border-yellow-500/20 bg-zinc-900/80 backdrop-blur p-5 flex flex-col gap-3"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-black uppercase tracking-widest text-yellow-500">Cambiar foto de perfil</p>
                            <button onClick={() => setAvatarMode(null)} className="text-gray-500 hover:text-white transition">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={openCamera}
                                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-yellow-500/10 hover:border-yellow-500/40 transition group"
                            >
                                <SwitchCamera size={28} className="text-gray-400 group-hover:text-yellow-400 transition" />
                                <span className="text-sm font-bold text-gray-300 group-hover:text-white">Usar Cámara</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-yellow-500/10 hover:border-yellow-500/40 transition group"
                            >
                                <Upload size={28} className="text-gray-400 group-hover:text-yellow-400 transition" />
                                <span className="text-sm font-bold text-gray-300 group-hover:text-white">Subir Archivo</span>
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </motion.div>
                )}

                {/* Vista Cámara en vivo */}
                {avatarMode === "camera" && !capturedPhoto && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-2xl overflow-hidden border border-yellow-500/20 bg-black"
                    >
                        <div className="relative">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-[340px] object-cover" />
                            <canvas ref={canvasRef} className="hidden" />
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={stopCamera}
                                    className="px-5 py-2.5 rounded-xl bg-black/60 text-white text-sm font-bold border border-white/20 hover:bg-red-600 transition flex items-center gap-2"
                                >
                                    <X size={16} /> Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={capturePhoto}
                                    className="px-6 py-2.5 rounded-xl bg-yellow-500 text-black text-sm font-black hover:bg-yellow-400 transition flex items-center gap-2 shadow-lg shadow-yellow-500/30"
                                >
                                    <Camera size={16} /> Tomar Foto
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Foto Capturada - Confirmar */}
                {capturedPhoto && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl overflow-hidden border border-yellow-500/30 bg-black"
                    >
                        <img src={capturedPhoto} alt="Foto capturada" className="w-full max-h-[280px] object-cover" />
                        <div className="p-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => { setCapturedPhoto(null); setAvatarMode("menu"); }}
                                className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 text-sm font-bold hover:bg-white/5 transition flex items-center justify-center gap-2"
                            >
                                <X size={16} /> Reintentar
                            </button>
                            <button
                                type="button"
                                onClick={savePhoto}
                                disabled={uploadingAvatar}
                                className="flex-1 py-3 rounded-xl bg-yellow-500 text-black text-sm font-black hover:bg-yellow-400 transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/20 disabled:opacity-60"
                            >
                                {uploadingAvatar ? (
                                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : <Check size={16} />}
                                {uploadingAvatar ? "Guardando..." : "Usar esta foto"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FORMULARIO */}
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
