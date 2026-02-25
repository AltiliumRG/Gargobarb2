const BarbershopSite = require("../models/BarbershopSite");
const SitePage = require("../models/SitePage");
const SiteSection = require("../models/SiteSection");
const slugify = require("../utils/slugify");
const TemplateService = require("./siteTemplate.service");

exports.createSiteForBarbershop = async (data, transaction) => {

  // 🔹 crear site SIEMPRE
  const site = await BarbershopSite.create(
    {
      barbershop_id: data.barbershopId,
      slug: slugify(data.name),
      template: "default",
      primary_color: "#111827",
      secondary_color: "#facc15",
      font_family: "Inter",
      status: "draft",
    },
    { transaction }
  );

  // 🔹 intentar cargar template
  let templateData = null;

  try {
    templateData = TemplateService.loadTemplate("default");
  } catch (err) {
    console.warn("⚠️ Template no cargado:", err.message);
  }

  // 🔹 si no hay template, no rompemos nada
  if (!templateData || !templateData.pages) {
    return site;
  }

  // 🔹 crear páginas
  for (const page of templateData.pages) {

    const newPage = await SitePage.create(
      {
        site_id: site.id,
        title: page.title,
        slug: page.slug,
        order_index: page.order,
      },
      { transaction }
    );

    // 🔹 crear secciones
    for (const section of page.sections) {
      await SiteSection.create(
        {
          page_id: newPage.id,
          type: section.type,
          order_index: section.order,
          content: section.content,
          styles: section.styles,
        },
        { transaction }
      );
    }
  }

  return site;
};