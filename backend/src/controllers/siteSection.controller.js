const SiteSectionRepository = require("../repositories/siteSection.repository");

exports.update = async (req, res) => {
  await SiteSectionRepository.update(req.params.id, req.body);
  res.json({ ok: true });
};
