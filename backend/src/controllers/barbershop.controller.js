/**
 * Barbershop Controller
 * 
 * Logic for managing barbershops, schedules, and public site access.
 */

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

/**
 * Creates a new barbershop for a user.
 * If user is admin (1), they must specify a user_id.
 * If user is barber (2), they can only create one barbershop.
 * 
 * @route POST /api/barbershops
 */
exports.createBarbershop = async (req, res) => {
  try {
    const { name, address, city, user_id, country, department, latitude, longitude, features } = req.body;
    const user = req.user;

    if (!name || !address || !city) {
      return res.status(400).json({ error: "Todos los campos obligatorios (*)" });
    }

    if (!user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    let assignedUserId;

    // Role-based validation
    if (user.role_id === 1) { // Admin
      if (!user_id) return res.status(400).json({ error: "Debe seleccionar un dueño (Barbero)" });

      const owner = await User.findByPk(user_id);
      if (!owner || owner.role_id !== 2) {
        return res.status(400).json({ error: "El usuario seleccionado debe tener rol de Barbero" });
      }
      assignedUserId = owner.id;
    } 
    else if (user.role_id === 2) { // Barber
      const existing = await Barbershop.findOne({ where: { user_id: user.id } });
      if (existing) {
        return res.status(400).json({ error: "Ya tienes una barbería registrada." });
      }
      assignedUserId = user.id;
    } 
    else {
      return res.status(403).json({ error: "No autorizado para crear barberías" });
    }

    const transaction = await sequelize.transaction();

    try {
      // SLUG GENERATION LOGIC (Optimized)
      const baseSlug = slugify(name);
      let slug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness
      let exists = true;
      while (exists) {
        const conflict = await Barbershop.findOne({ where: { slug }, transaction });
        if (conflict) {
          slug = `${baseSlug}-${counter++}`;
        } else {
          exists = false;
        }
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

      // Create associated website for the barbershop
      await SiteService.createSiteForBarbershop({
        barbershopId: newBarbershop.id,
        name,
        template: "default",
        primaryColor: "#111827",
        secondaryColor: "#facc15",
        fontFamily: "Inter",
        features,
      }, transaction);

      await transaction.commit();

      return res.status(201).json({
        message: "Barbería y sitio creados correctamente",
        barbershopId: newBarbershop.id,
        slug: newBarbershop.slug
      });

    } catch (err) {
      if (transaction) await transaction.rollback();
      throw err;
    }

  } catch (error) {
    console.error("❌ createBarbershop Error:", error);
    return res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
};

/**
 * Retrieves all barbershops with optional filtering by role.
 * 
 * @route GET /api/barbershops
 */
exports.getAllBarbershops = async (req, res) => {
  try {
    const user = req.user;
    let where = {};

    // Barbers only see their own
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
          // Clients only see public/published sites
          ...(user.role_id === 3 && {
            required: true,
            where: { is_visible: true, is_published: true },
          }),
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json(barbershops);

  } catch (error) {
    console.error("❌ getAllBarbershops Error:", error);
    res.status(500).json({ error: "Error al obtener lista de barberías" });
  }
};

/**
 * Gets a single barbershop's basic info by ID.
 * 
 * @route GET /api/barbershops/:id
 */
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
    console.error("❌ getBarbershopById Error:", error);
    res.status(500).json({ error: "Error al obtener datos de la barbería" });
  }
};

/**
 * Updates barbershop profile information.
 * 
 * @route PUT /api/barbershops/:id
 */
exports.updateBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, city, user_id, country, department, latitude, longitude, is_active } = req.body;
    const user = req.user;

    const barbershop = await Barbershop.findByPk(id);
    if (!barbershop) return res.status(404).json({ error: "Barbería no encontrada" });

    // Ownership check
    if (user.role_id !== 1 && barbershop.user_id !== user.id) {
      return res.status(403).json({ error: "No tienes permisos para editar esta barbería" });
    }

    // Admin can reassign owner
    if (user.role_id === 1 && user_id) {
      const newOwner = await User.findByPk(user_id);
      if (!newOwner || newOwner.role_id !== 2) {
        return res.status(400).json({ error: "Dueño seleccionado inválido" });
      }
      barbershop.user_id = newOwner.id;
    }

    await barbershop.update({
      name: name !== undefined ? name : barbershop.name,
      address: address !== undefined ? address : barbershop.address,
      city: city !== undefined ? city : barbershop.city,
      country: country !== undefined ? country : barbershop.country,
      department: department !== undefined ? department : barbershop.department,
      latitude: latitude !== undefined ? latitude : barbershop.latitude,
      longitude: longitude !== undefined ? longitude : barbershop.longitude,
      is_active: is_active !== undefined ? is_active : barbershop.is_active,
    });

    res.json({ message: "Barbería actualizada con éxito" });

  } catch (error) {
    console.error("❌ updateBarbershop Error:", error);
    res.status(500).json({ error: "Error al actualizar la información" });
  }
};

/**
 * Retrieves barbershops belonging to the current user.
 * 
 * @route GET /api/barbershops/my
 */
exports.getMyBarbershops = async (req, res) => {
  try {
    const user = req.user;

    const barbershops = await Barbershop.findAll({
      where: { user_id: user.id },
      order: [["created_at", "DESC"]],
    });

    res.json(barbershops);

  } catch (error) {
    res.status(500).json({ error: "Error al obtener tus barberías" });
  }
};

/**
 * Permanently deletes a barbershop.
 * 
 * @route DELETE /api/barbershops/:id
 */
exports.deleteBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const barbershop = await Barbershop.findByPk(id);
    if (!barbershop) return res.status(404).json({ error: "Barbería no encontrada" });

    if (user.role_id !== 1 && barbershop.user_id !== user.id) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    await barbershop.destroy();
    res.json({ message: "Barbería eliminada correctamente" });

  } catch (error) {
    console.error("❌ deleteBarbershop Error:", error);
    res.status(500).json({ error: "Hubo un error al intentar eliminar la barbería" });
  }
};

/* ============================================================
   📍 SCHEDULE MANAGEMENT
============================================================ */

/**
 * Gets weekly schedules for a specific barbershop.
 */
exports.getSchedules = async (req, res) => {
  try {
    const { id } = req.params;
    const schedules = await BarberSchedule.findAll({
      where: { barbershop_id: id },
      order: [["day", "ASC"]],
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener horarios" });
  }
};

/**
 * Saves or updates schedules in bulk for a barbershop.
 */
exports.saveSchedules = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedules } = req.body;

    if (!Array.isArray(schedules)) {
      return res.status(400).json({ error: "El formato de horarios es inválido" });
    }

    await sequelize.transaction(async (t) => {
      // Clear old schedules
      await BarberSchedule.destroy({
        where: { barbershop_id: id },
        transaction: t
      });

      // Insert new ones
      const data = schedules.map((s) => ({
        barbershop_id: id,
        day: s.day,
        open_time: s.open_time,
        close_time: s.close_time,
        is_closed: s.is_closed ? 1 : 0
      }));

      await BarberSchedule.bulkCreate(data, { transaction: t });
    });

    res.json({ message: "Horarios actualizados con éxito" });

  } catch (error) {
    console.error("❌ saveSchedules Error:", error);
    res.status(500).json({ error: "Error al guardar los horarios" });
  }
};

/* ============================================================
   📍 PUBLIC ACCESS
============================================================ */

/**
 * Retrieves full site configuration and sections by slug (for public view).
 * 
 * @route GET /api/barbershops/public/:slug
 */
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
              include: [{ model: SiteSection, as: "sections" }],
            },
          ],
        },
      ],
    });

    if (!barbershop) {
      return res.status(404).json({ error: "Sitio no encontrado" });
    }

    res.json({
      id: barbershop.id,
      name: barbershop.name,
      address: barbershop.address,
      city: barbershop.city,
      site: barbershop.site,
    });

  } catch (error) {
    console.error("❌ getPublicBySlug Error:", error);
    res.status(500).json({ error: "Error al cargar el sitio público" });
  }
};

/**
 * Placeholder for visit registration.
 */
exports.registerVisit = async (req, res) => {
  try {
    // Logic for tracking metrics could go here
    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error registrando visita" });
  }
};