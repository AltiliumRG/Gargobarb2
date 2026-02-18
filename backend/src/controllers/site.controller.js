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

    const {
      template = "default",
      colors = {},
      font = "Roboto",
    } = req.body;

    // 1️⃣ VALIDAR BARBERÍA
    const barbershop = await Barbershop.findByPk(barbershopId);
    if (!barbershop) {
      return res.status(404).json({ error: "Barbería no encontrada" });
    }

    // 2️⃣ VALIDAR QUE NO EXISTA SITE
    const existingSite = await BarbershopSite.findOne({
      where: { barbershop_id: barbershopId },
    });

    if (existingSite) {
      return res.status(400).json({
        error: "Esta barbería ya tiene un sitio creado",
      });
    }

    // 3️⃣ CREAR SITE
    const site = await BarbershopSite.create({
      barbershop_id: barbershopId,
      slug: slugify(barbershop.name),
      template,
      primary_color: colors.primary || "#111827",
      secondary_color: colors.secondary || "#facc15",
      font_family: font,
      status: "draft",
    });

    // 4️⃣ CREAR HOME PAGE
    const homePage = await SitePage.create({
      site_id: site.id,
      title: "Inicio",
      slug: "home",
      order_index: 0,
    });

    // 5️⃣ CREAR SECCIONES PROFESIONALES POR DEFECTO
    await SiteSection.bulkCreate([

      /* HERO */
      {
        page_id: homePage.id,
        type: "hero",
        order_index: 0,
        content: {
          title: barbershop.name,
          subtitle: "Estilo, precisión y experiencia",
          text: "Reserva tu cita en segundos",
          buttonText: "Reservar ahora",
          image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033"
        },
        styles: {
          backgroundColor: "#0f172a",
          textColor: "#ffffff",
          align: "center"
        },
        is_visible: true
      },

      /* SERVICES */
      {
        page_id: homePage.id,
        type: "services",
        order_index: 1,
        content: {
          title: "Nuestros servicios",
          items: [
            {
              title: "Corte clásico",
              price: "20$",
              image: "https://picsum.photos/300/301"
            },
            {
              title: "Barba premium",
              price: "15$",
              image: "https://picsum.photos/300/302"
            },
            {
              title: "Tintura",
              price: "30$",
              image: "https://picsum.photos/300/303"
            }
          ]
        },
        styles: {},
        is_visible: true
      },

      /* GALLERY */
      {
        page_id: homePage.id,
        type: "gallery",
        order_index: 2,
        content: {
          title: "Nuestros trabajos",
          images: [
            "https://picsum.photos/400/401",
            "https://picsum.photos/400/402",
            "https://picsum.photos/400/403",
            "https://picsum.photos/400/404"
          ]
        },
        styles: {},
        is_visible: true
      },

      /* ABOUT */
      {
        page_id: homePage.id,
        type: "about",
        order_index: 3,
        content: {
          title: "Sobre nosotros",
          text: "Barberos profesionales con años de experiencia"
        },
        styles: {},
        is_visible: true
      },

      /* CONTACT */
      {
        page_id: homePage.id,
        type: "contact",
        order_index: 4,
        content: {
          title: "Agenda tu cita",
          text: "Contáctanos vía WhatsApp",
          buttonText: "Reservar",
          phone: barbershop.phone || ""
        },
        styles: {},
        is_visible: true
      }

    ]);

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
