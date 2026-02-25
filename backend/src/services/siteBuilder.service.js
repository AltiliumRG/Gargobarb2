require("../models");

const { BarbershopSite, SitePage, SiteSection } = require("../models");

exports.getBuilderSite = async (barbershopId) => {

  let site = await BarbershopSite.findOne({
    where: { barbershop_id: barbershopId },
    include: [
      {
        model: SitePage,
        as: "pages",
        include: [{ model: SiteSection, as: "sections" }]
      }
    ],
  });

  if (!site) return null;

  /* ============================================================
     NORMALIZAR DATA PARA BUILDER (CRÍTICO)
  ============================================================ */

  site.pages = site.pages.map(page => {

    page.sections = page.sections
      .map(section => {

        // 🔹 MySQL a veces devuelve JSON como string
        let content = section.content;
        let styles = section.styles;

        if (typeof content === "string") {
          try { content = JSON.parse(content); } catch {}
        }

        if (typeof styles === "string") {
          try { styles = JSON.parse(styles); } catch {}
        }

        // 🔹 fallback para evitar null
        content = content || {};
        styles = styles || {};

        // 🔹 fallback visual si no hay nada
        if (section.type === "services" && !content.items) {
          content.items = [
            { title: "Corte", price: "20$", image: "https://picsum.photos/300/301" },
            { title: "Barba", price: "15$", image: "https://picsum.photos/300/302" },
          ];
        }

        if (section.type === "gallery" && !content.images) {
          content.images = [
            "https://picsum.photos/400/401",
            "https://picsum.photos/400/402",
          ];
        }

        if (section.type === "hero" && !content.image) {
          content.image = "https://images.unsplash.com/photo-1621605815971-fbc98d665033";
        }

        return {
          ...section.toJSON(),
          content,
          styles,
        };
      })
      // 🔹 ordenar correctamente
      .sort((a,b) => a.order_index - b.order_index);

    return page;
  });

  return site;
};



// ============================================================
// 🧱 CREAR SITIO BASE AUTOMÁTICO
// ============================================================

exports.createDefaultSiteStructure = async (barbershopId) => {

  // 🔎 ver si ya existe
  let site = await BarbershopSite.findOne({
    where: { barbershop_id: barbershopId }
  });

  if (site) return site;

  // 🧱 CREAR SITE
  site = await BarbershopSite.create({
    barbershop_id: barbershopId,
    template: "default",
    primary_color: "#111827",
    secondary_color: "#facc15",
    font_family: "Inter",
    status: "draft"
  });

  // 🧱 CREAR PÁGINA HOME
  const homePage = await SitePage.create({
    site_id: site.id,
    title: "Inicio",
    slug: "home",
    order_index: 1
  });

  // 🧱 HERO
  await SiteSection.create({
    page_id: homePage.id,
    type: "hero",
    order_index: 1,
    content: {
      title: "Tu estilo empieza aquí",
      subtitle: "Cortes profesionales y modernos",
      text: "Reserva tu cita con los mejores barberos",
      buttonText: "Reservar cita",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033"
    },
    styles: {
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
      align: "center"
    }
  });

  // 🧱 SERVICES
  await SiteSection.create({
    page_id: homePage.id,
    type: "services",
    order_index: 2,
    content: {
      title: "Nuestros servicios",
      items: [
        { title: "Corte clásico", price: "$20", image: "https://picsum.photos/300/200?1" },
        { title: "Barba premium", price: "$15", image: "https://picsum.photos/300/200?2" },
        { title: "Tintura", price: "$30", image: "https://picsum.photos/300/200?3" }
      ]
    },
    styles: {
      backgroundColor: "#111827",
      textColor: "#fff"
    }
  });

  // 🧱 GALLERY
  await SiteSection.create({
    page_id: homePage.id,
    type: "gallery",
    order_index: 3,
    content: {
      title: "Nuestros trabajos",
      images: [
        "https://picsum.photos/400/300?11",
        "https://picsum.photos/400/300?12",
        "https://picsum.photos/400/300?13",
        "https://picsum.photos/400/300?14"
      ]
    }
  });

  // 🧱 ABOUT
  await SiteSection.create({
    page_id: homePage.id,
    type: "about",
    order_index: 4,
    content: {
      title: "Sobre nosotros",
      text: "Barbería profesional con años de experiencia."
    }
  });

  // 🧱 CONTACT
  await SiteSection.create({
    page_id: homePage.id,
    type: "contact",
    order_index: 5,
    content: {
      title: "Reserva ahora",
      text: "Agenda tu cita",
      buttonText: "WhatsApp"
    }
  });

  return site;
};

exports.saveBuilderSite = async (siteId, pages) => {
  // 1️⃣ Traer páginas reales del site
  const dbPages = await SitePage.findAll({
    where: { site_id: siteId },
    include: [{ model: SiteSection, as: "sections" }],
  });

  // 2️⃣ MAP EXISTENTES
  const existingSections = dbPages.flatMap((p) => p.sections.map((s) => s.id));

  // 3️⃣ RECORRER BUILDER
  for (const page of pages) {
    for (const section of page.sections) {

      // 🔹 SECTION NUEVA (UUID frontend)
      if (typeof section.id === "string") {
        await SiteSection.create({
          page_id: page.id,
          type: section.type,
          content: section.content,
          styles: section.styles,
          order_index: section.order_index,
          is_visible: section.is_visible,
        });
        continue;
      }

      // 🔹 SECTION EXISTENTE
      await SiteSection.update(
        {
          content: section.content,
          styles: section.styles,
          order_index: section.order_index,
          is_visible: section.is_visible,
        },
        { where: { id: section.id } }
      );
    }
  }

  // 4️⃣ BORRAR SECCIONES ELIMINADAS
  const builderSectionIds = pages.flatMap((p) =>
    p.sections.map((s) => (typeof s.id === "number" ? s.id : null))
  );

  await SiteSection.destroy({
    where: {
      id: existingSections.filter((id) => !builderSectionIds.includes(id)),
    },
  });
};

exports.publishSite = async (siteId) => {
  await BarbershopSite.update(
    { status: "published" },
    { where: { id: siteId } }
  );
};
