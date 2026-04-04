import React, { useState } from "react";
import { InputPro } from "../Shared/InputPro";
import { TextareaPro } from "../Shared/TextareaPro";

export default function AboutEditor({
  content,
  styles,
  handleContent,
  handleStyle,
}) {

  const barbers = content.barbers || [];
  const features = content.features || [];

  const [uploadingIndex, setUploadingIndex] = useState(null);

  // =========================
  // 💈 BARBEROS
  // =========================

  const addBarber = () => {
    handleContent("barbers", [
      ...barbers,
      { name: "", role: "", image: "" }
    ]);
  };

  const updateBarber = (index, field, value) => {
    const updated = barbers.map((b, i) =>
      i === index ? { ...b, [field]: value } : b
    );
    handleContent("barbers", updated);
  };

  const removeBarber = (index) => {
    handleContent("barbers", barbers.filter((_, i) => i !== index));
  };

  const handleUpload = async (file, index) => {
    if (!file) return;

    setUploadingIndex(index);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // Usamos ruta relativa para aprovechar el proxy de Vite
      const res = await fetch("/api/uploads/avatar", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      updateBarber(index, "image", data.avatar_url);

    } catch (err) {
      console.error("Error subiendo imagen", err);
    } finally {
      setUploadingIndex(null);
    }
  };

  // =========================
  // ✨ FEATURES (CARD DERECHA)
  // =========================

  const addFeature = () => {
    handleContent("features", [...features, "Nuevo feature"]);
  };

  const updateFeature = (index, value) => {
    const updated = features.map((f, i) =>
      i === index ? value : f
    );
    handleContent("features", updated);
  };

  const removeFeature = (index) => {
    handleContent("features", features.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">

      {/* ========================= */}
      {/* 🔹 CONTENIDO BASE */}
      {/* ========================= */}

      <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 space-y-5">

        <h3 className="text-sm font-semibold text-yellow-400">
          Sección About
        </h3>

        <InputPro
          placeholder="Título"
          value={content.title}
          onChange={(v) => handleContent("title", v)}
        />

        <TextareaPro
          placeholder="Descripción"
          value={content.text}
          onChange={(v) => handleContent("text", v)}
        />

        {/* 🔥 TAGLINE */}
        <InputPro
          placeholder="Tagline (Experiencia premium...)"
          value={content.tagline || ""}
          onChange={(v) => handleContent("tagline", v)}
        />

        {/* 🎯 ALIGN */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Alineación</span>

          <select
            value={styles.align || "left"}
            onChange={(e) => handleStyle("align", e.target.value)}
            className="bg-gray-900 border border-gray-700 p-2 rounded-xl text-white"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
          </select>
        </div>

        {/* 🔥 TOGGLE PRO */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Mostrar máquina</span>

          <button
            onClick={() =>
              handleContent("showMachine", !(content.showMachine ?? true))
            }
            className={`
              w-14 h-7 rounded-full transition relative
              ${content.showMachine ? "bg-yellow-500" : "bg-gray-700"}
            `}
          >
            <div
              className={`
                absolute top-1 w-5 h-5 bg-white rounded-full transition
                ${content.showMachine ? "left-8" : "left-1"}
              `}
            />
          </button>
        </div>

      </div>

      {/* ========================= */}
      {/* ✨ FEATURES EDITABLE */}
      {/* ========================= */}

      <div className="bg-[#020617] border border-gray-800 rounded-2xl p-6 space-y-4">

        <div className="flex justify-between">
          <h3 className="text-yellow-400 text-sm">Features (Card derecha)</h3>

          <button
            onClick={addFeature}
            className="text-xs bg-yellow-500 px-3 py-1 rounded"
          >
            + Añadir
          </button>
        </div>

        {features.map((f, i) => (
          <div key={i} className="flex gap-2">

            <input
              value={f}
              onChange={(e) => updateFeature(i, e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700 p-2 rounded text-white"
            />

            <button
              onClick={() => removeFeature(i)}
              className="text-red-400 text-xs"
            >
              X
            </button>

          </div>
        ))}

      </div>

      {/* ========================= */}
      {/* 💈 TITULOS BARBEROS */}
      {/* ========================= */}

      <div className="bg-[#020617] border border-gray-800 rounded-2xl p-6 space-y-4">

        <h3 className="text-yellow-400 text-sm">
          Sección Barberos
        </h3>

        <InputPro
          placeholder="Título (Nuestros barberos)"
          value={content.barbersTitle || ""}
          onChange={(v) => handleContent("barbersTitle", v)}
        />

        <InputPro
          placeholder="Subtítulo"
          value={content.barbersSubtitle || ""}
          onChange={(v) => handleContent("barbersSubtitle", v)}
        />

      </div>

      {/* ========================= */}
      {/* 💈 BARBEROS */}
      {/* ========================= */}

      <div className="bg-[#020617] border border-gray-800 rounded-2xl p-6 space-y-5">

        <div className="flex justify-between">
          <h3 className="text-yellow-400 text-sm">Barberos</h3>

          <button
            onClick={addBarber}
            className="text-xs bg-yellow-500 px-3 py-1 rounded"
          >
            + Añadir
          </button>
        </div>

        {barbers.map((barber, i) => (
          <div key={i} className="bg-black/40 p-4 rounded-xl space-y-3">

            <InputPro
              placeholder="Nombre"
              value={barber.name}
              onChange={(v) => updateBarber(i, "name", v)}
            />

            <InputPro
              placeholder="Rol"
              value={barber.role}
              onChange={(v) => updateBarber(i, "role", v)}
            />

            {/* 📤 UPLOAD */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files[0], i)}
              className="text-xs"
            />

            {uploadingIndex === i && (
              <p className="text-yellow-400 text-xs">
                Subiendo...
              </p>
            )}

            {barber.image && (
              <img
                src={barber.image}
                className="w-full h-28 object-cover rounded"
              />
            )}

            <button
              onClick={() => removeBarber(i)}
              className="text-red-400 text-xs"
            >
              Eliminar
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}