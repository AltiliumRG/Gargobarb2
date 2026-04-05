const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
const { verifyToken, requireRole } = require("../middleware/auth.middleware");

/* ============================================================
   TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
============================================================ */
router.use(verifyToken);

/* ============================================================
   CREAR CITA (Cliente)
============================================================ */
router.post("/", requireRole(3), appointmentController.createAppointment);

/* ============================================================
   LISTAR CITAS POR BARBERÍA (Admin o Dueño)
============================================================ */
router.get(
  "/barbershop/:barbershopId",
  requireRole(1, 2),
  appointmentController.getAppointmentsByBarbershop
);

/* ============================================================
   ESTADÍSTICAS (Admin o Dueño)
============================================================ */
router.get(
  "/stats/:barbershopId",
  requireRole(1, 2),
  appointmentController.getStatsByBarbershop
);

/* ============================================================
   ACTUALIZAR ESTADO
============================================================ */
router.put(
  "/:id/status",
  requireRole(1, 2, 3),
  appointmentController.updateStatus
);

/* ============================================================
   ELIMINAR CITA
============================================================ */
router.delete(
  "/:id",
  requireRole(1, 3),
  appointmentController.deleteAppointment
);

/* ============================================================
   LISTAR CITAS POR CLIENTE (Cliente)
============================================================ */
router.get(
  "/client",
  requireRole(3),
  appointmentController.getAppointmentsByClient
);

/* ============================================================
   POSPONER CITA (Cliente, Dueño o Admin)
============================================================ */
router.put(
  "/:id/reschedule",
  requireRole(1, 2, 3),
  appointmentController.rescheduleAppointment
);

module.exports = router;