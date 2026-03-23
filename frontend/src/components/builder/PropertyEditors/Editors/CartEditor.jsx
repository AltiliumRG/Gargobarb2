import React from "react";
import { InputPro } from "../Shared/InputPro";
import { createProduct } from "../../../../api/products.api";
import { uploadSiteImage } from "../../../../api/upload.api";
import toast from "react-hot-toast";
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
  const DEFAULT_PRODUCTS = [
    { id: 'def1', name: 'Aceite para barba', price: 25000, description: 'Aceite hidratante enriquecido con vitamina E.', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60' },
    { id: 'def2', name: 'Cera moldeadora', price: 30000, description: 'Fijación media, ideal para estilizar peinados clásicos.', image: 'https://images.unsplash.com/photo-1597851065532-055f97d12e47?w=500&auto=format&fit=crop&q=60' },
    { id: 'def3', name: 'Shampoo especial', price: 45000, description: 'Limpieza profunda con extractos naturales.', image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=500&auto=format&fit=crop&q=60' }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price) + ' COP';
  };

  const handleDefaultImageUpload = async (file, itemIndex) => {
    if (!file) return;
    try {
      const res = await uploadSiteImage(file);
      const currentItems = content?.items !== undefined ? content.items : DEFAULT_PRODUCTS;
      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], image: res.data.url };
      handleContent('items', updatedItems);
      toast.success("Imagen de la plantilla actualizada");
    } catch (err) {
      console.error(err);
      toast.error("Error al subir imagen");
    }
  };

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

        <div className="p-4 rounded-xl border-l-4 border-yellow-500 bg-white/5 shadow-inner mt-4">
          <InputPro
            type="number"
            label="Descuento Global (%)"
            placeholder="Ej: 10"
            value={content.globalDiscount || ""}
            onChange={(value) => handleContent("globalDiscount", value)}
          />
          <p className="text-[10px] text-gray-400 mt-1 italic">
            El porcentaje ingresado rebajará el precio de TODOS los productos, mostrando el valor original tachado.
          </p>
        </div>
      </div>

      {/* PRODUCTS LIST */}
      <div className="space-y-4">
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Productos por defecto</h4>
            <span className="text-[10px] text-gray-600 font-medium">
              {content?.items !== undefined ? content.items.length : 3} items
            </span>
          </div>
          {(content?.items !== undefined ? content.items : DEFAULT_PRODUCTS).map((p, i) => (
            <div key={p.id || i} className="bg-[#0b1220] border border-gray-800 rounded-2xl p-4 flex justify-between items-center shadow-sm">
              <div className="flex flex-1 items-center gap-3">
                <div className="relative w-10 h-10 shrink-0 group">
                  {(p.image || DEFAULT_PRODUCTS[i]?.image) ? (
                    <img src={p.image || DEFAULT_PRODUCTS[i]?.image} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="w-full h-full bg-gray-800 rounded-lg flex items-center justify-center text-[8px] text-gray-500 text-center leading-tight">Sin<br />Img</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                    <span className="text-[8px] text-white">Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDefaultImageUpload(e.target.files[0], i)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <h5 className="text-xs font-bold text-white truncate">{p.name}</h5>
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] text-gray-500">Por defecto</span>
                    <span className="text-[10px] font-black text-yellow-500 line-clamp-1">{formatPrice(p.price)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  const currentItems = content?.items !== undefined ? content.items : [
                    { id: 'def1', name: 'Aceite para barba', price: 25000, description: 'Aceite hidratante enriquecido con vitamina E.', image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500&auto=format&fit=crop&q=60' },
                    { id: 'def2', name: 'Cera moldeadora', price: 30000, description: 'Fijación media, ideal para estilizar peinados clásicos.', image: 'https://images.unsplash.com/photo-1597851065532-055f97d12e47?w=500&auto=format&fit=crop&q=60' },
                    { id: 'def3', name: 'Shampoo especial', price: 45000, description: 'Limpieza profunda con extractos naturales.', image: 'https://images.unsplash.com/photo-1585232351009-aa87416fca90?w=500&auto=format&fit=crop&q=60' }
                  ];
                  handleContent('items', currentItems.filter(item => item.id !== p.id));
                }}
                className="text-[10px] text-red-500 hover:text-red-400 font-bold uppercase transition"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-800">
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
          <div className="space-y-4 pt-2">
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
