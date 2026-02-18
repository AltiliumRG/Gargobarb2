const SitePageRepository = require("../repositories/SitePageRepository");

exports.create = async (req, res) => {
  const page = await SitePageRepository.create(
    req.params.siteId,
    req.body
  );
  res.json(page);
};
