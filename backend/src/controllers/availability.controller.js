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
       obtener día
    ====================== */

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

/* hora actual colombia */
const now = new Date(
  new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
);

while (current < close) {

  const [h, m] = current.split(":").map(Number);

  const start = new Date();
  start.setHours(h);
  start.setMinutes(m);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + duration);

  const closeTime = new Date();
  const [ch, cm] = close.split(":").map(Number);
  closeTime.setHours(ch);
  closeTime.setMinutes(cm);

  if (end <= closeTime) {
    slots.push(current);
  }

  start.setMinutes(start.getMinutes() + 30);

  current = start
    .toTimeString()
    .slice(0,5);
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