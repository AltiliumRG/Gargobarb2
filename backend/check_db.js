const { BarberSchedule, Barbershop } = require("./src/models");
const { sequelize } = require("./src/config/db");

async function test() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB Connected");

    const schedules = await BarberSchedule.findAll();
    console.log("🔍 All Schedules in DB:", JSON.stringify(schedules, null, 2));

    const shops = await Barbershop.findAll({ attributes: ['id', 'name', 'slug'] });
    console.log("🔍 All Barbershops:", JSON.stringify(shops, null, 2));

  } catch (err) {
    console.error("❌ Test failed:", err);
  } finally {
    process.exit();
  }
}

test();
