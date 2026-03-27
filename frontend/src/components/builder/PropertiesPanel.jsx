import React, { useState, useEffect } from "react";
import { useBuilder } from "../../context/BuilderContext";
import { useBarber } from "../../context/BarberContext";
import { getServicesByBarbershop } from "../../api/services.api";

// Sub-components (Property Editors)
import GlobalSettings from "./PropertyEditors/Editors/GlobalSettings";
import HeroEditor from "./PropertyEditors/Editors/HeroEditor";
import AboutEditor from "./PropertyEditors/Editors/AboutEditor";
import TestimonialsEditor from "./PropertyEditors/Editors/TestimonialsEditor";
import ServicesEditor from "./PropertyEditors/Editors/ServicesEditor";
import GalleryEditor from "./PropertyEditors/Editors/GalleryEditor";
import ContactEditor from "./PropertyEditors/Editors/ContactEditor";
import CartEditor from "./PropertyEditors/Editors/CartEditor";

/**
 * PropertiesPanel - Main Builder Side Panel
 * 
 * This component acts as a router/container for the various property editors.
 * It detects the selected section type and renders the appropriate editor component.
 */
export default function PropertiesPanel() {
  const {
    sections,
    selectedSectionId,
    updateSectionContent,
    updateSectionStyles,
    updateSiteSettings,
    site,
  } = useBuilder();

  const { activeBarbershop, services, setServices, products, setProducts } = useBarber();
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [savingId, setSavingId] = useState(null);

  // Load services if a barbershop is active
  useEffect(() => {
    if (!activeBarbershop?.id) return;

    const loadServices = async () => {
      try {
        setLoadingServices(true);
        const res = await getServicesByBarbershop(activeBarbershop.id);
        setServices(res.data);
      } catch (err) {
        console.error("❌ Error loading services:", err);
      } finally {
        setLoadingServices(false);
      }
    };

    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await getProductsByBarbershop(activeBarbershop.id);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error loading products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadServices();
    loadProducts();
  }, [activeBarbershop?.id, setServices, setProducts]);

  // If no section is selected, show Global Settings
  if (!selectedSectionId) {
    return <GlobalSettings site={site} updateSiteSettings={updateSiteSettings} />;
  }

  const section = sections.find((s) => s.id === selectedSectionId);
  if (!section) return null;

  // Helper functions to pass down to editors
  const handleContent = (key, value) => {
    updateSectionContent(section.id, { [key]: value });
  };

  const handleStyle = (key, value) => {
    updateSectionStyles(section.id, { [key]: value });
  };

  /**
   * Section Selector
   * Renders the specific editor based on section type
   */
  const renderEditor = () => {
    const commonProps = {
      content: section.content || {},
      styles: section.styles || {},
      handleContent,
      handleStyle,
      sectionId: section.id
    };

    switch (section.type) {
      case "hero":
        return <HeroEditor {...commonProps} />;
      case "about":
        return <AboutEditor {...commonProps} />;
      case "testimonials":
        return <TestimonialsEditor {...commonProps} />;
      case "services":
        return (
          <ServicesEditor 
            {...commonProps} 
            activeBarbershop={activeBarbershop} 
            services={services} 
            setServices={setServices} 
            loadingServices={loadingServices}
            savingId={savingId}
            setSavingId={setSavingId}
          />
        );
      case "gallery":
        return <GalleryEditor {...commonProps} />;
      case "contact":
        return <ContactEditor {...commonProps} />;
      case "cart":
        return (
          <CartEditor 
            {...commonProps} 
            activeBarbershop={activeBarbershop} 
            products={products} 
            setProducts={setProducts} 
            loadingProducts={loadingProducts}
            savingId={savingId}
            setSavingId={setSavingId}
          />
        );
      default:
        return (
          <div className="p-10 text-center text-gray-500 italic">
            Esta sección ({section.type}) no tiene un editor aún.
          </div>
        );
    }
  };

  return (
    <aside className="h-full flex flex-col text-white">
      {/* PANEL HEADER */}
      <div className="p-4 border-b border-gray-800 flex-shrink-0">
        <h2 className="text-lg font-bold">Editor de sección</h2>
      </div>

      {/* SCROLLABLE EDITOR CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {renderEditor()}
      </div>
    </aside>
  );
}