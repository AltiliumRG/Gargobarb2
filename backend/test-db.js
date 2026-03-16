const { sequelize } = require('./src/config/db');
const SiteSection = require('./src/models/SiteSection');
const BarbershopSite = require('./src/models/BarbershopSite');
const Barbershop = require('./src/models/Barbershop');

async function test() {
  try {
    // We already fixed the ENUM in SiteSection.js
    // Let's test if we get an Unknown column issue from BarbershopSite
    const site = await BarbershopSite.build({
      barbershop_id: 1,
      slug: 'test-slug',
      template: 'default'
    });
    // Just try to save, it will fail due to foreign key but we want to see if it complains about has_cart first.
    // Actually, let's just use DESCRIBE mapping
    await sequelize.authenticate();
    const tableStructure = await sequelize.query("DESCRIBE barbershop_sites");
    console.log("DB columns for barbershop_sites:", tableStructure[0].map(c => c.Field));
    process.exit(0);
  } catch (err) {
    console.error("Test Error:", err);
    process.exit(1);
  }
}
test();
