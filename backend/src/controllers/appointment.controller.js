const { Op } = require("sequelize");
const { Appointment, Service, Barbershop, User, BarberSchedule } = require("../models");

/* ============================================================
   📅 CREAR CITA (Cliente)
============================================================ */
exports.createAppointment = async (req, res) => {
  try {
    const { barbershop_id, service_id, date, time, notes } = req.body;
    const user_id = req.user.id;

    if (!barbershop_id || !service_id || !date || !time) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    /* -------------------------
       verificar horario del barbero
    -------------------------- */

    const dateObj = new Date(`${date}T00:00:00`);

const daySpanish = dateObj.toLocaleDateString("es-CO", {
  weekday: "long",
  timeZone: "America/Bogota"
});

const dayMap = {
  domingo: "sunday",
  lunes: "monday",
  martes: "tuesday",
  miércoles: "wednesday",
  jueves: "thursday",
  viernes: "friday",
  sábado: "saturday"
};

const day = dayMap[daySpanish];

    const schedule = await BarberSchedule.findOne({
      where: {
        barbershop_id,
        day,
      },
    });

    if (!schedule || schedule.is_closed) {
      return res.status(400).json({
        error: "La barbería está cerrada ese día",
      });
    }

    if (time < schedule.open_time || time > schedule.close_time) {
      return res.status(400).json({
        error: "Horario fuera del horario permitido",
      });
    }

    /* -------------------------
       verificar duplicados
    -------------------------- */

    const existing = await Appointment.findOne({
      where: {
        barbershop_id,
        date,
        time,
        status: {
          [Op.ne]: "cancelada",
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        error: "Ese horario ya está reservado",
      });
    }

    /* -------------------------
       crear cita
    -------------------------- */

    const appointment = await Appointment.create({
      user_id,
      barbershop_id,
      service_id,
      date,
      time,
      notes,
      status: "pendiente",
    });

    res.status(201).json(appointment);

  } catch (error) {
    console.error("❌ Error al crear cita:", error);
    res.status(500).json({ error: "Error al crear cita" });
  }
};


/* ============================================================
   📋 LISTAR CITAS POR BARBERÍA (Dueño/Admin)
============================================================ */
exports.getAppointmentsByBarbershop = async (req, res) => {
  try {
    const { barbershopId } = req.params;

    const appointments = await Appointment.findAll({
      where: { barbershop_id: barbershopId },
      include: [
        {
          model: User,
          as: "client", // 🔥 ESTE ES TU ALIAS REAL
          attributes: ["id", "username", "email"],
        },
        {
          model: Service,
          as: "service",
          attributes: ["id", "name", "price"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.json(appointments);

  } catch (error) {
    console.error("❌ Error getAppointmentsByBarbershop:", error);
    res.status(500).json({ error: "Error obteniendo citas" });
  }
};


/* ============================================================
   🔄 ACTUALIZAR ESTADO
============================================================ */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    await appointment.update({ status });

    res.json({
      message: "Estado actualizado correctamente",
      appointment,
    });

  } catch (error) {
    console.error("❌ Error actualizando estado:", error);
    res.status(500).json({ error: "Error al actualizar cita" });
  }
};


/* ============================================================
   🗑 ELIMINAR CITA
============================================================ */
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    await appointment.destroy();

    res.json({ message: "Cita eliminada correctamente" });

  } catch (error) {
    console.error("❌ Error eliminando cita:", error);
    res.status(500).json({ error: "Error al eliminar cita" });
  }
};


/* ============================================================
   📊 ESTADÍSTICAS PARA DASHBOARD
============================================================ */
exports.getStatsByBarbershop = async (req, res) => {
  try {
    const { barbershopId } = req.params;

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const firstDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )
      .toISOString()
      .split("T")[0];

    /* -------------------------
       TOTAL CITAS
    -------------------------- */
    const totalAppointments = await Appointment.count({
      where: { barbershop_id: barbershopId },
    });

    /* -------------------------
       CITAS HOY
    -------------------------- */
    const todayAppointments = await Appointment.count({
      where: {
        barbershop_id: barbershopId,
        date: todayString,
      },
    });

    /* -------------------------
       PENDIENTES
    -------------------------- */
    const pendingAppointments = await Appointment.count({
      where: {
        barbershop_id: barbershopId,
        status: "pendiente",
      },
    });

    /* -------------------------
       INGRESOS DEL MES
    -------------------------- */
    const monthlyAppointments = await Appointment.findAll({
      where: {
        barbershop_id: barbershopId,
        status: "completada",
        date: {
          [Op.gte]: firstDayOfMonth,
        },
      },
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["price"],
        },
      ],
    });

    const monthlyRevenue = monthlyAppointments.reduce(
      (acc, a) => acc + Number(a.service?.price || 0),
      0
    );

    /* -------------------------
       INGRESOS TOTALES
    -------------------------- */
    const allCompleted = await Appointment.findAll({
      where: {
        barbershop_id: barbershopId,
        status: "completada",
      },
      include: [
        {
          model: Service,
          as: "service",
          attributes: ["price"],
        },
      ],
    });

    const totalRevenue = allCompleted.reduce(
      (acc, a) => acc + Number(a.service?.price || 0),
      0
    );

    res.json({
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      monthlyRevenue,
      totalRevenue,
    });

  } catch (error) {
    console.error("❌ Error obteniendo estadísticas:", error);
    res.status(500).json({ error: "Error obteniendo estadísticas" });
  }
};