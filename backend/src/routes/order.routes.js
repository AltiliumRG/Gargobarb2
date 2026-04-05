// backend/src/routes/order.routes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

// 🔓 Crear orden — público (el cliente lo llama al pagar)
router.post("/", orderController.createOrder);

// 🔐 Obtener órdenes de un sitio
router.get("/site/:siteId", verifyToken, requireRole(1, 2), orderController.getOrdersBySite);

// 🔐 Obtener órdenes por barbershopId
router.get("/barbershop/:barbershopId", verifyToken, requireRole(1, 2), orderController.getOrdersByBarbershop);

// 🔐 Obtener órdenes del cliente (usa el email del token)
router.get("/client", verifyToken, requireRole(3), orderController.getOrdersByClient);

// 🔐 Actualizar estado de envío / orden principal
router.put("/:id/status", verifyToken, requireRole(1, 2), orderController.updateOrderStatus);

module.exports = router;
