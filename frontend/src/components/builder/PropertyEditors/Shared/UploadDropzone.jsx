import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { uploadSiteImage } from "../../../../api/upload.api";

export function UploadDropzone({ label, sublabel, onUpload, currentImage, onRemove }) {
  const [loading, setLoading] = useState(false);

  const uploadImageAndSet = async (file) => {
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadSiteImage(file);
      onUpload(res.data.url);
    } catch (err) {
      console.error("❌ Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-4">
      {label && <h4 className="text-sm text-gray-400">{label}</h4>}
      
      <label 
        className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-6 transition bg-gray-900/50 
          ${loading ? 'border-yellow-400/50 cursor-not-allowed opacity-50' : 'border-gray-700 hover:border-yellow-400 cursor-pointer hover:bg-gray-900'}`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            <span className="text-xs text-yellow-500 font-medium">Subiendo imagen...</span>
          </div>
        ) : (
          <>
            <span className="text-sm text-gray-400">{sublabel || "Click o arrastra imagen"}</span>
            <span className="text-xs text-gray-600">Recomendado: alta resolución</span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={loading}
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
