import React from "react";
import { InputPro } from "../Shared/InputPro";
import { TextareaPro } from "../Shared/TextareaPro";
import { SwitchPro } from "../Shared/SwitchPro";

export default function ContactEditor({ content, styles, handleContent, handleStyle }) {
  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">Contacto</h3>
          <span className="text-xs text-gray-500">Información y link</span>
        </div>

        <InputPro
          label="Título"
          placeholder="Ej: Contáctanos"
          value={content.title}
          onChange={(value) => handleContent("title", value)}
        />

        <TextareaPro
          label="Descripción"
          placeholder="Ej: Estamos aquí para ayudarte..."
          value={content.text}
          onChange={(value) => handleContent("text", value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <InputPro
            label="Teléfono / WhatsApp"
            placeholder="Ej: +57 300..."
            value={content.phone}
            onChange={(value) => handleContent("phone", value)}
          />
          <InputPro
            label="Email"
            placeholder="Ej: hola@tuweb.com"
            value={content.email}
            onChange={(value) => handleContent("email", value)}
          />
        </div>

        <InputPro
          label="Dirección"
          placeholder="Ej: Calle 10 #20-30"
          value={content.address}
          onChange={(value) => handleContent("address", value)}
        />
      </div>

      {/* OPTIONS CARD */}
      <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Visibilidad de elementos</h4>
        
        <SwitchPro
          label="Mostrar Mapa"
          checked={content.showMap}
          onChange={(val) => handleContent("showMap", val)}
        />

        <SwitchPro
          label="Link a WhatsApp"
          checked={content.showWhatsapp}
          onChange={(val) => handleContent("showWhatsapp", val)}
        />

        <SwitchPro
          label="Habilitar Formulario"
          checked={content.formEnabled}
          onChange={(val) => handleContent("formEnabled", val)}
        />
      </div>

      {/* COLORS CARD */}
      <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-4">
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Apariencia</h4>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Color de fondo</span>
          <input
            type="color"
            value={styles.backgroundColor || "#000000"}
            onChange={(e) => handleStyle("backgroundColor", e.target.value)}
            className="w-10 h-8 rounded bg-transparent border border-gray-700 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Color de texto</span>
          <input
            type="color"
            value={styles.textColor || "#ffffff"}
            onChange={(e) => handleStyle("textColor", e.target.value)}
            className="w-10 h-8 rounded bg-transparent border border-gray-700 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
