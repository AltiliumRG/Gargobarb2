const {
  Barbershop,
  User,
  BarbershopSite,
  SitePage,
  SiteSection,
  BarberSchedule
} = require("../models");

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

    if (user.role_id === 2) {
      where = { user_id: user.id };
    }

    const barbershops = await Barbershop.findAll({
      where,
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "full_name", "email", "username"],
        },
        {
          model: BarbershopSite,
          as: "site",
          attributes: ["slug", "is_visible", "is_published"],
          ...(user.role_id === 3 && {
            required: true,
            where: {
              is_visible: true,
              is_published: true,
            },
          }),
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(barbershops);

  } catch (error) {
    console.error("❌ Error al obtener barberías:", error);
    res.status(500).json({ error: "Error al obtener barberías" });
  }
};

/* ============================================================
   📍 Obtener barbería por ID
============================================================ */
exports.getBarbershopById = async (req, res) => {
  try {
    const { id } = req.params;

    const barbershop = await Barbershop.findByPk(id, {
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email", "username"],
      },
    });

    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    res.json(barbershop);

  } catch (error) {
    console.error("❌ Error al obtener la barbería:", error);
    res.status(500).json({ error: "Error al obtener la barbería" });
  }
};

/* ============================================================
   ✏️ Actualizar barbería
============================================================ */
exports.updateBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, user_id } = req.body;
    const user = req.user;

    const barbershop = await Barbershop.findByPk(id);
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    if (user.role_id !== 1 && barbershop.user_id !== user.id) {
      return res.status(403).json({ error: "No tienes permiso" });
    }

    if (user.role_id === 1 && user_id) {
      const newOwner = await User.findByPk(user_id);
      if (!newOwner || newOwner.role_id !== 2) {
        return res.status(400).json({ error: "Dueño inválido" });
      }
      barbershop.user_id = newOwner.id;
    }

    await barbershop.update({
      name: name || barbershop.name,
      address: address || barbershop.address,
      city: city || barbershop.city,
    });

    res.json({ message: "Barbería actualizada correctamente" });

  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    res.status(500).json({ error: "Error al actualizar barbería" });
  }
};

/* ============================================================
   📍 Mis barberías
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
   🗑 Eliminar barbería
============================================================ */
exports.deleteBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const barbershop = await Barbershop.findByPk(id);
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    if (user.role_id !== 1 && barbershop.user_id !== user.id) {
      return res.status(403).json({ error: "No tienes permiso" });
    }

    await barbershop.destroy();
    res.json({ message: "Barbería eliminada correctamente" });

  } catch (error) {
    console.error("❌ Error eliminando:", error);
    res.status(500).json({ error: "Error eliminando barbería" });
  }
};

/* ============================================================
   HORARIOS
============================================================ */
exports.getSchedules = async (req, res) => {
  try {
    const { id } = req.params;

    const schedules = await BarberSchedule.findAll({
      where: { barbershop_id: id },
      order: [["day", "ASC"]],
    });

    res.json(schedules);

  } catch (error) {
    console.error("❌ Error obteniendo horarios:", error);
    res.status(500).json({ error: "Error obteniendo horarios" });
  }
};

exports.saveSchedules = async (req, res) => {
  try {
    const { id } = req.params;
    const schedules = req.body;

    await BarberSchedule.destroy({ where: { barbershop_id: id } });

    const formatted = schedules.map((s) => ({
      day: s.day,
      open_time: s.open_time,
      close_time: s.close_time,
      is_closed: s.is_closed,
      barbershop_id: id,
    }));

    await BarberSchedule.bulkCreate(formatted);

    res.json({ message: "Horarios guardados correctamente" });

  } catch (error) {
    console.error("❌ Error guardando horarios:", error);
    res.status(500).json({ error: "Error guardando horarios" });
  }
};

/* ============================================================
   🌍 PÚBLICO POR SLUG
============================================================ */
exports.getPublicBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const barbershop = await Barbershop.findOne({
      where: { slug },
      include: [
        {
          model: BarbershopSite,
          as: "site",
          include: [
            {
              model: SitePage,
              as: "pages",
              include: [
                {
                  model: SiteSection,
                  as: "sections",
                },
              ],
            },
          ],
        },
      ],
    });

    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    res.json({
      id: barbershop.id,
      name: barbershop.name,
      address: barbershop.address,
      city: barbershop.city,
      site: barbershop.site,
    });

  } catch (error) {
    console.error("❌ Error getPublicBySlug:", error);
    res.status(500).json({ error: "Error obteniendo barbería pública" });
  }
};

/* ============================================================
   📊 REGISTRAR VISITA (ESTABLE)
============================================================ */
exports.registerVisit = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error registrando visita" });
  }
};