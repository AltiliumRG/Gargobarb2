import React from "react";
import { InputPro } from "../Shared/InputPro";
import { uploadSiteImage } from "../../../../api/upload.api";

export default function GalleryEditor({ content, handleContent, sectionId }) {
  const images = content.images || [];

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      const res = await uploadSiteImage(file);
      handleContent("images", [...images, res.data.url]);
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    handleContent("images", updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">Galería visual</h3>
          <span className="text-xs text-gray-400">{images.length} imágenes</span>
        </div>

        <InputPro
          placeholder="Título galería"
          value={content.title}
          onChange={(value) => handleContent("title", value)}
        />

        <label className="relative flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-700 hover:border-yellow-400 rounded-xl p-6 cursor-pointer transition bg-gray-900/50 hover:bg-gray-900">
          <span className="text-sm text-gray-400">Arrastra o haz click para subir imagen</span>
          <span className="text-xs text-gray-600">JPG, PNG recomendado</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files[0])}
          />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-10 border border-gray-800 rounded-2xl bg-[#0b1220]">
          No hay imágenes aún
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, i) => {
            const src = typeof img === "string" ? img : img?.url;
            return (
              <div key={`gallery-${sectionId}-${i}`} className="relative group rounded-2xl overflow-hidden border border-gray-800 hover:border-yellow-400/50 transition-all duration-300">
                <img src={src} className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110" alt={`Gallery ${i}`} />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg"
                >
                  <span className="text-[10px] font-bold">X</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
