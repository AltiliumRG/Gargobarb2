import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Camera, Save, Upload, X, SwitchCamera, Check, Phone, Mail, UserCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../api/axios";

export default function ProfileSection({ user, login }) {
    const [profileData, setProfileData] = useState({
        username: user?.username || "",
        full_name: user?.full_name || "",
        email: user?.email || "",
        phone: user?.phone || "",
    });

    const [avatarMode, setAvatarMode] = useState(null); // null | "camera" | "upload"
    const [stream, setStream] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

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
            toast.error("No se pudo acceder a la cámara.");
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
            login(res.data.user);
            setCapturedPhoto(null);
            setAvatarMode(null);
        } catch (err) {
            toast.error("Error al guardar la foto");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const res = await api.post("/users/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success("Foto de perfil actualizada ✅");
            login(res.data.user);
            setAvatarMode(null);
        } catch (err) {
            toast.error("Error al subir imagen");
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await api.put("/users/profile", profileData);
            login(res.data.user);
            toast.success("Perfil actualizado correctamente");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al actualizar perfil");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Mi Perfil</h2>
                    <p className="text-gray-400 text-sm">Gestiona tu información personal y cuenta de acceso.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AVATAR CARD */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-6">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full border-4 border-yellow-500/20 overflow-hidden bg-zinc-800 flex items-center justify-center">
                                {capturedPhoto ? (
                                    <img src={capturedPhoto} alt="Preview" className="w-full h-full object-cover" />
                                ) : user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={64} className="text-zinc-600" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setAvatarMode(avatarMode ? null : "menu")}
                                className="absolute bottom-1 right-1 bg-yellow-500 p-3 rounded-full text-black hover:scale-110 transition shadow-xl"
                            >
                                <Camera size={20} />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 text-center px-4">
                            Sube una foto cuadrada para obtener mejores resultados en tu perfil público.
                        </p>

                        <AnimatePresence>
                            {avatarMode === "menu" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="w-full space-y-2 pt-4 border-t border-white/5"
                                >
                                    <button
                                        onClick={openCamera}
                                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                                    >
                                        <SwitchCamera size={16} /> Usar Cámara
                                    </button>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
                                    >
                                        <Upload size={16} /> Subir Archivo
                                    </button>
                                </motion.div>
                            )}

                            {avatarMode === "camera" && !capturedPhoto && (
                                <motion.div className="w-full space-y-4 pt-4 border-t border-white/5">
                                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
                                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                                        <canvas ref={canvasRef} className="hidden" />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={stopCamera} className="flex-1 py-2 bg-zinc-800 text-white rounded-lg text-xs">Cancelar</button>
                                        <button onClick={capturePhoto} className="flex-1 py-2 bg-yellow-500 text-black font-bold rounded-lg text-xs">Capturar</button>
                                    </div>
                                </motion.div>
                            )}

                            {capturedPhoto && (
                                <motion.div className="w-full space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex gap-2">
                                        <button onClick={() => setCapturedPhoto(null)} className="flex-1 py-2 bg-zinc-800 text-white rounded-lg text-xs">Reintentar</button>
                                        <button onClick={savePhoto} disabled={uploadingAvatar} className="flex-1 py-2 bg-yellow-500 text-black font-bold rounded-lg text-xs flex items-center justify-center gap-2">
                                            {uploadingAvatar ? <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" /> : "Guardar"}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>
                </div>

                {/* FORM CARD */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 block px-1">Nombre de Usuario</label>
                                <div className="relative">
                                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/5 text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="Tu username"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 block px-1">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/5 text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="Tu nombre completo"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 block px-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/5 text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="tu@correo.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-widest font-black text-gray-500 block px-1">Número de Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/5 text-white focus:border-yellow-500 outline-none transition"
                                        placeholder="Ej: +57 321 000 0000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center gap-2 px-10 py-4 bg-white text-black font-black rounded-xl hover:bg-yellow-500 transition active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={20} />}
                                {isSaving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
