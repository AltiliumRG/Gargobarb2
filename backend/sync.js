require("dotenv").config();
const { sequelize } = require("./src/config/db");
const Order = require("./src/models/Order");

async function run() {
  try {
    await Order.sync({ alter: true });
    console.log("Order table synced successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}
run();
