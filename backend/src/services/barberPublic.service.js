// ===============================================
// 🌍 Servicio público de barberías
// ===============================================

const Barbershop = require("../models/Barbershop");
const Service = require("../models/Service");
const BarberSchedule = require("../models/BarberSchedule");

exports.getBySlug = async (slug) => {
  return await Barbershop.findOne({
    where: { slug, is_active: true },
    include: [
      {
        model: Service,
        as: "services",
      },
      {
        model: BarberSchedule,
        as: "schedule",
      },
    ],
  });
};
