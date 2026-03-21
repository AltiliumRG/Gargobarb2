import React from "react";
import { InputPro } from "../Shared/InputPro";
import { createProduct } from "../../../../api/products.api";
import ProductCardEditor from "./ProductCardEditor";

export default function CartEditor({ 
  content, 
  styles, 
  handleContent, 
  handleStyle,
  activeBarbershop,
  products,
  setProducts,
  loadingProducts,
  savingId,
  setSavingId
}) {
  const handleAddProduct = async () => {
    if (!activeBarbershop?.id) return;
    try {
      const res = await createProduct({
        barbershop_id: activeBarbershop.id,
        name: "Nuevo producto",
        description: "",
        price: 0,
        image: ""
      });
      setProducts(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("❌ Error adding product:", err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
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

      {/* PRODUCTS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Mis Productos</h4>
          <span className="text-[10px] text-gray-600 font-medium">{products?.length || 0} items</span>
        </div>

        {loadingProducts ? (
          <div className="text-center text-gray-500 text-sm py-10 animate-pulse">Cargando productos...</div>
        ) : products?.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-12 border-2 border-dashed border-gray-800 rounded-2xl bg-[#0b1220]/50">
            No tienes productos aún.
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((p, i) => (
              <ProductCardEditor
                key={p.id}
                product={p}
                index={i}
                products={products}
                setProducts={setProducts}
                setSavingId={setSavingId}
                savingId={savingId}
              />
            ))}
          </div>
        )}

        <button
          onClick={handleAddProduct}
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 text-black py-4 rounded-2xl font-black transition shadow-xl active:scale-95 transform hover:-translate-y-0.5 border-b-4 border-yellow-700 mt-4"
        >
          + AGREGAR PRODUCTO
        </button>
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
    </div>
  );
}
