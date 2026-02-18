const { SiteSection } = require("../models");

module.exports = {
  create(pageId, section) {
    return SiteSection.create({
      page_id: pageId,
      type: section.type,
      content: section.content,
      styles: section.styles,
      order_index: section.order || 0
    });
  },

  update(id, data) {
    return SiteSection.update(data, { where: { id } });
  }
};
