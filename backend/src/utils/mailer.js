const nodemailer = require("nodemailer");

/**
 * Configuración del transporte de nodemailer
 * Usando configuraciones desde variables de entorno
 */
const transporter = nodemailer.createTransport({
  service: "gmail", // Puedes cambiar a otro proveedor si lo actualizas en .env
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Función para generar el HTML de la factura y enviar el correo.
 * @param {Object} data 
 * @param {string} data.client_email - Email del cliente que compró
 * @param {string} data.client_name - Nombre del cliente
 * @param {string} data.transaction_ref - UUID/Ref de la orden
 * @param {string} data.barbershop_name - Nombre de la barbería
 * @param {number} data.total - Total numérico
 * @param {Array} data.items - Array con los items comprados
 * @param {string} data.payment_method - Método de pago usado (nequi, transfer, card, efectivo)
 */
exports.sendInvoiceEmail = async ({ client_email, client_name, transaction_ref, barbershop_name, total, items, payment_method }) => {
  if (!client_email) return; // Si no dio email, no mandamos nada

  const formatPrice = (price) => 
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price) + " COP";

  const formattedTotal = formatPrice(total);

  // Mapear los items comprados a filas HTML para una tabla
  const itemsHtml = items.map(
    (item) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; color: #333333; font-size: 14px;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: center; color: #666666; font-size: 14px;">${item.quantity || 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eeeeee; text-align: right; color: #333333; font-weight: bold; font-size: 14px;">${formatPrice(item.price * (item.quantity || 1))}</td>
    </tr>
  `
  ).join("");

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Factura de Compra - GargoBarb</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f6f9; padding: 40px 20px;">
        <tr>
          <td align="center">
            
            <!-- Contenedor principal de la tarjeta -->
            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.05);">
              
              <!-- HEADER OSCURO - GARGO BARB -->
              <tr>
                <td align="center" style="background-color: #0b0f14; padding: 40px 20px; border-bottom: 4px solid #facc15;">
                  <h1 style="color: #ffffff; font-size: 28px; margin: 0; font-weight: 800; letter-spacing: 2px;">GARGO<span style="color: #facc15;">BARB</span></h1>
                  <p style="color: #9ca3af; font-size: 14px; margin-top: 10px; margin-bottom: 0;">Confirmación de Pedido Electrónico</p>
                </td>
              </tr>

              <!-- CONTENIDO -->
              <tr>
                <td style="padding: 40px 30px;">
                  
                  <h2 style="color: #111827; font-size: 22px; margin-top: 0; margin-bottom: 15px;">¡Gracias por tu compra, ${client_name}!</h2>
                  <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-top: 0; margin-bottom: 30px;">
                    Tu orden en <strong>${barbershop_name || "la barbería"}</strong> ha sido registrada con éxito. A continuación, tienes los detalles exactos de tu recibo para tu comprobación.
                  </p>

                  <!-- METADATA DE LA FACTURA -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 30px;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Referencia Transaccional</p>
                        <p style="margin: 5px 0 15px 0; color: #111827; font-size: 16px; font-family: monospace;">${transaction_ref}</p>
                        
                        <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Método Seleccionado</p>
                        <p style="margin: 5px 0 0 0; color: #111827; font-size: 14px; font-weight: 600;">${payment_method.toUpperCase()}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- TABLA DE PRODUCTOS -->
                  <h3 style="color: #111827; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-bottom: 15px;">Resumen del Pedido</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 30px;">
                    <thead>
                      <tr>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e5e7eb; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase;">Producto</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; text-transform: uppercase;">Cant.</th>
                        <th style="padding: 10px 12px; border-bottom: 2px solid #e5e7eb; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase;">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2" style="padding: 20px 12px 10px; text-align: right; color: #4b5563; font-size: 14px; font-weight: bold;">TOTAL PAGADO:</td>
                        <td style="padding: 20px 12px 10px; text-align: right; color: #111827; font-size: 20px; font-weight: 900;">${formattedTotal}</td>
                      </tr>
                    </tfoot>
                  </table>

                </td>
              </tr>

              <!-- FOOTER DE LA CARTA -->
              <tr>
                <td align="center" style="background-color: #f8fafc; padding: 25px 20px; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #64748b; font-size: 13px;">
                    Este es un comprobante automático generado por <strong>GargoBarb Software para Barberías</strong>. No es necesario responder a este correo.
                  </p>
                </td>
              </tr>

            </table>
            <!-- Fin de la tarjeta -->

          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  // Configuración del envío
  const mailOptions = {
    from: `"GargoBarb Pagos" <${process.env.EMAIL_USER}>`,
    to: client_email,
    subject: `Factura de compra - Ref: ${transaction_ref}`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Correo enviado exitosamente a:", client_email);
    return info;
  } catch (error) {
    console.error("❌ Error enviando el correo:", error);
    throw error;
  }
};
