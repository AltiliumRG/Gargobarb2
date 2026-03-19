import React from "react";
import { InputPro } from "../Shared/InputPro";
import { TextareaPro } from "../Shared/TextareaPro";
import { uploadSiteImage } from "../../../../api/upload.api";

export default function TestimonialsEditor({ content, handleContent }) {
  const items = content.items || [];

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    handleContent("items", updated);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    handleContent("items", updated);
  };

  const addItem = () => {
    const updated = [
      ...items,
      {
        name: "Nuevo cliente",
        comment: "Comentario...",
        rating: 5,
        image: ""
      }
    ];
    handleContent("items", updated);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[#0b1220] to-[#0f172a] border border-gray-800 rounded-2xl p-6 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-yellow-400 tracking-wide">Sección Testimonios</h3>
          <span className="text-xs text-gray-500">Opiniones de clientes</span>
        </div>

        <InputPro
          placeholder="Título sección"
          value={content.title}
          onChange={(value) => handleContent("title", value)}
        />
      </div>

      {items.map((item, index) => (
        <div key={index} className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-6 transition hover:border-yellow-400/40">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Testimonio #{index + 1}</span>
            <button onClick={() => removeItem(index)} className="text-xs text-red-400 hover:text-red-500 transition">Eliminar</button>
          </div>

          <div className="bg-[#111827] border border-gray-800 rounded-xl p-4 flex items-center gap-4">
            {item.image ? (
              <img src={item.image} className="w-12 h-12 rounded-full object-cover border border-yellow-400" alt="Avatar" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
                {item.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-yellow-400 font-semibold truncate">{item.name || "Nombre cliente"}</p>
              <div className="flex gap-1 text-yellow-400 text-sm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < (item.rating || 0) ? "★" : "☆"}</span>
                ))}
              </div>
            </div>
          </div>

          <InputPro placeholder="Nombre cliente" value={item.name} onChange={(value) => updateItem(index, "name", value)} />
          <TextareaPro placeholder="Comentario" value={item.comment} onChange={(value) => updateItem(index, "comment", value)} />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Rating</span>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => updateItem(index, "rating", i + 1)}
                  className={`text-xl transition ${i < (item.rating || 0) ? "text-yellow-400 scale-110" : "text-gray-600 hover:text-yellow-400"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-gray-400">Imagen cliente</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const res = await uploadSiteImage(file);
                updateItem(index, "image", res.data.url);
              }}
              className="w-full bg-gray-900 border border-gray-700 p-2 rounded-xl text-white outline-none"
            />
          </div>
        </div>
      ))}

      <button onClick={addItem} className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black py-3 rounded-xl font-bold transition active:scale-95 shadow-lg">
        + Agregar testimonio
      </button>
    </div>
  );
}
