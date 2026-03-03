const axios = require("axios");

exports.getDepartments = async () => {
  try {
    const res = await axios.get("https://api-colombia.com/api/v1/Department");
    return res.data;
  } catch (error) {
    console.error("🔥 ERROR API COLOMBIA:", error.message);
    throw error;
  }
};