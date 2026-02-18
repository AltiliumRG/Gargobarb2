// backend/src/services/SiteService.js
const BarbershopSite = require("../models/BarbershopSite");
const SitePage = require("../models/SitePage");
const SiteSection = require("../models/SiteSection");
const slugify = require("../utils/slugify");
const TemplateService = require("./SiteTemplateService");

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
    }
  }

  return site;
};
