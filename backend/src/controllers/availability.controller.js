const { Op } = require("sequelize");
const { BarberSchedule, Appointment, Service } = require("../models");
exports.getAvailability = async (req, res) => {
  try {

    const { barbershopId } = req.params;
    const { date } = req.query;
    const duration = Number(req.query.duration) || 30;

    if (!date) {
      return res.status(400).json({ error: "Fecha requerida" });
    }

    /* ======================
       obtener día (ROBUSTO)
    ====================== */

    const [y, mm, dd] = date.split("-").map(Number);
    const dateObj = new Date(y, mm - 1, dd); 
    const daysArr = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day = daysArr[dateObj.getDay()];

    /* ======================
       horario del barbero
    ====================== */

    const schedule = await BarberSchedule.findOne({
      where: {
        barbershop_id: barbershopId,
        day,
      },
    });

    if (!schedule || schedule.is_closed) {
      return res.json([]);
    }

    const open = schedule.open_time;
    const close = schedule.close_time;

    /* ======================
       generar slots
    ====================== */

    const slots = [];
    let current = open;

    // Asegurar formato HH:mm:ss para comparaciones consistentes
    if (current.length === 5) current += ":00";
    let closeTimeStr = close;
    if (closeTimeStr.length === 5) closeTimeStr += ":00";

    const [ch, cm, cs] = closeTimeStr.split(":").map(Number);
    const barbershopClose = new Date(1970, 0, 1, ch, cm, cs || 0);

    while (current < closeTimeStr) {
      const [h, m, s] = current.split(":").map(Number);
      
      const slotStart = new Date(1970, 0, 1, h, m, s || 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      if (slotEnd <= barbershopClose) {
        slots.push(current.slice(0, 5)); // Enviar HH:mm al frontend
      }

      slotStart.setMinutes(slotStart.getMinutes() + 30);
      
      // Formatear manualmente a HH:mm:ss para la siguiente iteración
      const nextH = String(slotStart.getHours()).padStart(2, "0");
      const nextM = String(slotStart.getMinutes()).padStart(2, "0");
      current = `${nextH}:${nextM}:00`;
    }

    /* ======================
       citas ocupadas
    ====================== */

    const appointments = await Appointment.findAll({
  where: {
    barbershop_id: barbershopId,
    date,
    status: {
      [Op.ne]: "cancelada",
    },
  },
  include: [
    {
      model: Service,
      as: "service",
      attributes: ["duration_minutes"]
    }
  ]
});
function overlaps(slotStart, slotDuration, apptStart, apptDuration) {

  const s1 = new Date(`1970-01-01T${slotStart}:00`);
  const e1 = new Date(s1);
  e1.setMinutes(e1.getMinutes() + slotDuration);

  const s2 = new Date(`1970-01-01T${apptStart}:00`);
  const e2 = new Date(s2);
  e2.setMinutes(e2.getMinutes() + apptDuration);

  return s1 < e2 && s2 < e1;
}
    const bookedAppointments = appointments.map((a) => ({
  start: a.time.substring(0,5),
  duration: a.service?.duration_minutes || duration
}));

    

    /* ======================
   filtrar disponibles
====================== */

const slotsWithStatus = slots.map((slot) => {

  const booked = bookedAppointments.some((appt) =>
    overlaps(
      slot,
      duration,
      appt.start,
      appt.duration
    )
  );

  return {
    time: slot,
    booked
  };

});

return res.json(slotsWithStatus);

  } catch (error) {
    console.error("❌ Error availability:", error);
    res.status(500).json({ error: "Error obteniendo disponibilidad" });
  }
};