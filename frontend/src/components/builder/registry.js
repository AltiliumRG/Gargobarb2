// ============================================
// 🧠 REGISTRY CENTRAL BUILDER PRO (ELEMENT BASED)
// ============================================

export const sectionRegistry = {

  hero: {
    label: "Hero",

    defaultContent: {
      title: "Tu estilo empieza aquí",
      subtitle: "Cortes profesionales premium",
      text: "Reserva tu cita en segundos",
      buttonText: "Reservar ahora",
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033",
    },

    defaultStyles: {
      backgroundColor: "#0f172a",
      textColor: "#ffffff",
      align: "center",
    }
  },

  services: {
  label: "Servicios",

  defaultContent: {
    title: "Nuestros servicios",
    items: [
      {
        title: "Corte clásico",
        description: "Corte profesional con acabado premium",
        price: "$20",
        image: "https://picsum.photos/300/301",
        buttonText: "Reservar",
        buttonLink: "#"
      },
      {
        title: "Barba premium",
        description: "Perfilado y tratamiento de barba",
        price: "$15",
        image: "https://picsum.photos/300/302",
        buttonText: "Reservar",
        buttonLink: "#"
      }
    ]
  },

  defaultStyles: {
    backgroundColor: "#0f172a",
    textColor: "#ffffff"
  }
    },


  gallery: {
    label: "Galería",

    defaultContent: {
      title: "Nuestros trabajos",
      images: [
        "https://picsum.photos/400/401",
        "https://picsum.photos/400/402",
        "https://picsum.photos/400/403"
      ]
    },

    defaultStyles: {
      backgroundColor: "#0b0b0b",
      textColor: "#ffffff"
    }
  },

  about: {
    label: "Sobre nosotros",

    defaultContent: {
      title: "Nuestra barbería",
      text: "Barberos profesionales con años de experiencia",
      image: "https://picsum.photos/400/500"
    },

    defaultStyles: {
      backgroundColor: "#111827",
      textColor: "#ffffff"
    }
  },

  contact: {
    label: "Contacto",

    defaultContent: {
      title: "Agenda tu cita",
      text: "Contáctanos vía WhatsApp",
      buttonText: "Reservar",
      phone: "+57 3000000000"
    },

    defaultStyles: {
      backgroundColor: "#0f172a",
      textColor: "#ffffff"
    }
  }

};
