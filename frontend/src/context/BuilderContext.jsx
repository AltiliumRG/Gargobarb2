import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";
import api from "../api/api";
import { sectionRegistry } from "../components/builder/registry";

const BuilderContext = createContext();

export function BuilderProvider({ children }) {
  const [site, setSite] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPageId, setCurrentPageId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  /* ============================================================
     LOAD SITE
  ============================================================ */
  const loadSite = ({ site, pages }) => {
    setSite(site);

    const normalizedPages = (pages || []).map((p) => ({
      ...p,
      sections: (p.sections || []).map((s) => ({
        ...s,
        content: s.content || {},
        styles: s.styles || {},
      })),
    }));

    setPages(normalizedPages);

    if (normalizedPages.length) {
      setCurrentPageId(normalizedPages[0].id);
    }
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
     ADD SECTION DESDE REGISTRY
  ============================================================ */
  const addSection = (type) => {
    if (!currentPage) return;

    const config = sectionRegistry[type];

    const newSection = {
      id: uuid(),
      type,
      order_index: sections.length,
      content: config?.defaultContent || {},
      styles: config?.defaultStyles || {},
      is_visible: true,
    };

    const updatedPages = pages.map((p) =>
      p.id === currentPageId
        ? { ...p, sections: [...sections, newSection] }
        : p
    );

    setPages(updatedPages);
    setSelectedSectionId(newSection.id);
  };

  /* ============================================================
     UPDATE CONTENT
  ============================================================ */
  const updateSectionContent = (sectionId, newContent) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== currentPageId) return p;

        return {
          ...p,
          sections: p.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  content: {
                    ...(s.content || {}),
                    ...newContent,
                  },
                }
              : s
          ),
        };
      })
    );
  };

  /* ============================================================
     UPDATE STYLES
  ============================================================ */
  const updateSectionStyles = (sectionId, newStyles) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== currentPageId) return p;

        return {
          ...p,
          sections: p.sections.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  styles: {
                    ...(s.styles || {}),
                    ...newStyles,
                  },
                }
              : s
          ),
        };
      })
    );
  };

  /* ============================================================
     DELETE SECTION
  ============================================================ */
  const removeSection = (sectionId) => {
    const updatedPages = pages.map((p) =>
      p.id === currentPageId
        ? {
            ...p,
            sections: p.sections.filter((s) => s.id !== sectionId),
          }
        : p
    );

    setPages(updatedPages);
    setSelectedSectionId(null);
  };

  /* ============================================================
     SAVE
  ============================================================ */
  const saveDraft = async () => {
    if (!site) return;

    await api.post("/sites/builder/save", {
      siteId: site.id,
      pages,
    });

    alert("💾 Guardado");
  };

  /* ============================================================
     PUBLISH
  ============================================================ */
  const publishSite = async () => {
    if (!site) return;

    await api.post(`/sites/builder/publish/${site.id}`);
    alert("🚀 Publicado");
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
        removeSection,

        updateSectionContent,
        updateSectionStyles,

        saveDraft,
        publishSite,

        loadSite,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export const useBuilder = () => useContext(BuilderContext);
