import React from "react";
import { InputPro } from "../Shared/InputPro";
import { TextareaPro } from "../Shared/TextareaPro";
import { updateProduct, deleteProduct } from "../../../../api/products.api";
import { uploadSiteImage } from "../../../../api/upload.api";
import toast from "react-hot-toast";

export default function ProductCardEditor({ product, index, products, setProducts, setSavingId, savingId }) {
  const updateLocalProduct = (field, val) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: val };
    setProducts(updated);
  };

  const handleSave = async (p) => {
    setSavingId(p.id);
    try {
      await updateProduct(p.id, p);
      toast.success("Producto guardado");
    } catch (err) {
      toast.error("Error al guardar");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar producto?")) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Producto eliminado");
    } catch (err) {
      toast.error("Error al eliminar");
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    try {
      const res = await uploadSiteImage(file);
      updateLocalProduct("image", res.data.url);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error al subir imagen");
    }
  };

  return (
    <div className="bg-[#0b1220] border border-gray-800 rounded-2xl p-6 space-y-4 hover:border-yellow-400/50 transition shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Producto #{index + 1}</span>
        <button onClick={() => handleDelete(product.id)} className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase transition">Eliminar</button>
      </div>

      <InputPro 
        placeholder="Nombre del producto" 
        value={product.name} 
        onChange={(val) => updateLocalProduct("name", val)} 
      />
      
      <TextareaPro 
        placeholder="Descripción corta" 
        value={product.description} 
        onChange={(val) => updateLocalProduct("description", val)} 
      />

      <div>
        <label className="text-[10px] text-gray-500 uppercase mb-1 block">Precio</label>
        <InputPro 
          type="number" 
          placeholder="0.00"
          value={product.price} 
          onChange={(val) => updateLocalProduct("price", val)} 
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] text-gray-500 uppercase block">Imagen del producto</label>
        <div className="flex gap-4 items-center">
            {product.image && (
              <img src={product.image} className="w-16 h-16 rounded-xl object-cover border border-gray-800" alt="Product" />
            )}
            <div className="relative flex-1">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleUpload(e.target.files[0])} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
              <div className="bg-white/5 border border-dashed border-gray-700 rounded-xl p-3 text-center text-[10px] text-gray-400 hover:bg-white/10 transition">
                {product.image ? "Cambiar imagen" : "Subir imagen"}
              </div>
            </div>
        </div>
      </div>

      <button
        onClick={() => handleSave(product)}
        disabled={savingId === product.id}
        className={`w-full py-3 rounded-xl font-bold text-xs transition active:scale-95 shadow-md ${
          savingId === product.id 
            ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
            : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border border-gray-700"
        }`}
      >
        {savingId === product.id ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
