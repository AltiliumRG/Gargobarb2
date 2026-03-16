import HeroRenderer from "./HeroRenderer";
import ServicesRenderer from "./ServicesRenderer";
import GalleryRenderer from "./GalleryRenderer";
import ContactRenderer from "./ContactRenderer";
import CustomRenderer from "./CustomRenderer";
import AboutRenderer from "./AboutRenderer";
import TestimonialsRenderer from "./TestimonialsRenderer";
import CartRenderer from "./CartRenderer";

export default function SectionRendererUniversal({ section, site, preview }) {
  if (!section?.is_visible) return null;

  const content = section.content || {};
  const styles = section.styles || {};

  switch (section.type) {
    case "hero":
      return (
        <HeroRenderer
          section={section}
          content={content}
          styles={styles}
          site={site}
          preview={preview}
        />
      );

    case "services":
      return (
        <ServicesRenderer
          section={section}
          content={content}
          styles={styles}
          site={site}
          preview={preview}
        />
      );

    case "gallery":
      return (
        <GalleryRenderer
          section={section}
          content={content}
          styles={styles}
          preview={preview}
        />
      );

    case "contact":
      return (
        <ContactRenderer
          section={section}
          content={content}
          styles={styles}
          site={site}
          preview={preview}
        />
      );

    case "custom":
      return (
        <CustomRenderer
          section={section}
          content={content}
          styles={styles}
          site={site}
          preview={preview}
        />
      );
      case "about":
  return (
    <AboutRenderer
      section={section}
      content={content}
      styles={styles}
      site={site}
      preview={preview}
    />
  );

case "testimonials":
  return (
    <TestimonialsRenderer
      section={section}
      content={content}
      styles={styles}
      site={site}
      preview={preview}
    />
  );

case "cart":
  return (
    <CartRenderer
      section={section}
      content={content}
      styles={styles}
      site={site}
      preview={preview}
    />
  );

    default:
      return null;
  }
}