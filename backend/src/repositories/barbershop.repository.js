const Barbershop = require("../models/Barbershop");

module.exports = {
<<<<<<< HEAD
  create(data) {
    return Barbershop.create(data);
  },

  findByUser(userId) {
    return Barbershop.findAll({ where: { user_id: userId } });
  },

  findById(id) {
    return Barbershop.findByPk(id);
  }
};
=======

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
>>>>>>> origin/David
