module.exports = class CreateSiteDTO {
  constructor({ barbershopId, template, slug, features }) {
    if (!barbershopId || !template || !slug) {
      throw new Error("Datos incompletos para crear site");
    }

    this.barbershopId = barbershopId;
    this.template = template;
    this.slug = slug;
    this.features = features || {};
  }
};
