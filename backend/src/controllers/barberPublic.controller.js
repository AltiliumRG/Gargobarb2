// ===============================================
// 🌍 Controlador público de barberías
// ===============================================

const barberPublicService = require("../services/barberPublic.service");

exports.getPublicBarbershop = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const barbershop = await barberPublicService.getBySlug(slug);

    if (!barbershop) {
      return res.status(404).json({ message: "Barbería no encontrada" });
    }

    res.json(barbershop);
  } catch (error) {
    next(error);
  }
};
