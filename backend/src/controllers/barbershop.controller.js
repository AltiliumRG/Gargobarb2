const { Barbershop, User, BarbershopSite } = require("../models");
const SiteService = require("../services/site.service");
<<<<<<< HEAD

/* ============================================================
   📍 Crear barbería (ADMIN o DUEÑO)
============================================================ */
exports.createBarbershop = async (req, res) => {
  try {
    const { name, address, city, user_id } = req.body;
    const user = req.user;

    console.log("📥 BODY:", req.body);
    console.log("👤 USER:", user);

=======
const { sequelize } = require("../config/db");
const slugify = require("../utils/slugify");

/* ============================================================
   📍 Crear barbería
============================================================ */
exports.createBarbershop = async (req, res) => {
  try {
    const { name, address, city, user_id, country, department, latitude, longitude } = req.body;
    const user = req.user;

>>>>>>> origin/David
    if (!name || !address || !city) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

<<<<<<< HEAD
    /* 🛡️ VALIDACIÓN DE UNICIDAD
       Evitamos que se creen múltiples barberías con la misma identidad física.
       Relacionado con:
       - WizardContext.jsx (Paso 0 envía estos datos)
       - models/Barbershop.js (Esquema de BD)
    */
    const existingShop = await Barbershop.findOne({
      where: { name, address, city }
    });

    if (existingShop) {
      return res.status(400).json({
        error: "Ya existe una barbería con ese nombre en esta misma dirección y ciudad."
      });
    }

=======
>>>>>>> origin/David
    if (!user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    let assignedUserId;

<<<<<<< HEAD
    // 👑 ADMIN
    if (user.role_id === 1) {
      if (!user_id) {
        return res
          .status(400)
          .json({ error: "Debe seleccionar un dueño para la barbería" });
      }

      const owner = await User.findByPk(user_id);
      if (!owner) {
        return res.status(404).json({ error: "El usuario asignado no existe" });
      }

      if (owner.role_id !== 2) {
        return res
          .status(400)
          .json({ error: "El usuario asignado debe tener rol de dueño" });
=======
    if (user.role_id === 1) {
      if (!user_id) {
        return res.status(400).json({ error: "Debe seleccionar un dueño" });
      }

      const owner = await User.findByPk(user_id);
      if (!owner || owner.role_id !== 2) {
        return res.status(400).json({ error: "El usuario debe ser dueño" });
>>>>>>> origin/David
      }

      assignedUserId = owner.id;
    }

<<<<<<< HEAD
    // 👤 DUEÑO
    else if (user.role_id === 2) {
      const existing = await Barbershop.findOne({
        where: { user_id: user.id },
      });

=======
    else if (user.role_id === 2) {
      const existing = await Barbershop.findOne({ where: { user_id: user.id } });
>>>>>>> origin/David
      if (existing) {
        return res.status(400).json({
          error: "Ya tienes una barbería registrada. Solo puedes tener una.",
        });
      }

      assignedUserId = user.id;
    }

<<<<<<< HEAD
    // 🚫 OTROS ROLES
    else {
      return res
        .status(403)
        .json({ error: "No tienes permisos para crear barberías" });
    }

    // ✅ CREAR BARBERÍA
    const newBarbershop = await Barbershop.create({
      user_id: assignedUserId,
      name,
      country: req.body.country || "Colombia",
      department: req.body.department,
      city,
      address,
      latitude: req.body.latitude || null,
      longitude: req.body.longitude || null,
    });

    // 🛡️ VALIDACIÓN DE SLUG ÚNICO PARA EL SITIO
    const slugify = require("../utils/slugify");
    const slug = slugify(name);

    const existingSite = await BarbershopSite.findOne({ where: { slug } });
    if (existingSite) {
      // Si el slug existe, podemos borrar la barbería recién creada para evitar inconsistencia
      // o simplemente avisar. Borrarla es más limpio para reintentar.
      await newBarbershop.destroy();
      return res.status(400).json({
        error: "El nombre de la barbería ya está en uso. Por favor elige uno diferente."
      });
    }

    // 🌐 CREAR SITIO WEB POR DEFECTO
    try {
=======
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

>>>>>>> origin/David
      await SiteService.createSiteForBarbershop({
        barbershopId: newBarbershop.id,
        name,
        template: "default",
        primaryColor: "#111827",
        secondaryColor: "#facc15",
        fontFamily: "Inter",
<<<<<<< HEAD
      });
    } catch (siteError) {
      console.error("❌ Error al crear el sitio:", siteError);
      await newBarbershop.destroy();
      throw siteError;
    }

    // ✅ RESPUESTA EXITOSA
    return res.status(201).json({
      message: "Barbería y sitio creados correctamente",
      barbershopId: newBarbershop.id,
    });
  } catch (error) {
    console.error("❌ Error al crear barbería:", error);

    // Si es un error de Sequelize de unicidad
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ error: "Ya existe un sitio con este nombre." });
    }

    return res.status(500).json({ error: error.message || "Error al crear la barbería" });
=======
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
>>>>>>> origin/David
  }
};

/* ============================================================
<<<<<<< HEAD
   📍 Obtener todas las barberías (filtradas según rol)
=======
   📍 Obtener todas
>>>>>>> origin/David
============================================================ */
exports.getAllBarbershops = async (req, res) => {
  try {
    const user = req.user;
    let where = {};

<<<<<<< HEAD
    // 👑 ADMIN → ve todas
    if (user.role_id === 1) {
      where = {};
    }
    // 👤 DUEÑO → solo sus barberías
    else if (user.role_id === 2) {
      where = { user_id: user.id };
    }
    // 👥 CLIENTE → solo barberías activas
    else if (user.role_id === 3) {
      where = { is_active: true };
    }

=======
    if (user.role_id === 2) where = { user_id: user.id };
    if (user.role_id === 3) where = { is_active: true };
>>>>>>> origin/David

    const barbershops = await Barbershop.findAll({
      where,
      include: [
<<<<<<< HEAD
        {
          model: User,
          as: "owner",
          attributes: ["id", "full_name", "email", "username"],
        },
        {
          model: BarbershopSite,
          as: "site",
          attributes: ["status", "slug"],
        },
=======
        { model: User, as: "owner", attributes: ["id", "full_name", "email", "username"] },
        { model: BarbershopSite, as: "site", attributes: ["status", "slug"] },
>>>>>>> origin/David
      ],
      order: [["created_at", "DESC"]],
    });

<<<<<<< HEAD
    console.log(`✅ Enviando ${barbershops.length} barberías. Ejemplo site:`, barbershops[0]?.site);
    res.json(barbershops);
  } catch (error) {
    console.error("❌ Error al obtener barberías:", error);
=======
    res.json(barbershops);
  } catch (error) {
>>>>>>> origin/David
    res.status(500).json({ error: "Error al obtener barberías" });
  }
};

/* ============================================================
<<<<<<< HEAD
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
   ✏️ Actualizar barbería (admin o dueño)
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

    // 🔒 Permisos: admin o dueño propietario
    if (user.role_id !== 1 && barbershop.user_id !== user.id) {
      return res.status(403).json({ error: "No tienes permiso para modificar esta barbería" });
    }

    // 🧩 Si el admin cambia el dueño
    if (user.role_id === 1 && user_id) {
      const newOwner = await User.findByPk(user_id);
      if (!newOwner) {
        return res.status(404).json({ error: "El nuevo dueño no existe" });
      }
      if (newOwner.role_id !== 2) {
        return res.status(400).json({ error: "El nuevo dueño debe tener rol de dueño" });
      }
      barbershop.user_id = newOwner.id;
    }

    // 🔁 Actualizar campos
    await barbershop.update({
      name: name || barbershop.name,
      address: address || barbershop.address,
      city: city || barbershop.city,
      user_id: barbershop.user_id,
    });

    // 🔄 Devolver con datos del dueño actualizados
    const updated = await Barbershop.findByPk(id, {
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "full_name", "email", "username"],
      },
    });

    res.json({ message: "Barbería actualizada con éxito", data: updated });
  } catch (error) {
    console.error("❌ Error al actualizar la barbería:", error);
    res.status(500).json({ error: "Error al actualizar la barbería" });
  }
};
/* ============================================================
   📍 Obtener barberías del dueño autenticado
=======
   📍 Obtener barberías del dueño
>>>>>>> origin/David
============================================================ */
exports.getMyBarbershops = async (req, res) => {
  try {
    const user = req.user;

<<<<<<< HEAD
    if (user.role_id !== 2) {
      return res.status(403).json({ error: "Solo dueños pueden acceder" });
    }

=======
>>>>>>> origin/David
    const barbershops = await Barbershop.findAll({
      where: { user_id: user.id },
      order: [["created_at", "DESC"]],
    });

    res.json(barbershops);
  } catch (error) {
<<<<<<< HEAD
    console.error("❌ Error en getMyBarbershops:", error);
=======
>>>>>>> origin/David
    res.status(500).json({ error: "Error al obtener barberías" });
  }
};

<<<<<<< HEAD

/* ============================================================
   🗑️ Eliminar barbería (solo admin)
============================================================ */
exports.deleteBarbershop = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const barbershop = await Barbershop.findByPk(id);
=======
/* ============================================================
   📍 Obtener por ID
============================================================ */
exports.getBarbershopById = async (req, res) => {
  try {
    const barbershop = await Barbershop.findByPk(req.params.id, {
      include: { model: User, as: "owner" },
    });

>>>>>>> origin/David
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

<<<<<<< HEAD
    // 🔒 Permisos: admin o dueño propietario
    if (user.role_id !== 1 && barbershop.user_id !== user.id) {
      return res.status(403).json({ error: "No tienes permiso para eliminar esta barbería" });
    }

    await barbershop.destroy();

    res.json({ message: "Barbería eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar barbería:", error);
    res.status(500).json({ error: "Error al eliminar la barbería" });
  }
};
=======
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
>>>>>>> origin/David
