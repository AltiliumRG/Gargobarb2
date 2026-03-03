// ===============================================
// 🌍 Controlador público de barberías
// ===============================================

const barberPublicService = require("../services/barberPublic.service");

/* ============================================================
   GET BARBERÍA PÚBLICA POR SLUG
============================================================ */
exports.getPublicBarbershop = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        message: "Slug requerido",
      });
    }

    const barbershop = await barberPublicService.getBySlug(slug);

    // 🔒 Si no existe
    if (!barbershop) {
      return res.status(404).json({
        message: "Barbería no encontrada",
      });
    }

    // 🔒 Validación fuerte de seguridad
    if (
      !barbershop.site ||
      !barbershop.site.is_visible ||
      !barbershop.site.is_published
    ) {
      return res.status(404).json({
        message: "Barbería no disponible",
      });
    }

    res.json(barbershop);

  } catch (error) {
    console.error("❌ Error getPublicBarbershop:", error);
    next(error);
  }
};