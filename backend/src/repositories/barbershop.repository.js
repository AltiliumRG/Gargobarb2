const Barbershop = require("../models/Barbershop");

module.exports = {
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
