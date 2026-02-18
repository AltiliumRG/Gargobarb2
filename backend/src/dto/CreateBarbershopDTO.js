module.exports = class CreateBarbershopDTO {
  constructor({ name, address, city }) {
    if (!name || !address || !city) {
      throw new Error("name, address y city son obligatorios");
    }

    this.name = name.trim();
    this.address = address.trim();
    this.city = city.trim();
  }
};
