const statsRepository = require("../repositories/stats.repository");
const { Barbershop } = require("../models"); // ajusta según tu estructura

exports.getBarberStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = req.user
// 🔥 AQUÍ EXACTAMENTE
    console.log("🔥 USER EN STATS:", req.user);
    // 🔥 AQUÍ EXACTAMENTE
    console.log("🔥 USER EN STATS:", user);
    // 🔥 buscar barbería del usuario
    const shop = await Barbershop.findOne({
      where: { user_id: userId }
    });
    // 🔥 AQUÍ EXACTAMENTE
    console.log("🔥 USER EN STATS:", req.user);
    if (!shop) {
      return res.status(400).json({
        error: "El usuario no tiene barbería asociada",
      });
    }

    const stats = await statsRepository.getStatsByBarbershop(
      shop.id
    );

    res.json(stats);

  } catch (err) {
    console.error("❌ Error stats FULL:", err);
console.error("❌ Stack:", err.stack);
    res.status(500).json({
      error: "Error obteniendo estadísticas",
    });
  }
};