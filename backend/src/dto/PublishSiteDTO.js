module.exports = class PublishSiteDTO {
  constructor({ siteId }) {
    if (!siteId) {
      throw new Error("siteId requerido");
    }
    this.siteId = siteId;
  }
};
