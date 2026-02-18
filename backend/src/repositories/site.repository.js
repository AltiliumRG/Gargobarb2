const BarbershopSite = require("../models/BarbershopSite");
const SitePage = require("../models/SitePage");
const SiteSection = require("../models/SiteSection");

exports.getSiteByBarbershopId = async (barbershopId) => {
  return BarbershopSite.findOne({
    where: { barbershop_id: barbershopId },
    include: [
      {
        model: SitePage,
        as: "pages",
        order: [["order_index", "ASC"]],
        include: [
          {
            model: SiteSection,
            as: "sections",
            order: [["order_index", "ASC"]],
          },
        ],
      },
    ],
  });
};

exports.getSiteBySlug = async (slug) => {
  return BarbershopSite.findOne({
    where: { slug, status: "published" },
    include: [
      {
        model: SitePage,
        as: "pages",
        include: [{ model: SiteSection, as: "sections" }],
      },
    ],
  });
};
