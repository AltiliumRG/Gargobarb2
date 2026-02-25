const { Barbershop, User, BarbershopSite } = require("../models");
const SiteService = require("../services/site.service");
const { sequelize } = require("../config/db");
const slugify = require("../utils/slugify");

/* ============================================================
   📍 Crear barbería
============================================================ */
exports.createBarbershop = async (req, res) => {
  try {
    const { name, address, city, user_id, country, department, latitude, longitude } = req.body;
    const user = req.user;

    if (!name || !address || !city) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (!user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    let assignedUserId;

    if (user.role_id === 1) {
      if (!user_id) {
        return res.status(400).json({ error: "Debe seleccionar un dueño" });
      }

      const owner = await User.findByPk(user_id);
      if (!owner || owner.role_id !== 2) {
        return res.status(400).json({ error: "El usuario debe ser dueño" });
      }

      assignedUserId = owner.id;
    }

    else if (user.role_id === 2) {
      const existing = await Barbershop.findOne({ where: { user_id: user.id } });
      if (existing) {
        return res.status(400).json({
          error: "Ya tienes una barbería registrada. Solo puedes tener una.",
        });
      }

      assignedUserId = user.id;
    }

    else {
      return res.status(403).json({ error: "No autorizado" });
    }

    const transaction = await sequelize.transaction();

    try {
      const baseSlug = slugify(name);
      let slug = baseSlug;
      let counter = 1;

      while (await Barbershop.findOne({ where: { slug }, transaction })) {
        slug = `${baseSlug}-${counter++}`;
      }

      const newBarbershop = await Barbershop.create({
        user_id: assignedUserId,
        name,
        slug,
        country: country || "Colombia",
        department,
        city,
        address,
        latitude: latitude || null,
        longitude: longitude || null,
      }, { transaction });

      await SiteService.createSiteForBarbershop({
        barbershopId: newBarbershop.id,
        name,
        template: "default",
        primaryColor: "#111827",
        secondaryColor: "#facc15",
        fontFamily: "Inter",
      }, transaction);

      await transaction.commit();

      return res.status(201).json({
        message: "Barbería y sitio creados correctamente",
        barbershopId: newBarbershop.id,
      });

    } catch (err) {
      await transaction.rollback();
      throw err;
    }

  } catch (error) {
    console.error("❌ Error:", error);
    return res.status(500).json({ error: error.message || "Error interno" });
  }
};

/* ============================================================
   📍 Obtener todas
============================================================ */
exports.getAllBarbershops = async (req, res) => {
  try {
    const user = req.user;
    let where = {};

    if (user.role_id === 2) where = { user_id: user.id };
    if (user.role_id === 3) where = { is_active: true };

    const barbershops = await Barbershop.findAll({
      where,
      include: [
        { model: User, as: "owner", attributes: ["id", "full_name", "email", "username"] },
        { model: BarbershopSite, as: "site", attributes: ["status", "slug"] },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(barbershops);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener barberías" });
  }
};

/* ============================================================
   📍 Obtener barberías del dueño
============================================================ */
exports.getMyBarbershops = async (req, res) => {
  try {
    const user = req.user;

    const barbershops = await Barbershop.findAll({
      where: { user_id: user.id },
      order: [["created_at", "DESC"]],
    });

    res.json(barbershops);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener barberías" });
  }
};

/* ============================================================
   📍 Obtener por ID
============================================================ */
exports.getBarbershopById = async (req, res) => {
  try {
    const barbershop = await Barbershop.findByPk(req.params.id, {
      include: { model: User, as: "owner" },
    });

    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    res.json(barbershop);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la barbería" });
  }
};

/* ============================================================
   ✏️ Actualizar
============================================================ */
exports.updateBarbershop = async (req, res) => {
  try {
    const barbershop = await Barbershop.findByPk(req.params.id);
    if (!barbershop) return res.status(404).json({ error: "No encontrada" });

    await barbershop.update(req.body);

    res.json({ message: "Actualizada", data: barbershop });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
};

/* ============================================================
   🗑️ Eliminar
============================================================ */
exports.deleteBarbershop = async (req, res) => {
  try {
    const barbershop = await Barbershop.findByPk(req.params.id);
    if (!barbershop) return res.status(404).json({ error: "No encontrada" });

    await barbershop.destroy();
    res.json({ message: "Eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar" });
  }
};