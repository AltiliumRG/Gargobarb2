// backend/src/controllers/service.controller.js

const { Service, Barbershop } = require("../models");

/* ============================================================
   CREAR SERVICIO
============================================================ */
exports.createService = async (req, res) => {
  try {
    const {
      barbershop_id,
      name,
      description,
      price,
      duration_minutes,
      is_active,
      image
    } = req.body;

    // Validación
    if (
      !barbershop_id ||
      !name ||
      price == null ||
      duration_minutes == null
    ) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Verificar que exista la barbería
    const barbershop = await Barbershop.findByPk(barbershop_id);
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    const service = await Service.create({
      barbershop_id,
      name,
      description,
      price,
      duration_minutes,
      is_active: is_active ?? true,
      image
    });

    res.status(201).json(service);

  } catch (error) {
    console.error("❌ Error al crear servicio:", error);
    res.status(500).json({
      error: "Error al crear servicio",
      detail: error.message
    });
  }
};

/* ============================================================
   OBTENER TODOS LOS SERVICIOS (ADMIN)
============================================================ */
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      include: [
        {
          model: Barbershop,
          as: "barbershop",
          attributes: ["id", "name", "city"]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(services);

  } catch (error) {
    console.error("❌ Error al obtener servicios:", error);
    res.status(500).json({ error: "Error al obtener servicios" });
  }
};

/* ============================================================
   OBTENER SERVICIO POR ID
============================================================ */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        {
          model: Barbershop,
          as: "barbershop",
          attributes: ["id", "name", "city"]
        }
      ]
    });

    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.json(service);

  } catch (error) {
    console.error("❌ Error al obtener servicio:", error);
    res.status(500).json({ error: "Error al obtener servicio" });
  }
};

/* ============================================================
   OBTENER SERVICIOS POR BARBERÍA (PÚBLICO)
============================================================ */
exports.getServicesByBarbershop = async (req, res) => {
  try {
    const { id } = req.params;

    const services = await Service.findAll({
      where: {
        barbershop_id: id,
        is_active: true // 🔥 SOLO ACTIVOS
      },
      attributes: [
  "id",
  "name",
  "description",
  "price",
  "duration_minutes",
  "image"
],
      order: [["createdAt", "DESC"]],
    });

    res.json(services);

  } catch (error) {
    console.error("❌ Error obteniendo servicios:", error);
    res.status(500).json({ error: "Error obteniendo servicios" });
  }
};

/* ============================================================
   ACTUALIZAR SERVICIO
============================================================ */
exports.updateService = async (req, res) => {
  try {
    const { name, description, price, duration_minutes, is_active, image } = req.body;

    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    await service.update({
  name,
  description,
  price,
  duration_minutes,
  is_active,
  image
});

    res.json({
      message: "Servicio actualizado correctamente",
      service
    });

  } catch (error) {
    console.error("❌ Error al actualizar servicio:", error);
    res.status(500).json({ error: "Error al actualizar servicio" });
  }
};

/* ============================================================
   ELIMINAR SERVICIO
============================================================ */
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.id);

    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    await service.destroy();

    res.json({ message: "Servicio eliminado correctamente" });

  } catch (error) {
    console.error("❌ Error al eliminar servicio:", error);
    res.status(500).json({ error: "Error al eliminar servicio" });
  }
};