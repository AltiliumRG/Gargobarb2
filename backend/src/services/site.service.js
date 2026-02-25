<<<<<<< HEAD
// backend/src/services/SiteService.js
=======
>>>>>>> origin/David
const BarbershopSite = require("../models/BarbershopSite");
const SitePage = require("../models/SitePage");
const SiteSection = require("../models/SiteSection");
const slugify = require("../utils/slugify");
const TemplateService = require("./siteTemplate.service");

<<<<<<< HEAD
exports.createSiteForBarbershop = async ({
  barbershopId,
  name,
  template = "default",
  primaryColor,
  secondaryColor,
  fontFamily,
}) => {
  // 1️⃣ Crear SITE
  const site = await BarbershopSite.create({
    barbershop_id: barbershopId,
    slug: slugify(name),
    template,
    primary_color: primaryColor,
    secondary_color: secondaryColor,
    font_family: fontFamily,
    status: "draft",
  });

  // 2️⃣ Cargar template
  const templateData = TemplateService.loadTemplate(template);

  // 3️⃣ Crear páginas y secciones
  for (const page of templateData.pages) {
    const newPage = await SitePage.create({
      site_id: site.id,
      title: page.title,
      slug: page.slug,
      order_index: page.order,
    });

    for (const section of page.sections) {
      await SiteSection.create({
        page_id: newPage.id,
        type: section.type,
        order_index: section.order,
        content: section.content,
        styles: section.styles,
      });
=======
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
>>>>>>> origin/David
    }
  }

  return site;
<<<<<<< HEAD
};
=======
};
>>>>>>> origin/David
