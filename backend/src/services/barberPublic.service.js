const { Barbershop, Service, BarberSchedule, BarbershopSite, SitePage, SiteSection } = require("../models");

exports.getBySlug = async (slug) => {
  // 1️⃣ Buscar el sitio por slug
  const site = await BarbershopSite.findOne({
  where: {
    slug,
    is_visible: true,
    is_published: true
  },
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
});

  if (!site) return null;

  // Normalizar JSON de secciones (MySQL compat)
  site.pages?.forEach(page => {
    page.sections?.forEach(section => {
      if (typeof section.content === "string") {
        try { section.content = JSON.parse(section.content); } catch (e) { }
      }
      if (typeof section.styles === "string") {
        try { section.styles = JSON.parse(section.styles); } catch (e) { }
      }
      // fallback
      section.content = section.content || {};
      section.styles = section.styles || {};
    });
    // Ordenar secciones
    page.sections?.sort((a, b) => a.order_index - b.order_index);
  });

  // 2️⃣ Buscar la barbería asociada con sus servicios y horarios
  const barbershop = await Barbershop.findOne({
    where: { id: site.barbershop_id, is_active: true },
    include: [
      {
        model: Service,
        as: "services",
      },
      {
        model: BarberSchedule,
        as: "schedule",
      },
    ],
  });

  if (!barbershop) return null;

  // 3️⃣ Retornar todo junto
  return {
    ...barbershop.toJSON(),
    site: site.toJSON(),
  };
};
