const {
  Barbershop,
  BarbershopSite,
  SitePage,
  SiteSection,
  sequelize,
} = require("../models");

/* ============================================================
   GET BUILDER
============================================================ */
exports.getBuilder = async (req, res) => {
  try {
    const { barbershopId } = req.params;

    const barbershop = await Barbershop.findByPk(barbershopId);
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    const site = await BarbershopSite.findOne({
      where: { barbershop_id: barbershopId },
    });

    if (!site) {
      return res.status(404).json({ error: "Site no encontrado" });
    }

    // Incluimos logo_url de la barbería en el objeto site para el builder
    const siteData = site.toJSON();
    siteData.logo_url = barbershop.logo_url;
    siteData.name = barbershop.name; // Aseguramos el nombre sincronizado

    const pages = await SitePage.findAll({
      where: { site_id: site.id },
      order: [["order_index", "ASC"]],
    });

    const pagesWithSections = await Promise.all(
      pages.map(async (page) => {
        const sections = await SiteSection.findAll({
          where: { page_id: page.id },
          order: [["order_index", "ASC"]],
        });

        const parsedSections = sections.map((s) => {
          const raw = s.toJSON();

          return {
            ...raw,
            content:
              typeof raw.content === "string"
                ? JSON.parse(raw.content)
                : raw.content || {},
            styles:
              typeof raw.styles === "string"
                ? JSON.parse(raw.styles)
                : raw.styles || {},
          };
        });

        return {
          ...page.toJSON(),
          sections: parsedSections,
        };
      })
    );

    res.json({
      site: siteData,
      pages: pagesWithSections,
    });

  } catch (err) {
    console.error("❌ Error getBuilder:", err);
    res.status(500).json({ error: "Error getBuilder" });
  }
};

/* ============================================================
   SAVE BUILDER (TRANSACCIONAL)
============================================================ */
exports.saveBuilder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { siteId, pages, siteMetadata } = req.body;

    if (!siteId || !pages) {
      await transaction.rollback();
      return res.status(400).json({ error: "Datos incompletos" });
    }

    // 0️⃣ Actualizar metadata del sitio si viene
    if (siteMetadata) {
      await BarbershopSite.update(
        {
          name: siteMetadata.name,
          primary_color: siteMetadata.primary_color,
          secondary_color: siteMetadata.secondary_color,
          font_family: siteMetadata.font_family,
        },
        {
          where: { id: siteId },
          transaction,
        }
      );

      // 🔥 También actualizar la Barbería vinculada
      const site = await BarbershopSite.findByPk(siteId, { transaction });
      if (site) {
        await Barbershop.update(
          {
            name: siteMetadata.name !== undefined ? siteMetadata.name : undefined,
            logo_url: siteMetadata.logo_url !== undefined ? siteMetadata.logo_url : undefined,
          },
          {
            where: { id: site.barbershop_id },
            transaction,
          }
        );
      }
    }

    for (const page of pages) {

      // 1️⃣ Actualizar datos de la página
      await SitePage.update(
        {
          title: page.title,
          slug: page.slug,
          order_index: page.order_index,
        },
        {
          where: { id: page.id },
          transaction,
        }
      );

      // 2️⃣ ELIMINAR TODAS LAS SECCIONES EXISTENTES DE ESA PÁGINA
      await SiteSection.destroy({
        where: { page_id: page.id },
        transaction,
      });

      // 3️⃣ CREAR NUEVAMENTE TODAS LAS SECCIONES QUE VIENEN DEL FRONTEND
      for (let i = 0; i < page.sections.length; i++) {
  const section = page.sections[i];

  // 🔍 VALIDACIÓN AQUÍ
  const allowedTypes = ['hero', 'gallery', 'services', 'contact', 'carrito', 'about', 'testimonials'];

  if (!allowedTypes.includes(section.type)) {
    throw new Error(`Tipo inválido: ${section.type}`);
  }

  await SiteSection.create(
    {
      page_id: page.id,
      type: section.type,
      order_index: i + 1,
      content: section.content || {},
      styles: section.styles || {},
      is_visible:
        typeof section.is_visible === "boolean"
          ? section.is_visible
          : true,
    },
    { transaction }
  );
      }
    }

    await transaction.commit();

    res.json({ success: true });

  } catch (err) {
    await transaction.rollback();
    console.error("❌ Error saveBuilder:", err);
    res.status(500).json({ error: "Error saveBuilder" });
  }
};
/* ============================================================
   TOGGLE VISIBILITY
============================================================ */
exports.toggleVisibility = async (req, res) => {
  try {
    const { siteId } = req.params;
    const { is_visible } = req.body;

    if (typeof is_visible === "undefined") {
      return res.status(400).json({
        error: "is_visible requerido",
      });
    }

    const site = await BarbershopSite.findByPk(siteId);

    if (!site) {
      return res.status(404).json({
        error: "Site not found",
      });
    }

    await site.update({
      is_visible,
    });

    res.json({
      success: true,
      siteId,
      is_visible,
    });

  } catch (err) {
    console.error("❌ toggleVisibility error:", err);
    res.status(500).json({
      error: "Error updating visibility",
    });
  }
};
/* ============================================================
   PUBLISH SITE
============================================================ */
exports.publish = async (req, res) => {
  try {
    const { siteId } = req.params;

    const site = await BarbershopSite.findByPk(siteId);

    if (!site) {
      return res.status(404).json({ error: "Site not found" });
    }

    await site.update({
      is_published: true,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("❌ Error publishing:", err);
    res.status(500).json({ error: "Error publishing" });
  }
};