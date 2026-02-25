const builderService = require("../services/siteBuilder.service");

exports.getBuilder = async (req, res) => {
  try {
    const { barbershopId } = req.params;
    const site = await builderService.getBuilderSite(barbershopId);
    res.json(site);
  } catch (err) {
    console.error("❌ getBuilder:", err);
    res.status(500).json({ error: "Error cargando builder" });
  }
};

exports.saveBuilder = async (req, res) => {
  try {
    const { siteId, pages } = req.body;
    await builderService.saveBuilderSite(siteId, pages);
    res.json({ message: "Cambios guardados" });
  } catch (err) {
    console.error("❌ saveBuilder:", err);
    res.status(500).json({ error: "Error guardando builder" });
  }
};

exports.publish = async (req, res) => {
  try {
    const { siteId } = req.params;
    await builderService.publishSite(siteId);
    res.json({ message: "Sitio publicado" });
  } catch (err) {
    console.error("❌ publish:", err);
    res.status(500).json({ error: "Error publicando sitio" });
  }
};
