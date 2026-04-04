/**
 * verWebHandler.js
 * ──────────────────────────────────────────────────────
 * Manejador para el botón "Ver Web" del panel barbero.
 * Permite una previsualización en tiempo real con cambios no guardados.
 */

export function handleVerWeb(site, pages) {
  if (!site || !site.id) return;

  // 1. Guardar estado actual en localStorage para la previsualización "en vivo"
  const previewData = {
    site,
    pages
  };

  try {
    localStorage.setItem(`gargobarb_preview_${site.id}`, JSON.stringify(previewData));
    
    // 2. Abrir la ruta de previsualización en una pestaña nueva
    window.open(`/barber/preview/${site.id}`, "_blank");
  } catch (err) {
    console.error("Error al generar previsualización:", err);
  }
}
