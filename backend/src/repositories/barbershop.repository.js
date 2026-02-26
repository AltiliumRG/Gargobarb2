const Barbershop = require("../models/Barbershop");

module.exports = {
  async create(data, transaction) {
    return Barbershop.create(data, { transaction });
  },

  async findBySlug(slug, transaction) {
    return Barbershop.findOne({
      where: { slug },
      transaction,
    });
  },

  async findByUser(userId) {
    return Barbershop.findAll({
      where: { user_id: userId },
    });
  },

  async findById(id, transaction) {
    return Barbershop.findByPk(id, { transaction });
  },

};
