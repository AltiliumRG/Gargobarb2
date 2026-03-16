import { useState, useMemo } from "react";
import { useBarber } from "../../context/BarberContext";

export default function CartRenderer({ section, content, styles, site, preview }) {
  const { products: contextProducts } = useBarber();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const displayProducts = content?.items?.length > 0 ? content.items : [];

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const title = content?.title || "Carrito de Compras";
  const buttonText = content?.buttonText || "Añadir al Carrito";
  const buttonColor = styles?.buttonColor || "#facc15";
  const bgColor = styles?.backgroundColor || "";
  const txtColor = styles?.textColor || "";
  const cardBgColor = styles?.cardBackgroundColor || "";

  return (
    <div className={`py-16 relative ${!bgColor ? 'bg-gray-50 dark:bg-[#0b0f14]' : ''}`} style={{ backgroundColor: bgColor || undefined }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-black ${!txtColor ? 'text-gray-900 dark:text-white' : ''}`} style={{ color: txtColor || undefined }}>
            {title}
          </h2>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold shadow-md transition"
            style={{ backgroundColor: buttonColor, color: "#000" }}
          >
            🛒 Carrito ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
        </div>

        {/* PRODUCTS GRID */}
        <div className="max-h-[750px] overflow-y-auto px-2 py-4 custom-scroll">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayProducts.length === 0 ? (
               <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-10 text-gray-500">
                 No hay productos disponibles actualmente.
               </div>
            ) : (
              displayProducts.map((product) => {
                return (
                <div key={product.id} className={`rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition hover:shadow-xl ${!cardBgColor ? 'bg-white dark:bg-[#111827]' : ''}`} style={{ backgroundColor: cardBgColor || undefined }}>
                  <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-800 relative">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Sin Imagen</div>
                    )}
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{product.description}</p>
  
                    <div className="flex items-end gap-3 pt-2">
                      <span className="text-2xl font-black drop-shadow-sm" style={{ color: buttonColor }}>
                        ${Number(product.price).toFixed(2)}
                      </span>
                    </div>
  
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 mt-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex justify-center items-center gap-2"
                      style={{ backgroundColor: buttonColor, color: "#000" }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      {buttonText}
                    </button>
                  </div>
                </div>
              );
            })
            )}
            </div>
        </div>
      </div>

      {/* CART OVERLAY / MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md h-full shadow-2xl flex flex-col">

            {/* Header */}
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition flex items-center justify-center text-gray-700 dark:text-gray-300"
                  aria-label="Volver atrás"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tu Carrito</h3>
              </div>
              <span className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 text-xs font-bold px-3 py-1 rounded-full">
                {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">Tu carrito está vacío</div>
              ) : (
                cart.map(item => {
                  return (
                    <div key={item.id} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{item.name}</h4>
                        <div className="text-sm font-bold mt-1" style={{ color: buttonColor }}>${Number(item.price).toFixed(2)} c/u</div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold"
                            >-</button>
                            <span className="text-sm dark:text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold"
                            >+</button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm hover:underline"
                          >Quitar</button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold dark:text-white">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="w-full py-4 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2 text-lg"
                  style={{ backgroundColor: buttonColor, color: "#000" }}
                  onClick={() => alert("Función de checkout (WhatsApp o Pasarela) próximamente")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Proceder al Pago
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 mt-2 rounded-xl font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
