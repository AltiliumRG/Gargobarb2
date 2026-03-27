const { Appointment, Service } = require("../../models");
const { Op } = require("sequelize");

exports.getOverview = async (barbershopId) => {
  const today = new Date().toISOString().split("T")[0];

  const monthStart = new Date();
  monthStart.setDate(1);

  const totalAppointments = await Appointment.count({
    where: { barbershop_id: barbershopId }
  });

  const todayAppointments = await Appointment.count({
    where: {
      barbershop_id: barbershopId,
      date: today
    }
  });

  const pendingAppointments = await Appointment.count({
    where: {
      barbershop_id: barbershopId,
      status: "pendiente"
    }
  });

  const confirmedAppointments = await Appointment.count({
    where: {
      barbershop_id: barbershopId,
      status: "confirmada"
    }
  });

  const monthlyAppointments = await Appointment.findAll({
    where: {
      barbershop_id: barbershopId,
      date: {
        [Op.gte]: monthStart
      },
      status: "confirmada"
    },
    include: {
      model: Service,
      attributes: ["price"]
    }
  });

  const monthlyRevenue = monthlyAppointments.reduce(
    (acc, a) => acc + (a.service?.price || 0),
    0
  );

  return {
    totalAppointments,
    todayAppointments,
    pendingAppointments,
    confirmedAppointments,
    monthlyRevenue
  };
};