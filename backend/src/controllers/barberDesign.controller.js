// ===============================================
// 🎨 Controlador de diseño de barbería (barbero)
// ===============================================

const barberDesignService = require("../services/barberDesign.service");

exports.saveDesign = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const designData = req.body;

    const result = await barberDesignService.saveDesign(
      userId,
      designData
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};
exports.getMyBarbershops = async (req, res, next) => {
  try {
    const barbershops = await Barbershop.findAll({
      where: { owner_id: req.user.id },
    });

    res.json(barbershops);
  } catch (error) {
    next(error);
  }
};


exports.getDesign = async (req, res, next) => {
  try {
    const { barbershopId } = req.params;

    const design = await barberDesignService.getDesign(barbershopId);

    res.json(design);
  } catch (error) {
    next(error);
  }
};
