const { sequelize } = require("../config/db");
const BarbershopRepository = require("../repositories/barbershop.repository");
const SiteService = require("./site.service");
const slugify = require("../utils/slugify");

module.exports = {

  async create(userId, dto) {

    const transaction = await sequelize.transaction();

    try {

      // 🔹 Generar slug único (con protección contra colisiones)
      const baseSlug = slugify(dto.name);
      let slug = baseSlug;
      let counter = 1;

      while (await BarbershopRepository.findBySlug(slug, transaction)) {
        slug = `${baseSlug}-${counter++}`;
      }

      // 🔹 Crear barbería
      const barbershop = await BarbershopRepository.create(
        {
          user_id: userId,
          slug,
          ...dto,
        },
        transaction
      );

      // 🔹 Crear sitio asociado
      await SiteService.createSiteForBarbershop(
        {
          barbershopId: barbershop.id,
          slug, // 👈 mismo slug
        },
        transaction
      );

      await transaction.commit();

      return barbershop;

    } catch (error) {

      await transaction.rollback();
      throw error;

    }
  },

  async getMy(userId) {
    return BarbershopRepository.findByUser(userId);
  },

};