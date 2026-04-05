// backend/src/controllers/order.controller.js
const { Order, BarbershopSite, Barbershop, Notification } = require("../models");
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
      shipping_address,
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
      shipping_address: shipping_address || null,
      shipping_status: "pending",
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
          payment_method,
          shipping_address
        });
      } catch (mailError) {
        // Logueamos pero no detenemos la respuesta de éxito
        console.warn("⚠️ Advertencia: La orden se creó pero hubo un fallo al enviar el email:", mailError);
      }
    }
    // 📩 FIN: Envío de Factura por Correo

    // 🔔 Notificar al dueño de la barbería
    try {
      const barbershop = await Barbershop.findByPk(site.barbershop_id);
      if (barbershop && barbershop.user_id) {
        await Notification.create({
          user_id: barbershop.user_id,
          type: "order_new",
          title: "¡Nueva Venta Realizada!",
          message: `Has recibido un nuevo pedido de ${client_name} por un total de $${total}.`,
          metadata: { order_id: newOrder.id }
        });
      }
    } catch (notifyError) {
      console.warn("⚠️ Error al crear notificación de pedido:", notifyError);
    }

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

/**
 * GET /api/orders/barbershop/:barbershopId
 */
exports.getOrdersByBarbershop = async (req, res) => {
  try {
    const site = await BarbershopSite.findOne({ where: { barbershop_id: req.params.barbershopId } });
    if (!site) return res.json([]);
    const orders = await Order.findAll({
      where: { site_id: site.id },
      order: [["created_at", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    console.error("❌ getOrdersByBarbershop Error:", error);
    res.status(500).json({ ok: false, message: "Error" });
  }
};

/**
 * GET /api/orders/client
 * Obtiene todas las órdenes del cliente usando el email de su token.
 */
exports.getOrdersByClient = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.sub;
    if (!userId) {
      return res.status(401).json({ ok: false, message: "No autenticado" });
    }

    // Buscar email real del usuario en la DB (el JWT no lo incluye)
    const { User } = require("../models");
    const userRecord = await User.findByPk(userId, { attributes: ["email"] });
    if (!userRecord?.email) {
      return res.status(400).json({ ok: false, message: "Usuario sin email registrado" });
    }

    const clientEmail = userRecord.email;

    let orders;
    try {
      orders = await Order.findAll({
        where: { client_email: clientEmail },
        include: [{ model: BarbershopSite, as: "site" }],
        order: [["created_at", "DESC"]],
      });
    } catch {
      // Fallback sin include si la relación no está definida
      orders = await Order.findAll({
        where: { client_email: clientEmail },
        order: [["created_at", "DESC"]],
      });
    }

    res.json(orders);
  } catch (error) {
    console.error("❌ getOrdersByClient Error:", error);
    res.status(500).json({ ok: false, message: "Error al obtener tus órdenes" });
  }
};

/**
 * PUT /api/orders/:id/status
 * Actualiza el status general o de envío (para Barberos/Admins).
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, shipping_status } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ ok: false, message: "Orden no encontrada" });
    }

    if (status) order.status = status;
    if (shipping_status) order.shipping_status = shipping_status;

    await order.save();

    res.json({ ok: true, message: "Estado actualizado", order });
  } catch (error) {
    console.error("❌ updateOrderStatus Error:", error);
    res.status(500).json({ ok: false, message: "Error interno al actualizar estado" });
  }
};
