import React, { useState, useEffect, useRef } from "react";
import { InputPro } from "../Shared/InputPro";
import { TextareaPro } from "../Shared/TextareaPro";
import { updateProduct, deleteProduct } from "../../../../api/products.api";
import { uploadSiteImage } from "../../../../api/upload.api";
import toast from "react-hot-toast";
import { Save, Trash2, CheckCircle, Loader2 } from "lucide-react";

export default function ProductCardEditor({ product, index, products, setProducts }) {
  const [localStatus, setLocalStatus] = useState("idle"); // idle, saving, saved, error
  const timerRef = useRef(null);

  // Determinar si este producto específico se está guardando globalmente
  const isCurrentlySaving = localStatus === "saving";

  const updateLocalProduct = (field, val) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: val };
    setProducts(updated);
    
    // Trigger auto-save
    triggerAutoSave(updated[index]);
  };

  const triggerAutoSave = (updatedProduct) => {
    setLocalStatus("modified");
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      handleSave(updatedProduct);
    }, 800); // 800ms debounce
  };

  const handleSave = async (p) => {
    setLocalStatus("saving");
    try {
      await updateProduct(p.id, p);
      setLocalStatus("saved");
      setTimeout(() => setLocalStatus("idle"), 2000);
    } catch (err) {
      console.error("Error auto-saving:", err);
      setLocalStatus("error");
      toast.error("Error al auto-guardar producto");
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
      setLocalStatus("saving");
      const res = await uploadSiteImage(file);
      const updatedProduct = { ...products[index], image: res.data.url };
      
      const updatedList = [...products];
      updatedList[index] = updatedProduct;
      setProducts(updatedList);
      
      await handleSave(updatedProduct);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error al subir imagen");
      setLocalStatus("error");
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={`bg-[#0b1220] border ${localStatus === 'error' ? 'border-red-500/50' : 'border-gray-800'} rounded-2xl p-6 space-y-4 hover:border-yellow-400/50 transition shadow-sm relative overflow-hidden`}>
      
      {/* Status indicator bar (subtle) */}
      <div className={`absolute top-0 left-0 h-1 transition-all duration-500 ${
        localStatus === 'saving' ? 'w-full bg-yellow-500 animate-pulse' : 
        localStatus === 'saved' ? 'w-full bg-green-500' : 
        localStatus === 'error' ? 'w-full bg-red-500' : 'w-0'
      }`} />

      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Producto #{index + 1}</span>
          {localStatus === 'saving' && <Loader2 size={10} className="text-yellow-500 animate-spin" />}
          {localStatus === 'saved' && <CheckCircle size={10} className="text-green-500" />}
          {localStatus === 'modified' && <span className="text-[8px] text-yellow-500/70 italic">Editando...</span>}
        </div>
        <button onClick={() => handleDelete(product.id)} className="text-gray-500 hover:text-red-500 transition">
          <Trash2 size={14} />
        </button>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase mb-1 block">Precio</label>
          <InputPro 
            type="number" 
            placeholder="0.00"
            value={product.price} 
            onChange={(val) => updateLocalProduct("price", val)} 
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-[10px] text-gray-500 uppercase block">Imagen</label>
          <div className="flex gap-2 items-center">
              <div className="relative group shrink-0">
                <img 
                  src={product.image || "https://via.placeholder.com/64?text=+"} 
                  className="w-10 h-10 rounded-lg object-cover border border-gray-800" 
                  alt="Product" 
                />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleUpload(e.target.files[0])} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
              <p className="text-[9px] text-gray-600 leading-tight">Haz clic para cambiar imagen</p>
          </div>
        </div>
      </div>

      {localStatus === 'error' && (
        <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1">
          <Save size={10} /> Error al guardar automáticamente.
        </p>
      )}
    </div>
  );
}

