const { Appointment, Service } = require("../models");

exports.getStatsByBarbershop = async (barbershopId) => {

  const appointments = await Appointment.findAll({
    where: { barbershop_id: barbershopId },
    include: [
      {
        model: Service,
        as: "service", // 🔥 CLAVE
        attributes: ["id", "name", "price", "duration_minutes"],
      },
    ],
  });

  console.log("📊 APPOINTMENTS:", appointments.length);

  /* ========================
     TOTAL INGRESOS
  ======================== */
  const totalRevenue = appointments.reduce(
  (acc, a) => acc + Number(a.service?.price || 0),
  0
);

  /* ========================
     TOTAL CITAS
  ======================== */
  const totalAppointments = appointments.length;

  /* ========================
     CLIENTES ÚNICOS
  ======================== */
  const totalClients = new Set(
    appointments.map((a) => a.client_id)
  ).size;

  /* ========================
     SERVICIOS
  ======================== */
  const totalServices = new Set(
    appointments.map((a) => a.service_id)
  ).size;

  /* ========================
     INGRESOS POR DÍA
  ======================== */
  const revenueMap = {};

  appointments.forEach((a) => {
    const date = a.date;

    if (!date) return;

    if (!revenueMap[date]) {
      revenueMap[date] = 0;
    }

    revenueMap[date] += Number(a.service?.price || 0);
  });

  const revenueByDay = Object.entries(revenueMap).map(
    ([date, total]) => ({
      date,
      total,
    })
  );

  /* ========================
     TOP SERVICIOS
  ======================== */
  const serviceMap = {};

  appointments.forEach((a) => {
    const name = a.service?.name;

    if (!name) return;

    if (!serviceMap[name]) {
      serviceMap[name] = 0;
    }

    serviceMap[name]++;
  });

  const servicesTop = Object.entries(serviceMap).map(
    ([name, count]) => ({
      name,
      count,
    })
  );

  return {
  totalRevenue: Number(totalRevenue.toFixed(2)),
  totalAppointments,
  totalClients,
  totalServices,
  revenueByDay,
  servicesTop,
};
};