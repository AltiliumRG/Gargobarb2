import React from "react";
import { InputPro } from "../Shared/InputPro";

export default function CartEditor({ content, styles, handleContent, handleStyle }) {
  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">Carrito de Compras</h3>
          <span className="text-xs text-gray-500">Ventas directas</span>
        </div>

        <InputPro
          label="Título de la sección"
          placeholder="Ej: Nuestros Productos"
          value={content.title}
          onChange={(value) => handleContent("title", value)}
        />

        <InputPro
          label="Texto del botón"
          placeholder="Ej: Añadir al carrito"
          value={content.buttonText}
          onChange={(value) => handleContent("buttonText", value)}
        />
      </div>

      {/* COLORS CARD */}
      <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Apariencia</h4>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Color Botones</span>
          <input
            type="color"
            value={styles.buttonColor || "#facc15"}
            onChange={(e) => handleStyle("buttonColor", e.target.value)}
            className="w-10 h-8 rounded bg-transparent border border-gray-700 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Fondo Sección</span>
          <input
            type="color"
            value={styles.backgroundColor || "#ffffff"}
            onChange={(e) => handleStyle("backgroundColor", e.target.value)}
            className="w-10 h-8 rounded bg-transparent border border-gray-700 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Fondo Tarjetas</span>
          <input
            type="color"
            value={styles.cardBackgroundColor || "#ffffff"}
            onChange={(e) => handleStyle("cardBackgroundColor", e.target.value)}
            className="w-10 h-8 rounded bg-transparent border border-gray-700 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Color de texto</span>
          <input
            type="color"
            value={styles.textColor || "#000000"}
            onChange={(e) => handleStyle("textColor", e.target.value)}
            className="w-10 h-8 rounded bg-transparent border border-gray-700 cursor-pointer"
          />
        </div>
      </div>

      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <p className="text-xs text-yellow-500/80 leading-relaxed italic">
          Tip: Los productos se gestionan desde la sección de "Inventario" de tu barbería. Aquí solo editas cómo se ven en la web.
        </p>
      </div>
    </div>
  );
}
