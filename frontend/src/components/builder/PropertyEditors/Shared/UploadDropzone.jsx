import React from "react";
import { uploadSiteImage } from "../../../../api/upload.api";

export function UploadDropzone({ label, sublabel, onUpload, currentImage, onRemove }) {
  const uploadImageAndSet = async (file) => {
    if (!file) return;
    try {
      const res = await uploadSiteImage(file);
      onUpload(res.data.url);
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  };

  return (
    <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-4">
      {label && <h4 className="text-sm text-gray-400">{label}</h4>}
      
      <label className="relative flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-700 hover:border-yellow-400 rounded-xl p-6 cursor-pointer transition bg-gray-900/50 hover:bg-gray-900">
        <span className="text-sm text-gray-400">{sublabel || "Click o arrastra imagen"}</span>
        <span className="text-xs text-gray-600">Recomendado: alta resolución</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => uploadImageAndSet(e.target.files[0])}
        />
      </label>

      {currentImage && (
        <div className="relative group rounded-xl overflow-hidden border border-gray-800">
          <img src={currentImage} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" alt="Preview" />
          {onRemove && (
            <button
              onClick={onRemove}
              className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
