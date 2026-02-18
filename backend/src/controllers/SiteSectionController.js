const SiteSectionRepository = require("../repositories/SiteSectionRepository");

exports.update = async (req, res) => {
  await SiteSectionRepository.update(req.params.id, req.body);
  res.json({ ok: true });
};
