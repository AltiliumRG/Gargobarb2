const { SitePage } = require("../models");

module.exports = {
  create(siteId, page) {
    return SitePage.create({
      site_id: siteId,
      title: page.title,
      slug: page.slug,
      order_index: page.order || 0
    });
  }
};
