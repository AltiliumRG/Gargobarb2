const axios = require("axios");

/* ============================================================
   📍 DEPARTAMENTOS COLOMBIA
============================================================ */
exports.getDepartments = async (req, res) => {
  try {

    const response = await axios.get(
      "https://api-colombia.com/api/v1/Department"
    );

    const departments = response.data.map(dep => ({
      id: dep.id,
      name: dep.name
    }));

    res.json(departments);

  } catch (error) {

    console.error("Error obteniendo departamentos:", error.message);

    res.status(500).json({
      error: "Error obteniendo departamentos"
    });
  }
};


/* ============================================================
   📍 CIUDADES POR DEPARTAMENTO
============================================================ */
exports.getCitiesByDepartment = async (req, res) => {
  try {

    const { departmentId } = req.params;

    const response = await axios.get(
      `https://api-colombia.com/api/v1/Department/${departmentId}/cities`
    );

    const cities = response.data.map(city => ({
      id: city.id,
      name: city.name
    }));

    res.json(cities);

  } catch (error) {

    console.error("Error obteniendo ciudades:", error.message);

    res.status(500).json({
      error: "Error obteniendo ciudades"
    });
  }
};