const { BarbershopSite } = require("../models");

exports.publish = async (req, res) => {
  await BarbershopSite.update(
    { status: "published" },
    { where: { id: req.params.siteId } }
  );

  res.json({ message: "Sitio publicado" });
};
