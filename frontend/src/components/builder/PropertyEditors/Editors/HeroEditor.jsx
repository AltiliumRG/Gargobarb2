import React from "react";
import { InputPro } from "../Shared/InputPro";
import { TextareaPro } from "../Shared/TextareaPro";
import { UploadDropzone } from "../Shared/UploadDropzone";

export default function HeroEditor({ content, styles, handleContent, handleStyle }) {
  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">Hero principal</h3>
          <span className="text-xs text-gray-500">Sección destacada</span>
        </div>

        <InputPro
          placeholder="Título principal"
          value={content.title}
          onChange={(value) => handleContent("title", value)}
        />

        <InputPro
          placeholder="Subtítulo"
          value={content.subtitle}
          onChange={(value) => handleContent("subtitle", value)}
        />

        <TextareaPro
          placeholder="Texto descriptivo (opcional)"
          value={content.text}
          onChange={(value) => handleContent("text", value)}
        />

        <InputPro
          placeholder="Texto del botón"
          value={content.buttonText}
          onChange={(value) => handleContent("buttonText", value)}
        />
      </div>

      {/* IMAGE UPLOAD */}
      <UploadDropzone
        label="Imagen de fondo"
        onUpload={(url) => handleContent("image", url)}
        currentImage={content.image}
        onRemove={() => handleContent("image", "")}
      />

      {/* BUTTON STYLE */}
      <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm text-gray-400">Estilo del botón</h4>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Color botón</span>
          <input
            type="color"
            value={styles.buttonColor || "#facc15"}
            onChange={(e) => handleStyle("buttonColor", e.target.value)}
            className="w-12 h-8 rounded cursor-pointer border border-gray-700 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
