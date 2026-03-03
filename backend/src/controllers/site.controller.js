// backend/src/controllers/site.controller.js

const {
  Barbershop,
  BarbershopSite,
  SitePage,
  SiteSection,
} = require("../models");

const slugify = require("../utils/slugify");

/* ============================================================
   🧱 CREAR SITIO BASE PROFESIONAL PARA UNA BARBERÍA
============================================================ */
exports.createSiteForBarbershop = async (req, res) => {
  try {
    const { barbershopId } = req.params;

    const barbershop = await Barbershop.findByPk(barbershopId);
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    const existingSite = await BarbershopSite.findOne({
      where: { barbershop_id: barbershopId },
    });

    if (existingSite) {
      return res.status(400).json({
        error: "Esta barbería ya tiene un sitio creado",
      });
    }

    const SiteService = require("../services/site.service");

    const site = await SiteService.createSiteForBarbershop({
      barbershopId,
      name: barbershop.name,
    });

    res.status(201).json({
      message: "Sitio creado correctamente",
      siteId: site.id,
    });

  } catch (error) {
    console.error("❌ Error creando sitio:", error);
    res.status(500).json({ error: "Error al crear el sitio" });
  }
};

/* ============================================================
   🧠 OBTENER SITE COMPLETO (BUILDER)
============================================================ */
exports.getSiteBuilderData = async (req, res) => {
  try {
    const { siteId } = req.params;

    const site = await BarbershopSite.findByPk(siteId, {
      include: {
        model: SitePage,
        as: "pages",
        include: {
          model: SiteSection,
          as: "sections",
        },
      },
    });

    if (!site) {
      return res.status(404).json({ error: "Sitio no encontrado" });
    }

    res.json(site);

  } catch (error) {
    console.error("❌ Error obteniendo site:", error);
    res.status(500).json({ error: "Error al obtener el sitio" });
  }
};
