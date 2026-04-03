// backend/src/routes/order.routes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

// 🔓 Crear orden — público (el cliente lo llama al pagar)
router.post("/", orderController.createOrder);

// 🔐 Obtener órdenes de un sitio — solo barbero/admin
router.get("/site/:siteId", verifyToken, requireRole(1, 2), orderController.getOrdersBySite);

module.exports = router;
