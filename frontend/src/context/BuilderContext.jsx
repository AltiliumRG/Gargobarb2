import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import api from "../api/axios";
import toast from "react-hot-toast";

const BuilderContext = createContext();

export function BuilderProvider({ children }) {
  const [site, setSite] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  /* ============================================================
     TOGGLE VISIBILITY (CORRECTO)
  ============================================================ */
  const toggleSiteVisibility = async (newValue) => {
  if (!site?.id) return false;

  try {
    const res = await api.patch(
      `/sites/builder/visibility/${site.id}`,
      {
        is_visible: newValue
      }
    );

    if (res.status === 200) {
      setSite(prev => ({
        ...prev,
        is_visible: newValue
      }));
      return true;
    }

    return false;
  } catch (err) {
    console.error("❌ Error toggling visibility:", err);
    return false;
  }
};

  /* ============================================================
     LOAD SITE
  ============================================================ */
  const loadSite = ({ site, pages }) => {
    if (!site) return;

    setSite(site);

    const normalizedPages = (pages || []).map((p) => ({
      ...p,
      sections: (p.sections || [])
        .sort((a, b) => a.order_index - b.order_index)
        .map((s) => ({
          ...s,
          content:
            typeof s.content === "string"
              ? JSON.parse(s.content)
              : s.content || {},
          styles:
            typeof s.styles === "string"
              ? JSON.parse(s.styles)
              : s.styles || {},
        })),
    }));

    setPages(normalizedPages);
    setCurrentPageId(normalizedPages[0]?.id || null);
    setSelectedSectionId(null);
  };

  const currentPage = pages.find((p) => p.id === currentPageId);
  const sections = currentPage?.sections || [];

  /* ============================================================
     SELECT SECTION
  ============================================================ */
  const selectSection = (id) => {
    setSelectedSectionId(id);
  };

  /* ============================================================
     UPDATE SECTION CONTENT
  ============================================================ */
  const updateSectionContent = (sectionId, updatedFields) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== currentPageId) return page;

        return {
          ...page,
          sections: page.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  content: {
                    ...section.content,
                    ...updatedFields,
                  },
                }
              : section
          ),
        };
      })
    );
  };

  /* ============================================================
     UPDATE SECTION STYLES
  ============================================================ */
  const updateSectionStyles = (sectionId, updatedStyles) => {
    setPages((prev) =>
      prev.map((page) => {
        if (page.id !== currentPageId) return page;

        return {
          ...page,
          sections: page.sections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,
                  styles: {
                    ...section.styles,
                    ...updatedStyles,
                  },
                }
              : section
          ),
        };
      })
    );
  };

  /* ============================================================
     ADD SECTION
  ============================================================ */
  const addSection = async (type) => {
    if (!currentPage) return;

    try {
      console.log(type);
      const res = await api.get(`/templates/section/${type}`);
      const templateSection = res.data;

      const newSection = {
        id: uuid(),
        type: templateSection.type,
        order_index: sections.length,
        content: templateSection.content || {},
        styles: templateSection.styles || {},
        is_visible: true,
      };

      setPages((prev) =>
        prev.map((p) =>
          p.id === currentPageId
            ? { ...p, sections: [...p.sections, newSection] }
            : p
        )
      );

      setSelectedSectionId(newSection.id);
    } catch (err) {
      console.error("❌ Error cargando template sección:", err);
    }
  };

  /* ============================================================
     MOVE SECTION
  ============================================================ */
  const moveSection = (sectionId, direction) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== currentPageId) return p;

        const index = p.sections.findIndex((s) => s.id === sectionId);
        if (index === -1) return p;

        const newSections = [...p.sections];

        if (direction === "up" && index > 0) {
          [newSections[index - 1], newSections[index]] =
            [newSections[index], newSections[index - 1]];
        }

        if (direction === "down" && index < newSections.length - 1) {
          [newSections[index + 1], newSections[index]] =
            [newSections[index], newSections[index + 1]];
        }

        return {
          ...p,
          sections: newSections.map((s, i) => ({
            ...s,
            order_index: i,
          })),
        };
      })
    );
  };

  /* ============================================================
     REMOVE SECTION
  ============================================================ */
  const removeSection = (sectionId) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== currentPageId) return p;

        const filtered = p.sections.filter((s) => s.id !== sectionId);

        return {
          ...p,
          sections: filtered.map((s, i) => ({
            ...s,
            order_index: i,
          })),
        };
      })
    );

    setSelectedSectionId(null);
  };

  /* ============================================================
     UPDATE SITE SETTINGS
  ============================================================ */
  const updateSiteSettings = (updatedFields) => {
    setSite((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // 🔥 LIMPIADOR DE CONTENT (CRÍTICO)
const cleanContent = (section) => {
  const content = section.content || {};

  if (section.type === "carrito") {
    return {
      title: content.title || "",
      buttonText: content.buttonText || "",
      globalDiscount: Number(content.globalDiscount) || 0,
      items: (content.items || []).map(item => ({
        name: item.name || "",
        price: Number(item.price) || 0,
        description: item.description || "",
        image: item.image || ""
      }))
    };
  }

  return content || {};
};

  /* ============================================================
     SAVE
  ============================================================ */
  const saveDraft = async () => {
    if (!site?.id) return false;

    try {
      // 🔥 LIMPIAR TODAS LAS PAGES
const cleanPages = pages.map(page => ({
  ...page,
  sections: page.sections.map(section => ({
    ...section,
    content: cleanContent(section),
    styles: section.styles || {}
  }))
}));

console.log("📦 CLEAN DATA:", cleanPages); // debug

const res = await api.post("/sites/builder/save", {
  siteId: site.id,
  pages: cleanPages,
  siteMetadata: {
    name: site.name,
    primary_color: site.primary_color,
    secondary_color: site.secondary_color,
    font_family: site.font_family,
    logo_url: site.logo_url,
  },
});

      return res.status === 200;
    } catch (err) {
      console.error("❌ Error saving:", err);
      return false;
    }
  };

  const publishSite = async () => {
    if (!site?.id) return false;

    try {
      // 🕵️ GUARD: Verificar si hay horarios configurados
      const scheduleRes = await api.get(`/barbershops/${site.barbershop_id}/schedules`);
      const schedules = scheduleRes.data || [];

      if (schedules.length === 0) {
        toast.error("No puedes publicar el sitio sin configurar los horarios de atención primero.");
        return false;
      }

      // Auto-save draft before publishing to ensure section UI state persists
      const savedOk = await saveDraft();
      if (!savedOk) return false;

      const res = await api.post(`/sites/builder/publish/${site.id}`);

      if (res.status === 200) {
        setSite((prev) => ({ ...prev, is_published: true }));
        toast.success("¡Sitio publicado con éxito! 🎉");
        return true;
      }

      return false;
    } catch (err) {
      console.error("❌ Error publishing:", err);
      toast.error("Ocurrió un error al intentar publicar.");
      return false;
    }
  };

  return (
    <BuilderContext.Provider
      value={{
    site,
    pages,
    currentPage,
    sections,
    selectedSectionId,

    selectSection,
    addSection,
    moveSection,
    removeSection,

    updateSectionContent,
    updateSectionStyles,
    updateSiteSettings,

    saveDraft,
    publishSite,
    loadSite,

    toggleSiteVisibility
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export const useBuilder = () => useContext(BuilderContext);