import React from "react";
import { InputPro } from "../Shared/InputPro";
import { TextareaPro } from "../Shared/TextareaPro";

export default function AboutEditor({ content, styles, handleContent, handleStyle }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">Sección About</h3>
          <span className="text-xs text-gray-500">Información institucional</span>
        </div>

        <InputPro
          placeholder="Título (ej: Sobre nosotros)"
          value={content.title}
          onChange={(value) => handleContent("title", value)}
        />

        <TextareaPro
          placeholder="Descripción completa"
          value={content.text}
          onChange={(value) => handleContent("text", value)}
        />

        <div className="flex items-center justify-between text-white">
          <span className="text-sm text-gray-400">Alineación texto</span>
          <select
            value={styles.align || "center"}
            onChange={(e) => handleStyle("align", e.target.value)}
            className="bg-gray-900 border border-gray-700 p-2 rounded-xl text-white outline-none"
          >
            <option value="left">Izquierda</option>
            <option value="center">Centro</option>
            <option value="right">Derecha</option>
          </select>
        </div>
      </div>
    </div>
  );
}
