const BarbershopRepository = require("../repositories/barbershop.repository");

module.exports = {
  async create(userId, dto) {
    return BarbershopRepository.create({
      user_id: userId,
      ...dto
    });
  },

  async getMy(userId) {
    return BarbershopRepository.findByUser(userId);
  }
};
