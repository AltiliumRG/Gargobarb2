import React from "react";
import { InputPro } from "../Shared/InputPro";
import { UploadDropzone } from "../Shared/UploadDropzone";

export default function GlobalSettings({ site, updateSiteSettings }) {
  return (
    <aside className="h-full flex flex-col text-white">
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <h2 className="text-lg font-bold">Ajustes Globales</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
          <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">
            Identidad & Estilo
          </h3>
          <div>
            <label className="block text-xs text-gray-400 mb-2">Nombre del Sitio</label>
            <InputPro
              placeholder="Nombre de tu barbería"
              value={site?.name}
              onChange={(val) => updateSiteSettings({ name: val })}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">Logo de la Barbería</label>
            <UploadDropzone
              label="Cambiar Logo"
              sublabel="Recomendado 1:1"
              onUpload={(url) => updateSiteSettings({ logo_url: url })}
              onRemove={() => updateSiteSettings({ logo_url: null })}
              currentImage={site?.logo_url}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">Familia de fuente</label>
            <select
              value={site?.font_family || "sans-serif"}
              onChange={(e) => updateSiteSettings({ font_family: e.target.value })}
              className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl outline-none text-white"
            >
              <option value="sans-serif">Sans Serif (Moderno)</option>
              <option value="serif">Serif (Clásico)</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Montserrat', sans-serif">Montserrat</option>
              <option value="'Playfair Display', serif">Playfair Display</option>
            </select>
          </div>
        </div>


      </div>
    </aside>
  );
}
