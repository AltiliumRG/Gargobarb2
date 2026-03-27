const { getAvailability } = require("./src/controllers/availability.controller");

// Mock req/res
const req = {
  params: { barbershopId: 9 },
  query: { date: "2026-03-20", duration: 30 }
};

const res = {
  status: function(s) { this.statusCode = s; return this; },
  json: function(j) { console.log("JSON Response:", JSON.stringify(j, null, 2)); }
};

async function test() {
  try {
    console.log("🚀 Testing getAvailability...");
    await getAvailability(req, res);
  } catch (err) {
    console.error("💥 Controller CRASHED:", err);
  } finally {
    process.exit();
  }
}

test();
