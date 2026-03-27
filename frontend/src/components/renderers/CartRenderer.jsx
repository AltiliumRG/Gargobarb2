import { useState, useMemo } from "react";
import { useBarber } from "../../context/BarberContext";
import { createCart } from "../../api/cart.api";
import toast from "react-hot-toast";

export default function CartRenderer({ section, content, styles, site, preview }) {
  const { products: contextProducts } = useBarber();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const DEFAULT_PRODUCTS = [
    { id: 'def1', name: 'Cera Fijadora Profesional', price: 15000, description: 'Cera de alta fijación con acabado mate.', image: 'http://localhost:4000/uploads/Default/product1.jpg' },
    { id: 'def2', name: 'Aceite para barba', price: 20000, description: 'Aceite hidratante de argán para suavizar la barba.', image: 'http://localhost:4000/uploads/Default/product1.jpg' },
    { id: 'def3', name: 'Loción Aftershave', price: 12500, description: 'Refresca y calma la piel después del afeitado.', image: 'http://localhost:4000/uploads/Default/product1.jpg' }
  ];


  const displayProducts = useMemo(() => {
    // If we have content.items (from DB), map over them and enforce an image fallback.
    const rawDefaultItems = content?.items !== undefined ? content.items : DEFAULT_PRODUCTS;
    const defaultItems = rawDefaultItems.map((item, idx) => ({
      ...item,
      image: item.image || DEFAULT_PRODUCTS[idx]?.image
    }));
    const combined = [...defaultItems, ...(contextProducts || [])];
    const discount = Number(content?.globalDiscount) || 0;
    if (discount > 0) {
      return combined.map(p => ({
        ...p,
        originalPrice: p.price,
        price: p.price * (1 - discount / 100)
      }));
    }
    return combined;
  }, [contextProducts, content?.items, content?.globalDiscount]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price) + ' COP';
  };

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

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      toast.error("Por favor completa tu nombre y teléfono.");
      return;
    }
    if (cart.length === 0) return;

    setIsLoading(true);
    try {
      const payload = {
        site_id: site?.id || 1, // Fallback if site is missing in preview
        client_name: clientName,
        client_phone: clientPhone,
        items: cart,
        total: cartTotal
      };

      await createCart(payload);
      
      toast.success("¡Pedido creado correctamente!");
      
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setClientName("");
      setClientPhone("");
      
    } catch (error) {
      console.error("Error al crear pedido:", error);
      toast.error("Hubo un error al procesar tu pedido.");
    } finally {
      setIsLoading(false);
    }
  };

  const title = content?.title || "Carrito de Compras";
  const buttonText = content?.buttonText || "Añadir al Carrito";
  const buttonColor = styles?.buttonColor || "#facc15";
  const bgColor = styles?.backgroundColor || "";
  const txtColor = styles?.textColor || "";
  const cardBgColor = styles?.cardBackgroundColor || "";

  return (
    <div className={`py-16 relative ${!bgColor ? 'bg-transparent text-white' : ''}`} style={{ backgroundColor: bgColor || undefined, color: txtColor || undefined }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-0">
            {title}
          </h2>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold shadow-md transition whitespace-nowrap"
            style={{ backgroundColor: buttonColor, color: "#000" }}
          >
            🛒 Carrito ({cart.reduce((acc, item) => acc + item.quantity, 0)}) - {formatPrice(cartTotal)}
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
                <div key={product.id} className={`group flex flex-col bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-yellow-500/30 ${!cardBgColor ? '' : ''}`} style={{ backgroundColor: cardBgColor || undefined }}>
                  <div className="h-56 overflow-hidden bg-black/20 relative">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">Sin Imagen</div>
                    )}
                    {product.originalPrice && (
                       <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">Oferta</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 relative">
                    <h3 className="font-bold text-xl mb-3 text-white line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-300 mb-6 line-clamp-2 min-h-[40px]">{product.description}</p>
  
                    <div className="flex flex-col items-start gap-1">
                      {product.originalPrice && (
                        <span className="text-sm line-through text-gray-400 font-bold opacity-75">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-2xl font-black drop-shadow-sm tracking-tight" style={{ color: buttonColor }}>
                        {formatPrice(product.price)}
                      </span>
                    </div>
  
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-3 mt-6 rounded-xl font-bold transition-all duration-300 hover:bg-yellow-400 hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-2"
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

      {/* FLOATING CART BUTTON OMNIPRESENT ON MOBILE */}
      {cart.length > 0 && !isCartOpen && (
        <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center md:hidden px-4 pointer-events-none">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full max-w-sm py-4 rounded-xl shadow-2xl font-black flex justify-between items-center px-6 transition hover:scale-105 active:scale-95 pointer-events-auto border border-black/10 animate-bounce-slow"
            style={{ backgroundColor: buttonColor, color: "#000" }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">🛒</span>
              <div className="text-left">
                <div className="text-xs uppercase tracking-widest font-black opacity-70">Ver Carrito</div>
                <div className="text-sm font-bold">{cart.reduce((acc, item) => acc + item.quantity, 0)} Items</div>
              </div>
            </div>
            <div className="text-xl tracking-tight">{formatPrice(cartTotal)}</div>
          </button>
        </div>
      )}

      {/* CART OVERLAY / MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 z-50 flex justify-end animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-[#0b1220] w-full max-w-md h-full shadow-2xl flex flex-col border-l border-white/10 slide-in-from-right-8 fade-in duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50 flex justify-between items-center bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center text-gray-700 dark:text-gray-300 shadow-inner group"
                  aria-label="Volver atrás"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">Tu Carrito</h3>
              </div>
              <span className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black px-4 py-1.5 rounded-full shadow-md">
                {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
              </span>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scroll">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-20 flex flex-col items-center">
                  <span className="text-6xl mb-4 opacity-50">🛒</span>
                  <p className="text-lg font-bold">Tu carrito está vacío</p>
                  <p className="text-sm mt-2 opacity-75">Añade algunos productos para empezar</p>
                </div>
              ) : (
                cart.map(item => {
                  return (
                    <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition group">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden flex-shrink-0 relative">
                        {item.image ? (
                           <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400 text-[10px] font-bold">Sin Img</div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <div>
                          <h4 className="font-extrabold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors">{item.name}</h4>
                          <div className="mt-1 flex gap-2 items-center">
                            <span className="text-sm font-black" style={{ color: buttonColor }}>{formatPrice(item.price)}</span>
                            {item.originalPrice && (
                              <span className="text-[10px] line-through text-gray-400 font-medium">{formatPrice(item.originalPrice)}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900/50 rounded-xl p-1 border border-gray-200 dark:border-gray-800">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 shadow-sm transition active:scale-95"
                            >-</button>
                            <span className="text-sm font-bold w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 shadow-sm transition active:scale-95"
                            >+</button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 transition hover:scale-110 rotate-0 hover:rotate-12"
                            aria-label="Quitar producto"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-black/40 backdrop-blur-md space-y-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                  <span className="text-3xl font-black text-gray-900 dark:text-white leading-none tracking-tight">{formatPrice(cartTotal)}</span>
                </div>
                <button
                  className="w-full mt-4 py-4 rounded-2xl font-black shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 flex justify-center items-center gap-3 text-lg border border-black/10"
                  style={{ backgroundColor: buttonColor, color: "#000" }}
                  onClick={() => setIsCheckoutOpen(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Proceder al Pago
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-4 mt-2 rounded-2xl font-bold bg-gray-100 dark:bg-gray-800/60 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition shadow-sm"
                >
                  Seguir Comprando
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/60 z-[60] flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Finalizar Compra</h3>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tu Nombre</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tu Teléfono</label>
                <input 
                  type="tel" 
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Ej. 3001234567"
                  className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-4 rounded-xl font-black shadow-lg transition-all hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                style={{ backgroundColor: buttonColor, color: "#000" }}
              >
                {isLoading ? "Procesando..." : `Confirmar Pedido - ${formatPrice(cartTotal)}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
