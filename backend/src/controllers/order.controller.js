// backend/src/controllers/order.controller.js
const { Order, BarbershopSite } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { sendInvoiceEmail } = require("../utils/mailer");

/**
 * POST /api/orders
 * Crea una nueva orden cuando el cliente completa el pago.
 * Ruta pública — es llamada desde el checkout del cliente.
 */
exports.createOrder = async (req, res) => {
  try {
    const {
      site_id,
      client_name,
      client_email,
      client_phone,
      items,
      total,
      payment_method,
      notes,
    } = req.body;

    if (!site_id || !client_name || !items || items.length === 0 || !payment_method) {
      return res.status(400).json({
        ok: false,
        message: "Faltan datos requeridos (site_id, client_name, items, payment_method)",
      });
    }

    // Verificar que el sitio existe
    const site = await BarbershopSite.findByPk(site_id);
    if (!site) {
      return res.status(404).json({ ok: false, message: "Sitio de barbería no encontrado" });
    }

    // Generar referencia de transacción única
    const transaction_ref = `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Limpiar items para que no pesen tanto en JSON
    const cleanItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1
    }));

    const newOrder = await Order.create({
      site_id,
      client_name,
      client_email: client_email || null,
      client_phone: client_phone || null,
      items: cleanItems,
      total: parseFloat(total) || 0,
      payment_method,
      transaction_ref,
      status: "completed",
      notes: notes || null,
    });

    // 💳 INICIO: Envío de Factura por Correo
    if (client_email) {
      try {
        await sendInvoiceEmail({
          client_email,
          client_name,
          transaction_ref,
          barbershop_name: site.name || "Nuestra Barbería",
          total: parseFloat(total) || 0,
          items: cleanItems,
          payment_method
        });
      } catch (mailError) {
        // Logueamos pero no detenemos la respuesta de éxito
        console.warn("⚠️ Advertencia: La orden se creó pero hubo un fallo al enviar el email:", mailError);
      }
    }
    // 📩 FIN: Envío de Factura por Correo

    res.status(201).json({
      ok: true,
      message: "Orden registrada correctamente",
      order: {
        id: newOrder.id,
        transaction_ref: newOrder.transaction_ref,
        total: newOrder.total,
        status: newOrder.status,
      },
    });
  } catch (error) {
    console.error("❌ createOrder Error:", error);
    res.status(500).json({ ok: false, message: "Error interno al registrar la orden" });
  }
};

/**
 * GET /api/orders/site/:siteId
 * Obtener todas las órdenes de un sitio (para el barbero en su dashboard).
 * Requiere autenticación.
 */
exports.getOrdersBySite = async (req, res) => {
  try {
    const { siteId } = req.params;

    const orders = await Order.findAll({
      where: { site_id: siteId },
      order: [["created_at", "DESC"]],
    });

    res.json({ ok: true, orders });
  } catch (error) {
    console.error("❌ getOrdersBySite Error:", error);
    res.status(500).json({ ok: false, message: "Error al obtener las órdenes" });
  }
};
