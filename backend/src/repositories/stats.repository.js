const { Appointment, Service, BarbershopSite, Order } = require("../models");

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

  const appointmentsRevenue = appointments.reduce(
    (acc, a) => acc + Number(a.service?.price || 0),
    0
  );

  let ordersRevenue = 0;
  let allOrders = [];
  try {
    const site = await BarbershopSite.findOne({ where: { barbershop_id: barbershopId } });
    if (site) {
      allOrders = await Order.findAll({ where: { site_id: site.id } });
      const completedOrders = allOrders.filter(o => o.status === "completed" || o.status === "pending");
      ordersRevenue = completedOrders.reduce((acc, o) => acc + Number(o.total || 0), 0);
    }
  } catch (e) {
    console.error("Error fetching orders for stats:", e);
  }

  const totalRevenue = appointmentsRevenue + ordersRevenue;

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

  /* ========================
     TOP PRODUCTOS (Carrito)
  ======================== */
  const productMap = {};
  allOrders.forEach(o => {
    if (o.status !== "refunded" && o.status !== "cancelled") {
      const items = o.items || [];
      items.forEach(item => {
        const pName = item.name;
        const qty = item.quantity || 1;
        if (!productMap[pName]) productMap[pName] = 0;
        productMap[pName] += qty;
      });
    }
  });

  const cartTopProducts = Object.entries(productMap).map(([name, count]) => ({
    name,
    count
  })).sort((a,b) => b.count - a.count).slice(0, 5);

  /* ========================
     ESTADOS (Appointments)
  ======================== */
  const statusMap = {};
  let cancelledCount = 0;
  appointments.forEach(a => {
    const st = a.status || "pending";
    if (!statusMap[st]) statusMap[st] = 0;
    statusMap[st]++;
    if (st === "cancelled") cancelledCount++;
  });

  const statusDistribution = Object.entries(statusMap).map(([name, value]) => ({
    name,
    value
  }));

  const cancelRate = appointments.length > 0 ? Math.round((cancelledCount / appointments.length) * 100) : 0;

  /* ========================
     HORAS PICO (Appointments)
  ======================== */
  const hoursMap = {};
  appointments.forEach(a => {
    if (a.time) {
      const hour = a.time.split(":")[0] + ":00";
      if (!hoursMap[hour]) hoursMap[hour] = 0;
      hoursMap[hour]++;
    }
  });

  const busyHours = Object.entries(hoursMap).map(([hour, count]) => ({
    hour,
    count
  })).sort((a,b) => a.hour.localeCompare(b.hour));

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalAppointments,
    totalClients,
    totalServices,
    revenueByDay,
    servicesTop,
    cartTopProducts,
    statusDistribution,
    busyHours,
    cancelRate
  };
};