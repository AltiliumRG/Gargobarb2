const express = require("express");
const router = express.Router();
const barbershopController = require("../controllers/barbershop.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

/* ============================================================
   🔓 RUTAS PÚBLICAS (NO REQUIEREN LOGIN)
============================================================ */

/* Obtener barbería pública por slug */
router.get(
  "/public/:slug",
  barbershopController.getPublicBySlug
);

/* Registrar visita */
router.post(
  "/public/:slug/visit",
  barbershopController.registerVisit
);


/* ============================================================
   🔐 A PARTIR DE AQUÍ TODO REQUIERE LOGIN
============================================================ */

router.use(verifyToken);

/* ============================================================
   CREAR
============================================================ */
router.post(
  "/",
  requireRole(1, 2),
  barbershopController.createBarbershop
);

/* ============================================================
   OBTENER TODAS
============================================================ */
router.get(
  "/",
  barbershopController.getAllBarbershops
);

/* ============================================================
   OBTENER MIS BARBERÍAS
============================================================ */
router.get(
  "/my",
  requireRole(2),
  barbershopController.getMyBarbershops
);

/* ============================================================
   OBTENER POR ID
============================================================ */
router.get(
  "/:id",
  barbershopController.getBarbershopById
);

/* ============================================================
   ACTUALIZAR
============================================================ */
router.put(
  "/:id",
  requireRole(1, 2),
  barbershopController.updateBarbershop
);

/* ============================================================
   ELIMINAR
============================================================ */
router.delete(
  "/:id",
  requireRole(1, 2),
  barbershopController.deleteBarbershop
);

/* ============================================================
   HORARIOS
============================================================ */
router.get(
  "/:id/schedules",
  requireRole(1, 2),
  barbershopController.getSchedules
);

router.post(
  "/:id/schedules",
  requireRole(1, 2),
  barbershopController.saveSchedules
);

/* ============================================================
   💳 CONFIGURACIÓN DE PAGO
============================================================ */
router.put(
  "/:id/payment",
  requireRole(1, 2),
  barbershopController.updatePaymentConfig
);

// Ruta redundante eliminada

module.exports = router;