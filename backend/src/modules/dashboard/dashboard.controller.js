const dashboardService = require("./dashboard.service");

exports.getOverview = async (req, res) => {
  try {
    const { barbershopId } = req.params;

    const data = await dashboardService.getOverview(barbershopId);

    res.json(data);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error cargando dashboard" });
  }
};