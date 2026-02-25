// ===============================================
// 🎨 Servicio de diseño de barbería
// ===============================================

const Barbershop = require("../models/Barbershop");

exports.saveDesign = async (userId, designData) => {
  const barbershop = await Barbershop.findOne({
    where: { owner_id: userId },
  });

  if (!barbershop) {
    throw new Error("Barbería no encontrada");
  }

  barbershop.design = designData;
  await barbershop.save();

  return { message: "Diseño guardado correctamente" };
};

exports.getDesign = async (barbershopId) => {
  return await Barbershop.findByPk(barbershopId, {
    attributes: ["design"],
  });
};
