const BarbershopRepository = require("../repositories/BarbershopRepository");

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
